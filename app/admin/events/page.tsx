"use client";

import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import { adminFetch, getAdminToken } from "@/lib/admin/client";
import AdminShell from "@/components/admin/AdminShell";

type EventItem = {
  id?: number;
  title: string;
  date: string;
  description: string;
  sort_order?: number;
};

export default function AdminEventsPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
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
        const res = await adminFetch("/api/admin/events");
        const data = (await res.json()) as { events?: EventItem[]; error?: string };
        if (!res.ok) throw new Error(data.error || "Failed to load events");
        setEvents((data.events || []).map((e, i) => ({ ...e, sort_order: i })));
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load events");
      } finally {
        setIsLoading(false);
      }
    };
    void load();
  }, []);

  const addEvent = () => {
    setEvents((prev) => [
      ...prev,
      {
        title: "New Event",
        date: "Month Day, Year",
        description: "Event details...",
      },
    ]);
  };

  const removeEvent = (idx: number) => {
    setEvents((prev) => prev.filter((_, i) => i !== idx));
  };

  const onSave = async () => {
    setError(null);
    setSuccess(null);
    setIsSaving(true);
    try {
      const res = await adminFetch("/api/admin/events", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          events: events.map((e, i) => ({ ...e, sort_order: i })),
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
    <AdminShell
      title="Upcoming Events"
      subtitle="Manage events shown on your schedule page."
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

      <div className="flex items-center justify-between mb-4">
        <h3 className="font-heading text-2xl text-slate-900">Event List</h3>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={addEvent}>
            Add Event
          </Button>
          <Button onClick={onSave} disabled={isSaving || isLoading}>
            {isSaving ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>

      {isLoading ? (
        <p className="text-slate-500">Loading...</p>
      ) : events.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 p-6 text-center">
          <p className="text-slate-600 mb-4">No events yet.</p>
          <Button variant="outline" onClick={addEvent}>
            Add First Event
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {events.map((event, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-slate-200 p-4 grid grid-cols-1 md:grid-cols-[1fr_220px_120px] gap-3"
            >
              <div className="space-y-2">
                <input
                  value={event.title}
                  onChange={(e) =>
                    setEvents((prev) =>
                      prev.map((x, i) => (i === idx ? { ...x, title: e.target.value } : x))
                    )
                  }
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="Event title"
                />
                <textarea
                  value={event.description}
                  onChange={(e) =>
                    setEvents((prev) =>
                      prev.map((x, i) =>
                        i === idx ? { ...x, description: e.target.value } : x
                      )
                    )
                  }
                  rows={3}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-primary resize-none"
                  placeholder="Event description"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">Date label</label>
                <input
                  value={event.date}
                  onChange={(e) =>
                    setEvents((prev) =>
                      prev.map((x, i) => (i === idx ? { ...x, date: e.target.value } : x))
                    )
                  }
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="April 5, 2026"
                />
              </div>
              <div className="md:pt-6">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => removeEvent(idx)}
                >
                  Remove
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminShell>
  );
}

