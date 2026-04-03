"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { IoCalendar, IoTime, IoLocation } from "react-icons/io5";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import { schedule } from "@/lib/constants";
import { staggerContainer, staggerItem } from "@/lib/animations";
import type { AnnouncementEventRow } from "@/lib/types/content";

export default function SchedulePage() {
  const [dbEvents, setDbEvents] = useState<AnnouncementEventRow[] | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const eventsRes = await fetch("/api/public/events", { cache: "no-store" });
        const eventsData = (await eventsRes.json()) as { events?: AnnouncementEventRow[] };
        setDbEvents(Array.isArray(eventsData.events) ? eventsData.events : []);
      } catch {
        setDbEvents([]);
      }
    };
    void load();
  }, []);

  const eventsData = useMemo(
    () => (Array.isArray(dbEvents) ? dbEvents : []),
    [dbEvents],
  );

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
              {schedule.map((day) => (
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
                          <p className="font-heading text-dark">{session.program}</p>
                          <p className="text-sm text-gray-500">{session.time}</p>
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
              {eventsData.map((event) => {
                const when = event.event_time || event.date || "";
                const where = event.location || "";
                return (
                  <motion.div
                    key={event.id}
                    variants={staggerItem}
                    className="bg-white rounded-2xl overflow-hidden shadow-lg flex flex-col"
                  >
                    <div className="relative h-44 w-full bg-gradient-to-br from-primary/80 to-slate-800">
                      {event.banner_url ? (
                        <Image
                          src={event.banner_url}
                          alt={event.title}
                          fill
                          className="object-cover"
                          sizes="(max-width:768px) 100vw, 33vw"
                        />
                      ) : null}
                    </div>
                    <div className="p-6 flex flex-col flex-1">
                      <div className="flex items-center gap-2 text-primary mb-2">
                        <IoCalendar className="w-5 h-5 shrink-0" />
                        <span className="font-heading text-sm">{when || "Date TBA"}</span>
                      </div>
                      <h3 className="text-2xl font-heading mb-3">{event.title}</h3>
                      <p className="text-gray-600 mb-4 flex-1">{event.description}</p>
                      {where ? (
                        <p className="text-sm text-gray-500 flex items-start gap-2">
                          <IoLocation className="w-4 h-4 mt-0.5 shrink-0 text-primary" />
                          {where}
                        </p>
                      ) : null}
                      <a
                        href="/contact"
                        className="mt-4 text-primary font-heading hover:underline inline-block"
                      >
                        Register Interest
                      </a>
                    </div>
                  </motion.div>
                );
              })}
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
