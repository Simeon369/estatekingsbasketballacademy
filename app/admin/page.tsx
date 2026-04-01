 "use client";

import { useEffect } from "react";
import Link from "next/link";
import { getAdminToken } from "@/lib/admin/client";
import AdminShell from "@/components/admin/AdminShell";

export default function AdminIndexPage() {
  useEffect(() => {
    if (!getAdminToken()) window.location.href = "/admin/login";
  }, []);

  return (
    <AdminShell title="Dashboard" subtitle="Manage public content for your website.">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          href="/admin/programs"
          className="rounded-2xl border border-slate-200 bg-white p-5 hover:bg-slate-50 transition-colors"
        >
          <h3 className="font-heading text-2xl text-slate-900">Programs</h3>
          <p className="mt-1 text-sm text-slate-600">Update core program details.</p>
        </Link>
        <Link
          href="/admin/schedule"
          className="rounded-2xl border border-slate-200 bg-white p-5 hover:bg-slate-50 transition-colors"
        >
          <h3 className="font-heading text-2xl text-slate-900">Schedule</h3>
          <p className="mt-1 text-sm text-slate-600">Edit training times and days.</p>
        </Link>
        <Link
          href="/admin/events"
          className="rounded-2xl border border-slate-200 bg-white p-5 hover:bg-slate-50 transition-colors"
        >
          <h3 className="font-heading text-2xl text-slate-900">Upcoming Events</h3>
          <p className="mt-1 text-sm text-slate-600">Add and update event cards.</p>
        </Link>
        </div>
    </AdminShell>
  );
}

