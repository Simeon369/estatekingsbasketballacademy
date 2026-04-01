"use client";

import { motion } from "framer-motion";
import { IoBasketball } from "react-icons/io5";
import Button from "@/components/ui/Button";

export default function CTABanner() {
  return (
    <section className="py-24 bg-primary relative overflow-hidden">
      <motion.div
        className="absolute top-10 left-10 text-white/10"
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      >
        <IoBasketball className="w-40 h-40" />
      </motion.div>
      <motion.div
        className="absolute bottom-10 right-10 text-white/10"
        animate={{ rotate: -360 }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
      >
        <IoBasketball className="w-56 h-56" />
      </motion.div>
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          className="text-center max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading text-white mb-6">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl text-white/80 mb-10">
            Join Estate Kings Basketball Academy today and unlock your full
            potential.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              href="/contact"
              variant="outline"
              size="lg"
              className="bg-white text-primary border-none hover:bg-gray-100"
            >
              Contact Us Now
            </Button>
            <Button
              href="/schedule"
              variant="outline"
              size="lg"
              className="border-white text-white hover:bg-white hover:text-primary"
            >
              View Schedule
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
