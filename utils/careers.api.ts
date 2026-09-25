export interface JobApplicationData {
  jobId: string;
  jobSlug: string;
  jobTitle: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  experience?: string;
  linkedIn?: string;
  resume: File;
}

export interface JobApplicationResponse {
  success: boolean;
  message: string;
  errors?: Record<string, string>;
}

export async function submitJobApplication(data: JobApplicationData): Promise<JobApplicationResponse> {
  const fd = new FormData();
  fd.append('jobId', data.jobId);
  fd.append('jobSlug', data.jobSlug);
  fd.append('jobTitle', data.jobTitle);
  fd.append('name', data.name);
  fd.append('email', data.email);
  fd.append('phone', data.phone);
  fd.append('city', data.city);
  if (data.experience) fd.append('experience', data.experience);
  if (data.linkedIn) fd.append('linkedIn', data.linkedIn);
  fd.append('resume', data.resume);

  const res = await fetch('/api/careers/apply', {
    method: 'POST',
    body: fd,
  });

  const json = (await res.json()) as JobApplicationResponse;

  if (!res.ok || !json.success) {
    const fieldErrors = json.errors ? Object.values(json.errors).filter(Boolean).join(' ') : '';
    throw new Error(fieldErrors || json.message || 'Failed to submit application. Please try again.');
  }

  return json;
}
