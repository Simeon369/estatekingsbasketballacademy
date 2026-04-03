"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { IoBasketball, IoArrowForward } from "react-icons/io5";
import { programs } from "@/lib/constants";
import { fadeInUp, staggerContainer, staggerItem } from "@/lib/animations";

export default function ProgramsPreview() {
  const program = useMemo(() => {
    const p = programs[0];
    return {
      id: p?.id ?? 1,
      title: p?.title ?? "Basketball Development",
      age_group: p?.ageGroup ?? "Ages 4–18",
      description: p?.description ?? "",
      price: p?.price ?? null,
      features: p?.features ?? [],
    };
  }, []);

  return (
    <section className="py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          className="mb-12 text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={fadeInUp}
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading tracking-wide text-dark">
            Basketball Development
          </h2>
          <p className="mt-4 text-lg md:text-xl max-w-2xl mx-auto text-gray-600">
            One focused program for boys and girls ages 4–18
          </p>
          <div className="mt-4 h-1 w-20 bg-primary mx-auto" />
        </motion.div>
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
              <span className="text-lg text-gray-500">Registration includes official academy jersey.</span>
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
