"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { IoAdd, IoClose } from "react-icons/io5";
import Button from "@/components/ui/Button";
import { adminFetch, getAdminToken } from "@/lib/admin/client";
import AdminShell from "@/components/admin/AdminShell";
import type { GalleryItemRow } from "@/lib/types/content";

async function uploadGalleryImage(file: File): Promise<string> {
  const form = new FormData();
  form.append("file", file);
  form.append("folder", "gallery");
  const res = await adminFetch("/api/admin/upload", { method: "POST", body: form });
  const data = (await res.json().catch(() => null)) as { url?: string; error?: string } | null;
  if (!res.ok) throw new Error(data?.error || "Upload failed");
  if (!data?.url) throw new Error("Upload failed");
  return data.url;
}

export default function AdminGalleryPage() {
  const [items, setItems] = useState<GalleryItemRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [description, setDescription] = useState("");

  const load = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await adminFetch("/api/admin/gallery");
      const data = (await res.json()) as { items?: GalleryItemRow[]; error?: string };
      if (!res.ok) throw new Error(data.error || "Failed to load");
      setItems(data.items || []);
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

  const closeForm = () => {
    setFormOpen(false);
    setFile(null);
    setDescription("");
    setError(null);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError("Choose an image");
      return;
    }
    setError(null);
    setSaving(true);
    try {
      const url = await uploadGalleryImage(file);
      const res = await adminFetch("/api/admin/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image_url: url, description: description.trim() }),
      });
      const data = (await res.json().catch(() => null)) as { error?: string } | null;
      if (!res.ok) throw new Error(data?.error || "Save failed");
      await load();
      closeForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async (id: number) => {
    if (!confirm("Remove this image from the gallery?")) return;
    setError(null);
    try {
      const res = await adminFetch(`/api/admin/gallery?id=${id}`, { method: "DELETE" });
      const data = (await res.json().catch(() => null)) as { error?: string } | null;
      if (!res.ok) throw new Error(data?.error || "Delete failed");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    }
  };

  return (
    <AdminShell title="Gallery" subtitle="Images shown on the public gallery page (replaces defaults when you add at least one).">
      {error ? (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">{error}</div>
      ) : null}

      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-slate-600">{loading ? "Loading…" : `${items.length} image(s)`}</p>
        <button
          type="button"
          onClick={() => {
            setError(null);
            setFile(null);
            setDescription("");
            setFormOpen(true);
          }}
          className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white shadow-md transition-transform hover:scale-105"
          aria-label="Add image"
        >
          <IoAdd className="h-7 w-7" />
        </button>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {items.length === 0 && !loading ? (
          <p className="col-span-full text-slate-500">No gallery items yet. Tap + to upload.</p>
        ) : (
          items.map((item) => (
            <div key={item.id} className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white">
              <div className="relative aspect-square bg-slate-100">
                <Image
                  src={item.image_url}
                  alt={item.description}
                  fill
                  className="object-cover"
                  sizes="(max-width:640px) 50vw, 25vw"
                />
              </div>
              <p className="line-clamp-2 p-2 text-xs text-slate-600">{item.description || "—"}</p>
              <button
                type="button"
                onClick={() => onDelete(item.id)}
                className="absolute right-2 top-2 rounded bg-dark/70 px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100"
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>

      {formOpen ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-heading text-2xl text-slate-900">Add image</h2>
              <button type="button" onClick={closeForm} className="rounded-full p-2 hover:bg-slate-100" aria-label="Close">
                <IoClose className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Image</label>
                <input
                  type="file"
                  accept="image/*"
                  required
                  onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                  className="w-full text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Description / caption</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 resize-none focus:border-primary focus:ring-2 focus:ring-primary/30"
                  placeholder="Shown as alt text and caption"
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
