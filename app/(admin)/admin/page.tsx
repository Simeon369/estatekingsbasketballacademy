"use client";

import { useEffect } from "react";
import Link from "next/link";
import { IoCalendar, IoImages } from "react-icons/io5";
import { getAdminToken } from "@/lib/admin/client";
import AdminShell from "@/components/admin/AdminShell";

export default function AdminIndexPage() {
  useEffect(() => {
    if (!getAdminToken()) window.location.href = "/admin/login";
  }, []);

  return (
    <AdminShell
      title="Content admin"
      subtitle="Manage announcements and gallery photos shown on the live site. Programs and training schedule are defined in the site code."
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Link
          href="/admin/events"
          className="group flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-colors hover:border-primary/40 hover:bg-primary/[0.03]"
        >
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary text-white">
            <IoCalendar className="h-6 w-6" />
          </div>
          <div>
            <h2 className="font-heading text-xl text-slate-900 group-hover:text-primary">
              Events &amp; announcements
            </h2>
            <p className="mt-1 text-sm text-slate-600">Banner, title, details, time, and location.</p>
          </div>
        </Link>
        <Link
          href="/admin/gallery"
          className="group flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-colors hover:border-primary/40 hover:bg-primary/[0.03]"
        >
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-800 text-white">
            <IoImages className="h-6 w-6" />
          </div>
          <div>
            <h2 className="font-heading text-xl text-slate-900 group-hover:text-primary">Gallery</h2>
            <p className="mt-1 text-sm text-slate-600">Upload images and captions for the public gallery.</p>
          </div>
        </Link>
      </div>
    </AdminShell>
  );
}
