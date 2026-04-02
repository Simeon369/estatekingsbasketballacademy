"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence, type PanInfo } from "framer-motion";
import { IoClose, IoChevronBack, IoChevronForward } from "react-icons/io5";
import { galleryImages } from "@/lib/constants";
import { staggerContainer, staggerItem } from "@/lib/animations";
import type { GalleryItemRow } from "@/lib/types/content";

type SlideItem = { id: number; src: string; alt: string };

export default function GalleryPage() {
  const [dbItems, setDbItems] = useState<GalleryItemRow[] | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [direction, setDirection] = useState<1 | -1>(1);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/public/gallery", { cache: "no-store" });
        const data = (await res.json()) as { items?: GalleryItemRow[] };
        setDbItems(Array.isArray(data.items) ? data.items : []);
      } catch {
        setDbItems([]);
      }
    };
    void load();
  }, []);

  const slides: SlideItem[] = useMemo(() => {
    if (dbItems && dbItems.length > 0) {
      return dbItems.map((item) => ({
        id: item.id,
        src: item.image_url,
        alt: item.description || "Gallery image",
      }));
    }
    return galleryImages.map((img) => ({
      id: img.id,
      src: img.src,
      alt: img.alt,
    }));
  }, [dbItems]);

  const swipeConfidenceThreshold = 9000;
  const swipePower = (offset: number, velocity: number) => Math.abs(offset) * velocity;

  useEffect(() => {
    if (selected === null) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [selected]);

  const slideVariants = {
    enter: (dir: 1 | -1) => ({
      x: dir > 0 ? 80 : -80,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: 1 | -1) => ({
      x: dir > 0 ? -80 : 80,
      opacity: 0,
    }),
  };

  return (
    <>
      <section className="pt-32 pb-16 bg-dark">
        <div className="container mx-auto px-4">
          <motion.div className="text-center" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-5xl md:text-7xl font-heading text-white mb-6">Photo <span className="text-primary">Gallery</span></h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">Moments captured at Estate Kings Basketball Academy</p>
          </motion.div>
        </div>
      </section>

      <section className="py-24">
        <div className="container mx-auto px-4">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {slides.map((img, index) => (
              <motion.div
                key={img.id}
                variants={staggerItem}
                className="relative h-52 sm:h-64 md:h-56 lg:h-52 cursor-pointer rounded-xl overflow-hidden group"
                onClick={() => setSelected(index)}
                whileHover={{ scale: 1.02 }}
              >
                <Image src={img.src} alt={img.alt} fill className="object-cover" sizes="(max-width:768px) 100vw, 25vw" />
                <div className="absolute inset-0 bg-dark/0 group-hover:bg-dark/60 transition-colors flex items-center justify-center">
                  <span className="text-white font-heading opacity-0 group-hover:opacity-100">View</span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <AnimatePresence>
        {selected !== null && slides[selected] && (
          <motion.div
            className="fixed inset-0 z-50 bg-dark/95 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
          >
            <button className="absolute top-4 right-4 w-12 h-12 bg-white/10 rounded-full flex items-center justify-center" onClick={() => setSelected(null)} aria-label="Close">
              <IoClose className="w-6 h-6 text-white" />
            </button>
            <button
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 rounded-full flex items-center justify-center"
              onClick={(e) => {
                e.stopPropagation();
                setDirection(-1);
                setSelected(selected === 0 ? slides.length - 1 : selected - 1);
              }}
              aria-label="Previous"
            >
              <IoChevronBack className="w-6 h-6 text-white" />
            </button>
            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 rounded-full flex items-center justify-center"
              onClick={(e) => {
                e.stopPropagation();
                setDirection(1);
                setSelected(selected === slides.length - 1 ? 0 : selected + 1);
              }}
              aria-label="Next"
            >
              <IoChevronForward className="w-6 h-6 text-white" />
            </button>
            <div
              className="relative w-[92vw] max-w-4xl h-[55vh] md:h-[80vh] bg-black rounded-xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <AnimatePresence initial={false} custom={direction}>
                <motion.div
                  key={selected}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.22, ease: "easeOut" }}
                  className="absolute inset-0 touch-none"
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.2}
                  onDragEnd={(_, info: PanInfo) => {
                    const swipe = swipePower(info.offset.x, info.velocity.x);
                    if (swipe < -swipeConfidenceThreshold) {
                      setDirection(1);
                      setSelected((cur) =>
                        cur === null ? null : cur === slides.length - 1 ? 0 : cur + 1,
                      );
                      return;
                    }
                    if (swipe > swipeConfidenceThreshold) {
                      setDirection(-1);
                      setSelected((cur) =>
                        cur === null ? null : cur === 0 ? slides.length - 1 : cur - 1,
                      );
                    }
                  }}
                >
                  <Image
                    src={slides[selected].src}
                    alt={slides[selected].alt}
                    fill
                    className="object-contain"
                    sizes="92vw"
                  />
                </motion.div>
              </AnimatePresence>
            </div>
            <p className="absolute bottom-14 left-1/2 -translate-x-1/2 max-w-lg px-4 text-center text-sm text-white/90">
              {slides[selected].alt}
            </p>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white font-heading">
              {selected + 1} / {slides.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <section className="py-24 bg-primary">
        <div className="container mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-4xl md:text-5xl font-heading text-white mb-6">Be Part of Our Story</h2>
            <a href="/contact" className="inline-block px-8 py-4 bg-white text-primary font-heading text-lg tracking-wider hover:bg-gray-100 transition-colors">
              Join Today
            </a>
          </motion.div>
        </div>
      </section>
    </>
  );
}
