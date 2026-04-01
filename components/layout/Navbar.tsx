"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { IoBasketball, IoClose } from "react-icons/io5";
import { navLinks } from "@/lib/constants";
import { slideInLeft, navLinkVariants } from "@/lib/animations";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {!isOpen && (
        <motion.button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-8 right-8 z-50 w-16 h-16 bg-primary rounded-full flex items-center justify-center shadow-lg hover:shadow-xl"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
          aria-label="Open navigation"
        >
          <IoBasketball className="w-8 h-8 text-white" />
        </motion.button>
      )}

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />
            <motion.nav
              className="fixed top-0 left-0 h-full w-full md:w-96 bg-dark z-40 flex flex-col"
              variants={slideInLeft}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className="p-8 border-b border-gray-800 flex items-center justify-between">
                <Link
                  href="/"
                  onClick={() => setIsOpen(false)}
                  className="inline-flex items-center gap-3"
                >
                  <Image
                    src="/logo.png"
                    alt="Estate Kings Basketball Academy"
                    width={64}
                    height={64}
                    className="h-12 w-12 object-contain"
                  />
                  <span className="hidden md:block font-heading text-2xl text-white">
                    Estate Kings Basketball Academy
                  </span>
                </Link>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  aria-label="Close navigation"
                  className="md:hidden ml-4 text-white hover:text-primary transition-colors"
                >
                  <IoClose className="w-8 h-8" />
                </button>
              </div>
              <div className="flex-1 flex flex-col justify-center px-8">
                <ul className="space-y-6">
                  {navLinks.map((link, index) => (
                    <motion.li
                      key={link.name}
                      custom={index}
                      variants={navLinkVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                    >
                      <Link
                        href={link.href}
                        onClick={() => setIsOpen(false)}
                        className="group flex items-center text-3xl font-heading text-white hover:text-primary transition-colors"
                      >
                        <span className="w-0 h-0.5 bg-primary mr-0 group-hover:w-8 group-hover:mr-4 transition-all duration-300" />
                        {link.name}
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </div>
              <div className="p-8 border-t border-gray-800">
                <Link
                  href="/contact"
                  onClick={() => setIsOpen(false)}
                  className="block w-full py-4 bg-primary text-white text-center font-heading text-xl tracking-wider hover:bg-primary/90 transition-colors"
                >
                  Join The Academy
                </Link>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
