"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

export default function TopBar() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsVisible(window.scrollY > 300);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.header
          className="fixed top-0 left-0 right-0 z-30 bg-dark/95 backdrop-blur-md border-b border-gray-800"
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/logo.png"
                alt="Estate Kings Basketball Academy"
                width={48}
                height={48}
                className="h-10 w-10 object-contain"
              />
              <span className="hidden md:block font-heading text-xl text-white">
                Estate Kings Basketball Academy
              </span>
            </Link>
            <Link
              href="/contact"
              className="px-6 py-2 bg-primary text-white font-heading tracking-wider hover:bg-primary/90 transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </motion.header>
      )}
    </AnimatePresence>
  );
}
