"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { IoBasketball } from "react-icons/io5";
import { FaInstagram, FaFacebookF, FaTwitter, FaYoutube } from "react-icons/fa";
import { navLinks, siteConfig } from "@/lib/constants";
import { staggerContainer, staggerItem } from "@/lib/animations";

export default function Footer() {
  return (
    <footer className="bg-dark text-white">
      <div className="container mx-auto px-4 py-16">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-12"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <motion.div variants={staggerItem} className="lg:col-span-1">
            <Link href="/" className="inline-flex items-center gap-3 mb-6">
              <Image
                src="/logo.png"
                alt={siteConfig.name}
                width={56}
                height={56}
                className="h-12 w-12 object-contain"
              />
              <span className="font-heading text-2xl text-white">
                Estate Kings Basketball Academy
              </span>
            </Link>
            <p className="text-gray-400 mb-6">{siteConfig.description}</p>
            <div className="flex gap-4">
              {[FaInstagram, FaFacebookF, FaTwitter, FaYoutube].map((Icon) => (
                <motion.a
                  key={Icon.toString()}
                  href="#"
                  className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </motion.div>
          <motion.div variants={staggerItem}>
            <h3 className="text-xl font-heading mb-6 flex items-center gap-2">
              <IoBasketball className="text-primary" /> Quick Links
            </h3>
            <ul className="space-y-3">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
          {/* <motion.div variants={staggerItem}>
            <h3 className="text-xl font-heading mb-6 flex items-center gap-2">
              <IoBasketball className="text-primary" /> Program
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/schedule"
                  className="text-gray-400 hover:text-primary transition-colors"
                >
                  Basketball Development (Ages 4–18)
                </Link>
              </li>
            </ul>
          </motion.div> */}
          <motion.div variants={staggerItem}>
            <h3 className="text-xl font-heading mb-6 flex items-center gap-2">
              <IoBasketball className="text-primary" /> Contact
            </h3>
            <ul className="space-y-3 text-gray-400">
              <li>Giants of Africa court</li>
              <li>Mini stadium, Abesan Lagos</li>
              <li>
                <a
                  href="tel:+2348038012444"
                  className="hover:text-primary transition-colors"
                >
                  +234 803 801 2444
                </a>
              </li>
              <li>
                <a
                  href="mailto:estatekingsbball@gmail.com"
                  className="hover:text-primary transition-colors"
                >
                  estatekingsbball@gmail.com
                </a>
              </li>
            </ul>
          </motion.div>
        </motion.div>
        <motion.div
          className="mt-12 pt-8 border-t border-gray-800 flex flex-col items-center text-center justify-center gap-4"
          variants={staggerItem}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </p>
          <p className="text-gray-500 text-sm">
            Designed by{" "}
            <a
              href="https://simplicity-dev.vercel.app"
              target="_blank"
              rel="noreferrer"
              className="font-zen text-white hover:text-primary transition-colors"
            >
              SIMPLICITY.dev
            </a>
          </p>
          {/* <div className="flex gap-6 text-sm text-gray-500">
            <Link href="#" className="hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-primary transition-colors">
              Terms of Service
            </Link>
          </div> */}
        </motion.div>
      </div>
    </footer>
  );
}
