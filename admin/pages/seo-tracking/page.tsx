'use client';

import DashboardLayout from '@/components/dashboard/DashboardLayout';
import SeoTrackingSection from '@/admin/pages/settings/SeoTrackingSection';

export default function SeoTrackingPage() {
  return (
    <DashboardLayout>
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">SEO & Tracking</h1>
          <p className="mt-2 text-gray-600">
            Google Analytics, Tag Manager, Search Console, and custom header/footer scripts for the
            public site.
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <SeoTrackingSection />
        </div>
      </div>
    </DashboardLayout>
  );
}
