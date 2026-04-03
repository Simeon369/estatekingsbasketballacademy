"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { IoBasketball } from "react-icons/io5";
import Button from "@/components/ui/Button";
import { siteConfig } from "@/lib/constants";

export default function Hero() {
  const words = ["Train", "Like", "A", "King"];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-dark">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent" />
      </div>
      {/* Floating basketball accents (desktop only to keep mobile clean) */}
      <motion.div
        className="hidden md:block absolute top-20 left-10 text-primary/20"
        animate={{ y: [0, -20, 0], rotate: [0, 360] }}
        transition={{
          y: { duration: 3, repeat: Infinity },
          rotate: { duration: 8, repeat: Infinity, ease: "linear" },
        }}
      >
        <IoBasketball className="w-24 h-24 md:w-32 md:h-32" />
      </motion.div>
      <motion.div
        className="hidden md:block absolute bottom-20 right-10 text-primary/20"
        animate={{ y: [0, 20, 0], rotate: [0, -360] }}
        transition={{
          y: { duration: 4, repeat: Infinity },
          rotate: { duration: 10, repeat: Infinity, ease: "linear" },
        }}
      >
        <IoBasketball className="w-16 h-16 md:w-24 md:h-24" />
      </motion.div>

      <div className="container mx-auto px-4 text-center relative z-10">
        {/* Logo on top */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.4 }}
          className="mb-4 md:mb-6 flex justify-center"
        >
          <Image
            src="/logo.png"
            alt="Estate Kings Basketball Academy logo"
            width={160}
            height={160}
            className="h-20 w-auto md:h-24"
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="mb-3 md:mb-5"
        >
          <span className="inline-block text-xs md:text-lg px-4 py-2 bg-primary/20 text-primary font-heading tracking-widest rounded-full">
            Welcome to Estate Kings Basketball Academy
          </span>
        </motion.div>
        {/* Simple title on mobile for readability */}
        {/* <motion.h1
        className="md:hidden text-3xl xs:text-4xl font-heading text-white mb-4 leading-tight"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        Estate Kings
        <br />
        Basketball Academy
      </motion.h1> */}
        {/* Animated word-by-word title */}
        <h1 className="text-5xl md:text-8xl lg:text-9xl text-center font-heading text-white mb-4 md:mb-6 overflow-hidden">
          {words.map((word, i) => (
            <motion.span
              key={word}
              className={`inline-block  ${word === "King" ? "text-primary mr-0" : "mr-4"}`}
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{
                delay: 0.3 + i * 0.1,
                duration: 0.6,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
            >
              {word}
            </motion.span>
          ))}
        </h1>
        <motion.div
          className="text-sm md:text-xl text-gray-300 max-w-2xl mx-auto mb-8 md:mb-10 space-y-2 flex flex-col items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <p className="text-gray-400 w-[80%]">{siteConfig.description}</p>
          <p className="font-heading text-primary text-2xl">
            {siteConfig.tagline}
          </p>
        </motion.div>
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          <Button href="/contact" className="w-[60%] md:w-auto" size="lg">
            Join The Academy
          </Button>
          <Button
            href="/schedule"
            className="w-[60%] md:w-auto"
            variant="outline"
            size="lg"
          >
            View Schedule
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
