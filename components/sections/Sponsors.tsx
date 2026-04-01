"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { sponsors } from "@/lib/constants";

export default function Sponsors() {
  return (
    <section className="py-16 bg-gray-100 overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.p
          className="text-center text-gray-500 font-heading text-lg tracking-widest mb-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          Proudly Supported By
        </motion.p>
        <div className="relative">
          <div className="flex overflow-hidden">
            <motion.div
              className="flex gap-16 items-center"
              animate={{ x: [0, -80 * sponsors.length] }}
              transition={{ x: { duration: 24, repeat: Infinity, ease: "linear" } }}
            >
              {[...sponsors, ...sponsors, ...sponsors, ...sponsors].map((s, i) => (
                <div
                  key={`${s.id}-${i}`}
                  className="flex-shrink-0 w-40 h-20 bg-white rounded-xl flex items-center justify-center px-6 py-2 shadow-sm"
                >
                  <Image
                    src={s.logo}
                    alt={s.name}
                    width={120}
                    height={60}
                    className="w-full h-full object-contain filter grayscale"
                  />
                </div>
              ))}
            </motion.div>
          </div>
          <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-gray-100 to-transparent pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-gray-100 to-transparent pointer-events-none" />
        </div>
      </div>
    </section>
  );
}
