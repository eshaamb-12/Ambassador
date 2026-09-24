'use client';

import Link from 'next/link';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { MANAGED_PAGES } from '@/lib/sitePages.types';

export default function PagesManagementPage() {
  return (
    <DashboardLayout>
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Pages</h1>
          <p className="mt-2 text-gray-600">
            Edit storefront pages section by section. More pages will be added here over time.
          </p>
        </div>

        <ul className="divide-y divide-gray-200 rounded-xl border border-gray-200 bg-white shadow-sm">
          {MANAGED_PAGES.map((page) => (
            <li key={page.slug}>
              <Link
                href={`/pages-management/${page.slug}`}
                className="flex flex-col gap-1 px-6 py-5 transition-colors hover:bg-gray-50 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-semibold text-gray-900">{page.title}</p>
                  <p className="text-sm text-gray-500">{page.description}</p>
                </div>
                <span className="text-sm font-medium text-[#0F4C69]">
                  Edit → <span className="text-gray-400 font-normal">({page.path})</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </DashboardLayout>
  );
}
