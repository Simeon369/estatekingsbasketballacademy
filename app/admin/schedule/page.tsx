"use client";

import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import { adminFetch, getAdminToken } from "@/lib/admin/client";
import AdminShell from "@/components/admin/AdminShell";

type Session = {
  id?: number;
  day: string;
  time: string;
  program: string;
  sort_order?: number;
};

const days = ["Friday", "Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"];

export default function AdminSchedulePage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (!getAdminToken()) {
      window.location.href = "/admin/login";
      return;
    }
    const load = async () => {
      setError(null);
      setIsLoading(true);
      try {
        const res = await adminFetch("/api/admin/schedule");
        const data = (await res.json()) as { sessions?: Session[]; error?: string };
        if (!res.ok) throw new Error(data.error || "Failed to load schedule");
        setSessions((data.sessions || []).map((s, i) => ({ ...s, sort_order: i })));
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load schedule");
      } finally {
        setIsLoading(false);
      }
    };
    void load();
  }, []);

  const addRow = () => {
    setSessions((prev) => [
      ...prev,
      { day: "Friday", time: "2:00 PM - 5:00 PM", program: "Basketball Development (Ages 4–18)" },
    ]);
  };

  const removeRow = (idx: number) => {
    setSessions((prev) => prev.filter((_, i) => i !== idx));
  };

  const onSave = async () => {
    setError(null);
    setSuccess(null);
    setIsSaving(true);
    try {
      const res = await adminFetch("/api/admin/schedule", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessions: sessions.map((s, i) => ({ ...s, sort_order: i })),
        }),
      });
      const data = (await res.json().catch(() => null)) as
        | { ok?: boolean; error?: string }
        | null;
      if (!res.ok) throw new Error(data?.error || "Failed to save");
      setSuccess("Saved.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AdminShell title="Schedule" subtitle="Edit training days, times, and session names.">
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

        <div className="rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center justify-between gap-4 mb-4">
            <h2 className="font-heading text-2xl">Sessions</h2>
            <div className="flex items-center gap-3">
              <Button onClick={addRow} variant="outline">
                Add row
              </Button>
              <Button onClick={onSave} disabled={isSaving || isLoading}>
                {isSaving ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>

          {isLoading ? (
            <p className="text-gray-500">Loading...</p>
          ) : sessions.length === 0 ? (
            <div className="text-gray-600">
              <p>No sessions yet.</p>
              <div className="mt-4">
                <Button onClick={addRow} variant="outline">
                  Add first session
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {sessions.map((s, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-1 md:grid-cols-[160px_220px_1fr_100px] gap-3 items-start border border-gray-200 rounded-xl p-3"
                >
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Day</label>
                    <select
                      value={s.day}
                      onChange={(e) =>
                        setSessions((prev) =>
                          prev.map((row, i) =>
                            i === idx ? { ...row, day: e.target.value } : row
                          )
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary bg-white"
                    >
                      {days.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Time</label>
                    <input
                      value={s.time}
                      onChange={(e) =>
                        setSessions((prev) =>
                          prev.map((row, i) =>
                            i === idx ? { ...row, time: e.target.value } : row
                          )
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Program</label>
                    <input
                      value={s.program}
                      onChange={(e) =>
                        setSessions((prev) =>
                          prev.map((row, i) =>
                            i === idx ? { ...row, program: e.target.value } : row
                          )
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                    />
                  </div>
                  <div className="pt-6">
                    <Button onClick={() => removeRow(idx)} variant="outline" className="w-full">
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
    </AdminShell>
  );
}

