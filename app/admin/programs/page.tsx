"use client";

import { useEffect, useMemo, useState } from "react";
import Button from "@/components/ui/Button";
import { adminFetch, getAdminToken } from "@/lib/admin/client";
import AdminShell from "@/components/admin/AdminShell";

type Program = {
  id: number;
  title: string;
  age_group: string;
  description: string;
  price: string | null;
  features: string[];
  featured: boolean;
};

export default function AdminProgramsPage() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [draft, setDraft] = useState<Program | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const selected = useMemo(() => {
    if (selectedId == null) return null;
    return programs.find((p) => p.id === selectedId) || null;
  }, [programs, selectedId]);

  useEffect(() => {
    if (!getAdminToken()) {
      window.location.href = "/admin/login";
      return;
    }
    const load = async () => {
      setError(null);
      setIsLoading(true);
      try {
        const res = await adminFetch("/api/admin/programs");
        const data = (await res.json()) as { programs?: Program[]; error?: string };
        if (!res.ok) throw new Error(data.error || "Failed to load programs");
        const list = data.programs || [];
        setPrograms(list);
        setSelectedId(list[0]?.id ?? null);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load programs");
      } finally {
        setIsLoading(false);
      }
    };
    void load();
  }, []);

  useEffect(() => {
    if (!selected) {
      setDraft(null);
      return;
    }
    setDraft({ ...selected });
  }, [selected]);

  const onSave = async () => {
    if (!draft) return;
    setError(null);
    setSuccess(null);
    setIsSaving(true);
    try {
      const res = await adminFetch("/api/admin/programs", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ program: draft }),
      });
      const data = (await res.json().catch(() => null)) as
        | { ok?: boolean; error?: string }
        | null;
      if (!res.ok) throw new Error(data?.error || "Failed to save");

      setPrograms((prev) => prev.map((p) => (p.id === draft.id ? draft : p)));
      setSuccess("Saved.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save");
    } finally {
      setIsSaving(false);
    }
  };

  const featuresText = (draft?.features || []).join("\n");

  return (
    <AdminShell
      title="Programs"
      subtitle="Update the core program content shown on your homepage."
    >
        {error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700 mb-4">
            {error}
          </div>
        ) : null}
        {success ? (
          <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-green-700 mb-4">
            {success}
          </div>
        ) : null}

        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
          <div className="rounded-2xl border border-slate-200 p-4">
            <h2 className="font-heading text-xl mb-3">Programs</h2>
            {isLoading ? (
              <p className="text-gray-500">Loading...</p>
            ) : programs.length === 0 ? (
              <p className="text-gray-500">No programs yet.</p>
            ) : (
              <div className="space-y-2">
                {programs.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setSelectedId(p.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg border ${
                      selectedId === p.id
                        ? "border-primary bg-primary/5"
                        : "border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <div className="font-heading">{p.title}</div>
                    <div className="text-xs text-gray-500">{p.age_group}</div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-slate-200 p-6">
            <h2 className="font-heading text-2xl mb-4">Edit</h2>
            {!draft ? (
              <p className="text-gray-500">Select a program.</p>
            ) : (
              <div className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                    <input
                      value={draft.title}
                      onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Age group</label>
                    <input
                      value={draft.age_group}
                      onChange={(e) => setDraft({ ...draft, age_group: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price (optional)</label>
                  <input
                    value={draft.price ?? ""}
                    onChange={(e) =>
                      setDraft({ ...draft, price: e.target.value.trim() ? e.target.value : null })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                    placeholder="₦35,000 registration · ₦3,000 monthly"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    rows={5}
                    value={draft.description}
                    onChange={(e) => setDraft({ ...draft, description: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Features (one per line)
                  </label>
                  <textarea
                    rows={6}
                    value={featuresText}
                    onChange={(e) =>
                      setDraft({
                        ...draft,
                        features: e.target.value
                          .split("\n")
                          .map((s) => s.trim())
                          .filter(Boolean),
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary resize-none"
                  />
                </div>

                <label className="inline-flex items-center gap-2 text-sm font-medium text-gray-700">
                  <input
                    type="checkbox"
                    checked={draft.featured}
                    onChange={(e) => setDraft({ ...draft, featured: e.target.checked })}
                    className="h-4 w-4"
                  />
                  Featured
                </label>

                <div className="flex items-center gap-3">
                  <Button onClick={onSave} size="lg" disabled={isSaving}>
                    {isSaving ? "Saving..." : "Save"}
                  </Button>
                  <Button
                    onClick={() => (selected ? setDraft({ ...selected }) : null)}
                    variant="outline"
                    size="lg"
                    disabled={isSaving}
                  >
                    Reset
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
    </AdminShell>
  );
}

