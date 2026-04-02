"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { IoAdd, IoClose } from "react-icons/io5";
import Button from "@/components/ui/Button";
import { adminFetch, getAdminToken } from "@/lib/admin/client";
import AdminShell from "@/components/admin/AdminShell";
import type { AnnouncementEventRow } from "@/lib/types/content";

async function uploadBanner(file: File): Promise<string> {
  const form = new FormData();
  form.append("file", file);
  form.append("folder", "events");
  const res = await adminFetch("/api/admin/upload", { method: "POST", body: form });
  const data = (await res.json().catch(() => null)) as { url?: string; error?: string } | null;
  if (!res.ok) throw new Error(data?.error || "Upload failed");
  if (!data?.url) throw new Error("Upload failed");
  return data.url;
}

export default function AdminEventsPage() {
  const [events, setEvents] = useState<AnnouncementEventRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [location, setLocation] = useState("");
  const [bannerUrl, setBannerUrl] = useState<string | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);

  const resetForm = useCallback(() => {
    setEditingId(null);
    setTitle("");
    setDescription("");
    setEventTime("");
    setLocation("");
    setBannerUrl(null);
    setBannerFile(null);
    setError(null);
    setSuccess(null);
  }, []);

  const load = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await adminFetch("/api/admin/events");
      const data = (await res.json()) as { events?: AnnouncementEventRow[]; error?: string };
      if (!res.ok) throw new Error(data.error || "Failed to load");
      setEvents(data.events || []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!getAdminToken()) {
      window.location.href = "/admin/login";
      return;
    }
    void load();
  }, [load]);

  const openCreate = () => {
    resetForm();
    setFormOpen(true);
  };

  const openEdit = (ev: AnnouncementEventRow) => {
    setError(null);
    setSuccess(null);
    setEditingId(ev.id);
    setTitle(ev.title);
    setDescription(ev.description);
    setEventTime(ev.event_time || ev.date || "");
    setLocation(ev.location || "");
    setBannerUrl(ev.banner_url || null);
    setBannerFile(null);
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    resetForm();
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setSaving(true);
    try {
      let url = bannerUrl;
      if (bannerFile) {
        url = await uploadBanner(bannerFile);
        setBannerUrl(url);
        setBannerFile(null);
      }
      if (!url) {
        throw new Error("Banner image is required");
      }

      if (editingId == null) {
        const res = await adminFetch("/api/admin/events", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title,
            description,
            event_time: eventTime,
            location,
            banner_url: url,
          }),
        });
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        if (!res.ok) throw new Error(data?.error || "Save failed");
      } else {
        const res = await adminFetch("/api/admin/events", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: editingId,
            title,
            description,
            event_time: eventTime,
            location,
            banner_url: url,
          }),
        });
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        if (!res.ok) throw new Error(data?.error || "Save failed");
      }

      setSuccess(editingId == null ? "Announcement created." : "Saved.");
      await load();
      closeForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async (id: number) => {
    if (!confirm("Delete this announcement?")) return;
    setError(null);
    try {
      const res = await adminFetch(`/api/admin/events?id=${id}`, { method: "DELETE" });
      const data = (await res.json().catch(() => null)) as { error?: string } | null;
      if (!res.ok) throw new Error(data?.error || "Delete failed");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    }
  };

  return (
    <AdminShell
      title="Events & announcements"
      subtitle="These appear in the Upcoming Events section on the public schedule page."
    >
      {error ? (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">{error}</div>
      ) : null}
      {success ? (
        <div className="mb-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-green-700">
          {success}
        </div>
      ) : null}

      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-slate-600">{loading ? "Loading…" : `${events.length} item(s)`}</p>
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white shadow-md transition-transform hover:scale-105"
          aria-label="Add announcement"
        >
          <IoAdd className="h-7 w-7" />
        </button>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        {events.length === 0 && !loading ? (
          <p className="text-slate-500 col-span-full">No announcements yet. Tap + to add one.</p>
        ) : (
          events.map((ev) => (
            <div
              key={ev.id}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
            >
              <button type="button" onClick={() => openEdit(ev)} className="block w-full text-left">
                <div className="relative h-36 w-full bg-slate-200">
                  {ev.banner_url ? (
                    <Image src={ev.banner_url} alt="" fill className="object-cover" sizes="(max-width:768px) 100vw, 50vw" />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/80 to-slate-800" />
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-heading text-lg text-slate-900">{ev.title}</h3>
                  <p className="mt-1 line-clamp-2 text-sm text-slate-600">{ev.description}</p>
                  <p className="mt-2 text-xs text-slate-500">
                    {(ev.event_time || ev.date || "—") + (ev.location ? ` · ${ev.location}` : "")}
                  </p>
                </div>
              </button>
              <div className="border-t border-slate-100 px-4 py-2">
                <button
                  type="button"
                  onClick={() => onDelete(ev.id)}
                  className="text-sm font-medium text-red-600 hover:underline"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {formOpen ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-heading text-2xl text-slate-900">
                {editingId == null ? "New announcement" : "Edit announcement"}
              </h2>
              <button type="button" onClick={closeForm} className="rounded-full p-2 hover:bg-slate-100" aria-label="Close">
                <IoClose className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Banner image</label>
                {bannerUrl ? (
                  <div className="relative mb-2 h-32 w-full overflow-hidden rounded-xl bg-slate-100">
                    <Image src={bannerUrl} alt="" fill className="object-cover" sizes="100vw" />
                  </div>
                ) : null}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setBannerFile(e.target.files?.[0] ?? null)}
                  className="w-full text-sm"
                />
                <p className="mt-1 text-xs text-slate-500">Required for new items. For edits, leave empty to keep the current image.</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-primary focus:ring-2 focus:ring-primary/30"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-primary focus:ring-2 focus:ring-primary/30 resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Time</label>
                <input
                  value={eventTime}
                  onChange={(e) => setEventTime(e.target.value)}
                  placeholder="e.g. April 5, 2026 · 10:00 AM"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-primary focus:ring-2 focus:ring-primary/30"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
                <input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Venue or address"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-primary focus:ring-2 focus:ring-primary/30"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <Button type="submit" size="lg" disabled={saving}>
                  {saving ? "Saving…" : "Save"}
                </Button>
                <Button type="button" variant="outline" size="lg" onClick={closeForm} disabled={saving}>
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </AdminShell>
  );
}
