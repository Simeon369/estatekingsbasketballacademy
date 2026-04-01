"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { IoBasketball, IoArrowForward } from "react-icons/io5";
import { programs } from "@/lib/constants";
import SectionHeading from "@/components/ui/SectionHeading";
import { staggerContainer, staggerItem } from "@/lib/animations";

type Program = {
  id: number;
  title: string;
  age_group: string;
  description: string;
  price: string | null;
  features: string[];
  featured: boolean;
};

export default function ProgramsPreview() {
  const [dbPrograms, setDbPrograms] = useState<Program[] | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/public/programs", { cache: "no-store" });
        const data = (await res.json()) as { programs?: Program[] };
        setDbPrograms(Array.isArray(data.programs) ? data.programs : []);
      } catch {
        setDbPrograms([]);
      }
    };
    void load();
  }, []);

  const program = useMemo(() => {
    const fromDb = dbPrograms && dbPrograms.length ? dbPrograms[0] : null;
    return (
      fromDb ?? {
        id: programs[0]?.id ?? 1,
        title: programs[0]?.title ?? "Basketball Development",
        age_group: programs[0]?.ageGroup ?? "Ages 4–18",
        description: programs[0]?.description ?? "",
        price: programs[0]?.price ?? null,
        features: programs[0]?.features ?? [],
        featured: Boolean(programs[0]?.featured),
      }
    );
  }, [dbPrograms]);

  return (
    <section className="py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <SectionHeading
          title="Basketball Development"
          subtitle="One focused program for boys and girls ages 4–18"
        />
        <motion.div
          className="max-w-4xl mx-auto mt-12"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <motion.div
            variants={staggerItem}
            className="relative bg-white rounded-2xl p-8 md:p-10 shadow-lg group ring-2 ring-primary/60"
            whileHover={{ y: -8 }}
          >
            <div className="absolute top-4 right-4 px-3 py-1 bg-primary text-white text-sm font-heading rounded-full">
              {program.age_group}
            </div>
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary transition-colors">
              <IoBasketball className="w-8 h-8 text-primary group-hover:text-white transition-colors" />
            </div>
            <h3 className="text-3xl font-heading mb-2">{program.title}</h3>
            <p className="text-primary font-heading text-lg mb-4">
              {program.price ?? "Registration: ₦35,000 · Monthly dues: ₦3,000"}
            </p>
            <p className="text-gray-600 mb-6">{program.description}</p>
            <ul className="space-y-2 mb-8">
              {program.features.map((f, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                  {f}
                </li>
              ))}
            </ul>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <span className="text-lg text-gray-500">
                Registration includes official academy jersey.
              </span>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 bg-dark text-white font-heading tracking-wider hover:bg-dark/90 transition-colors"
              >
                Enroll Now <IoArrowForward />
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
