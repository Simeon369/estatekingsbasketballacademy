"use client";

import { motion } from "framer-motion";
import { IoStar } from "react-icons/io5";
import { testimonials } from "@/lib/constants";
import { fadeInUp, staggerContainer, staggerItem } from "@/lib/animations";

export default function Testimonials() {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          className="mb-12 text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={fadeInUp}
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading tracking-wide text-dark">
            What Parents Say
          </h2>
          <p className="mt-4 text-lg md:text-xl max-w-2xl mx-auto text-gray-600">
            Hear from the families who have experienced the Estate Kings Basketball Academy difference
          </p>
          <div className="mt-4 h-1 w-20 bg-primary mx-auto" />
        </motion.div>
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {testimonials.map((t) => (
            <motion.div
              key={t.id}
              variants={staggerItem}
              className="bg-gray-50 rounded-2xl p-8 relative"
              whileHover={{ y: -8 }}
            >
              <div className="absolute top-4 right-4 text-6xl text-primary/10 font-serif">"</div>
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <IoStar key={i} className="w-5 h-5 text-primary" />
                ))}
              </div>
              <p className="text-gray-600 mb-6 relative z-10">"{t.content}"</p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                  <span className="text-primary font-heading text-xl">{t.name.charAt(0)}</span>
                </div>
                <div>
                  <p className="font-heading text-lg">{t.name}</p>
                  <p className="text-sm text-gray-500">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
