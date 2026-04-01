"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { IoCalendar, IoTime, IoLocation } from "react-icons/io5";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import { schedule, upcomingEvents } from "@/lib/constants";
import { staggerContainer, staggerItem } from "@/lib/animations";

type SessionRow = {
  id: number;
  day: string;
  time: string;
  program: string;
  sort_order: number;
};

type EventRow = {
  id: number;
  title: string;
  date: string;
  description: string;
  sort_order: number;
};

export default function SchedulePage() {
  const [dbSessions, setDbSessions] = useState<SessionRow[] | null>(null);
  const [dbEvents, setDbEvents] = useState<EventRow[] | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [sessionsRes, eventsRes] = await Promise.all([
          fetch("/api/public/schedule", { cache: "no-store" }),
          fetch("/api/public/events", { cache: "no-store" }),
        ]);
        const sessionsData = (await sessionsRes.json()) as { sessions?: SessionRow[] };
        const eventsData = (await eventsRes.json()) as { events?: EventRow[] };
        setDbSessions(Array.isArray(sessionsData.sessions) ? sessionsData.sessions : []);
        setDbEvents(Array.isArray(eventsData.events) ? eventsData.events : []);
      } catch {
        setDbSessions([]);
        setDbEvents([]);
      }
    };
    void load();
  }, []);

  const scheduleData = useMemo(() => {
    if (dbSessions && dbSessions.length) {
      const map = new Map<string, { day: string; sessions: { time: string; program: string }[] }>();
      for (const s of dbSessions) {
        if (!map.has(s.day)) map.set(s.day, { day: s.day, sessions: [] });
        map.get(s.day)!.sessions.push({ time: s.time, program: s.program });
      }
      return Array.from(map.values());
    }
    return schedule;
  }, [dbSessions]);

  const eventsData = useMemo(() => {
    if (dbEvents && dbEvents.length) return dbEvents;
    return upcomingEvents.map((e, i) => ({
      id: e.id,
      title: e.title,
      date: e.date,
      description: e.description,
      sort_order: i,
    }));
  }, [dbEvents]);

  return (
    <>
      <section className="pt-32 pb-16 bg-dark">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-5xl md:text-7xl font-heading text-white mb-6">
              Training <span className="text-primary">Schedule</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Find the perfect time to train with us
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-24">
        <div className="container mx-auto px-4">
          <SectionHeading
            title="Training Schedule"
            subtitle="Current Estate Kings Basketball Academy training days and times"
          />
          <motion.div
            className="mt-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 md:w-[70%] mx-auto gap-6">
              {scheduleData.map((day) => (
                <motion.div
                  key={day.day}
                  variants={staggerItem}
                  className="bg-white rounded-xl shadow-lg overflow-hidden"
                >
                  <div className="bg-dark text-white p-4">
                    <span className="font-heading text-xl">{day.day}</span>
                  </div>
                  <div className="p-4 space-y-3">
                    {day.sessions.map((session, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div>
                          <p className="font-heading text-dark">
                            {session.program}
                          </p>
                          <p className="text-sm text-gray-500">
                            {session.time}
                          </p>
                        </div>
                        <IoTime className="w-5 h-5 text-primary" />
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
          <p className="mt-8 text-center text-gray-500 flex items-center justify-center gap-2">
            <IoLocation className="w-5 h-5 text-primary" /> Giants of Africa court, Mini stadium, Abesan Lagos
          </p>
        </div>
      </section>

      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <SectionHeading
            title="Upcoming Events"
            subtitle="Special events and tournaments"
          />
          {eventsData.length === 0 ? (
            <p className="mt-8 text-center text-gray-500">No upcoming events</p>
          ) : (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {eventsData.map((event) => (
                <motion.div
                  key={event.id}
                  variants={staggerItem}
                  className="bg-white rounded-2xl overflow-hidden shadow-lg"
                  whileHover={{ y: -8 }}
                >
                  <div className="bg-primary p-6">
                    <div className="flex items-center gap-3 text-white">
                      <IoCalendar className="w-6 h-6" />
                      <span className="font-heading text-lg">{event.date}</span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-2xl font-heading mb-3">{event.title}</h3>
                    <p className="text-gray-600 mb-4">{event.description}</p>
                    <a
                      href="/contact"
                      className="text-primary font-heading hover:underline"
                    >
                      Register Interest
                    </a>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      <section className="py-24 bg-primary">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-heading text-white mb-6">
              Ready to Start Training?
            </h2>
            <Button
              href="/contact"
              variant="outline"
              size="lg"
              className="bg-white text-primary hover:bg-gray-100"
            >
              Contact Us
            </Button>
          </motion.div>
        </div>
      </section>
    </>
  );
}
