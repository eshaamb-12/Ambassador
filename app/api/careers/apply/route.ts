import { after, NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import type { UploadApiResponse } from 'cloudinary';
import connectDB from '@/backend/config/db';
import CareerApplication from '@/backend/models/CareerApplication.model';
import CareerJob from '@/backend/models/CareerJob.model';
import {
  getContactInboxEmail,
  isSmtpConfigured,
  sendJobApplicationConfirmationEmail,
  sendJobApplicationInquiryEmail,
  type JobApplicationPayload,
} from '@/utils/email.util';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const ALLOWED_RESUME_TYPES = new Set([
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]);
const MAX_RESUME_BYTES = 5 * 1024 * 1024;

function resumeExtension(name: string): string {
  const parts = name.toLowerCase().split('.');
  return parts.length > 1 ? (parts.pop() ?? '') : '';
}

function isAllowedResumeFile(file: File): boolean {
  if (ALLOWED_RESUME_TYPES.has(file.type)) return true;
  const ext = resumeExtension(file.name);
  return ext === 'pdf' || ext === 'doc' || ext === 'docx';
}

function configureCloudinary(): boolean {
  const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;
  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    return false;
  }
  cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
  });
  return true;
}

function uploadResumeBuffer(buffer: Buffer, originalName: string): Promise<string> {
  const safeName = originalName.replace(/[^\w.\-()+ ]/g, '_').slice(0, 120);
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: 'ambassador/careers/resumes',
        resource_type: 'raw',
        public_id: `${Date.now()}-${safeName.replace(/\.\w+$/, '')}`,
      },
      (error: Error | undefined, result: UploadApiResponse | undefined) => {
        if (error || !result?.secure_url) {
          reject(error ?? new Error('Resume upload failed.'));
        } else {
          resolve(result.secure_url);
        }
      },
    );
    stream.end(buffer);
  });
}

function validateFields(
  body: Record<string, string>,
  resume: File | null,
): {
  data?: Omit<JobApplicationPayload, 'jobDepartment' | 'jobLocation' | 'resumeUrl' | 'resumeFileName'> & {
    resumeBuffer: Buffer;
    resumeFileName: string;
    resumeMimeType: string;
  };
  errors: Record<string, string>;
} {
  const errors: Record<string, string> = {};

  const jobSlug = body.jobSlug?.trim().toLowerCase() ?? '';
  const name = body.name?.trim() ?? '';
  const email = body.email?.trim().toLowerCase() ?? '';
  const phone = body.phone?.trim() ?? '';
  const city = body.city?.trim() ?? '';
  const experience = body.experience?.trim() ?? '';
  const linkedIn = body.linkedIn?.trim() ?? '';

  if (!jobSlug) errors.jobSlug = 'Invalid job posting.';
  if (!name || name.length < 2) errors.name = 'Please enter your full name.';
  if (!email || !/^\S+@\S+\.\S+$/.test(email)) errors.email = 'Please enter a valid email address.';
  if (!phone || phone.length < 7) errors.phone = 'Please enter a valid phone number.';
  if (!city || city.length < 2) errors.city = 'Please enter your city.';

  if (!resume || !(resume instanceof File) || resume.size === 0) {
    errors.resume = 'Please upload your resume or CV.';
  } else if (resume.size > MAX_RESUME_BYTES) {
    errors.resume = 'Resume must be 5 MB or smaller.';
  } else if (!isAllowedResumeFile(resume)) {
    errors.resume = 'Resume must be a PDF or Word document (.pdf, .doc, .docx).';
  }

  if (Object.keys(errors).length > 0) return { errors };

  return {
    data: {
      jobId: body.jobId ?? '',
      jobSlug,
      jobTitle: body.jobTitle ?? '',
      name,
      email,
      phone,
      city,
      experience: experience || undefined,
      linkedIn: linkedIn || undefined,
      resumeBuffer: Buffer.from([]),
      resumeFileName: resume!.name,
      resumeMimeType: resume!.type,
    },
    errors,
  };
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const form = await req.formData();
    const resumeEntry = form.get('resume');
    const resume =
      resumeEntry instanceof File && resumeEntry.size > 0 ? resumeEntry : null;

    const body: Record<string, string> = {
      jobId: String(form.get('jobId') ?? ''),
      jobSlug: String(form.get('jobSlug') ?? ''),
      jobTitle: String(form.get('jobTitle') ?? ''),
      name: String(form.get('name') ?? ''),
      email: String(form.get('email') ?? ''),
      phone: String(form.get('phone') ?? ''),
      city: String(form.get('city') ?? ''),
      experience: String(form.get('experience') ?? ''),
      linkedIn: String(form.get('linkedIn') ?? ''),
    };

    const { data, errors } = validateFields(body, resume);

    if (!data || !resume) {
      const firstError = Object.values(errors)[0] ?? 'Please check the form and try again.';
      return NextResponse.json({ success: false, message: firstError, errors }, { status: 422 });
    }

    const job = await CareerJob.findOne({ slug: data.jobSlug, status: 'active' }).lean();
    if (!job) {
      return NextResponse.json(
        { success: false, message: 'This job is no longer available.' },
        { status: 404 },
      );
    }

    const resumeBuffer = Buffer.from(await resume.arrayBuffer());
    data.resumeBuffer = resumeBuffer;

    let resumeUrl = '';
    if (configureCloudinary()) {
      try {
        resumeUrl = await uploadResumeBuffer(resumeBuffer, resume.name);
      } catch (uploadErr) {
        console.warn('[careers/apply] Cloudinary resume upload failed:', uploadErr);
      }
    }

    const payload: JobApplicationPayload = {
      jobId: String(job._id),
      jobSlug: data.jobSlug,
      jobTitle: job.title,
      jobDepartment: job.department,
      jobLocation: job.location,
      name: data.name,
      email: data.email,
      phone: data.phone,
      city: data.city,
      experience: data.experience,
      linkedIn: data.linkedIn,
      resumeUrl: resumeUrl || undefined,
      resumeFileName: data.resumeFileName,
    };

    await CareerApplication.create({
      jobId: job._id,
      jobSlug: data.jobSlug,
      jobTitle: job.title,
      name: data.name,
      email: data.email,
      phone: data.phone,
      city: data.city,
      experience: data.experience,
      linkedIn: data.linkedIn,
      resumeFileName: data.resumeFileName,
      resumeUrl: resumeUrl || undefined,
      resumeData: resumeUrl ? undefined : resumeBuffer,
    });

    if (isSmtpConfigured()) {
      try {
        await sendJobApplicationInquiryEmail(payload, {
          filename: data.resumeFileName,
          content: resumeBuffer,
          contentType: data.resumeMimeType,
        });
      } catch (emailErr) {
        console.warn('[careers/apply] HR notification email failed:', emailErr);
      }

      after(async () => {
        try {
          await sendJobApplicationConfirmationEmail(payload);
        } catch (confirmErr) {
          console.warn('[careers/apply] confirmation email failed:', confirmErr);
        }
      });
    } else {
      console.warn('[careers/apply] SMTP not configured; application stored in database only.');
    }

    const inbox = getContactInboxEmail();
    return NextResponse.json(
      {
        success: true,
        message: `Your application for "${job.title}" was submitted successfully. Our HR team at ${inbox} will contact you soon.`,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('[careers/apply]', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Unable to submit your application right now. Please try again or email info@ambassador.pk.',
      },
      { status: 500 },
    );
  }
}
