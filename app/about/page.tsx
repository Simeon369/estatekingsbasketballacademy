"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { IoBasketball, IoTrophy, IoFlash, IoPeople } from "react-icons/io5";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import { coaches } from "@/lib/constants";
import { fadeInUp, staggerContainer, staggerItem } from "@/lib/animations";

const values = [
  {
    icon: IoTrophy,
    title: "Excellence",
    description: "We strive for excellence in everything we do.",
  },
  {
    icon: IoFlash,
    title: "Dedication",
    description: "Committed coaches and players working together.",
  },
  {
    icon: IoPeople,
    title: "Community",
    description: "Building a supportive family of athletes and coaches.",
  },
];

export default function AboutPage() {
  return (
    <>
      <section className="pt-32 pb-16 bg-dark">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center"
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
          >
            <h1 className="text-5xl md:text-7xl font-heading text-white mb-6">
              About{" "}
              <span className="text-primary">
                Estate Kings Basketball Academy
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Building champions on and off the court since 2021
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="text-primary font-heading text-lg tracking-widest">
                Our Mission
              </span>
              <h2 className="text-4xl md:text-5xl font-heading mt-2 mb-6">
                Developing Players of Character
              </h2>
              <p className="text-gray-600 mb-6">
                At Estate Kings Basketball Academy, we believe in developing the
                whole athlete – mind, body, and character. Every session is
                designed to build strong fundamentals, confidence, and
                discipline, while also teaching teamwork, leadership, and
                respect. We go beyond drills and game plays to create an
                environment where young athletes learn how to compete the right
                way, handle success and failure with maturity, and carry those
                lessons into school, family life, and their communities.
              </p>
            </motion.div>
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="aspect-square rounded-2xl overflow-hidden relative">
                <Image
                  src="/about.jpg"
                  alt="Estate Kings Basketball Academy players and coaches"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <motion.div
                className="absolute -bottom-8 -left-8 bg-white p-6 rounded-xl shadow-xl"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
              >
                <p className="text-4xl font-heading text-primary">5+</p>
                <p className="text-gray-600">Years of Excellence</p>
              </motion.div>
            </motion.div>
          </div>

          {/* Video highlight */}
          <motion.div
            className="mt-16 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-2xl md:text-3xl font-heading text-center mb-4">
              Experience Estate Kings In Action
            </h3>
            <p className="text-gray-600 text-center mb-6">
              Get a feel for the environment, energy, and standards we hold our
              players to on and off the court.
            </p>
            <div className="aspect-video rounded-2xl overflow-hidden shadow-xl bg-black">
              <iframe
                width="560"
                height="315"
                src="https://www.youtube.com/embed/Y-OAV4B-cYk?si=DJmooZJHn47RgvWL"
                title="Estate Kings Basketball Academy video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
                className="w-full h-full"
              ></iframe>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <SectionHeading
            title="Our Values"
            subtitle="The principles that guide everything we do"
          />
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {values.map((v) => (
              <motion.div
                key={v.title}
                variants={staggerItem}
                className="bg-white p-8 rounded-2xl text-center shadow-lg"
                whileHover={{ y: -8 }}
              >
                <div className="w-20 h-20 mx-auto bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                  <v.icon className="w-10 h-10 text-primary" />
                </div>
                <h3 className="text-2xl font-heading mb-4">{v.title}</h3>
                <p className="text-gray-600">{v.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-24">
        <div className="container mx-auto px-4">
          <SectionHeading
            title="Meet Our Coaches"
            subtitle="Expert coaches dedicated to your development"
          />
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 md:w-[70%] mx-auto gap-12 mt-12"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {coaches.map((coach) => (
              <motion.div
                key={coach.id}
                variants={staggerItem}
                className="group"
                whileHover={{ y: -8 }}
              >
                <div className="relative aspect-[3/4] bg-gray-200 rounded-2xl overflow-hidden mb-6">
                  <Image
                    src={coach.image}
                    alt={coach.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark/80 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-2xl font-heading text-white">
                      {coach.name}
                    </h3>
                    <p className="text-primary font-heading">{coach.role}</p>
                  </div>
                </div>
                <p className="text-gray-600 text-center text-sm md:text-base md:text-left">{coach.bio}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-24 bg-primary">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-heading text-white mb-6">
              Ready to Join the Family?
            </h2>
            <Button
              href="/contact"
              variant="outline"
              size="lg"
              className="bg-white text-primary hover:bg-gray-100"
            >
              Get in Touch
            </Button>
          </motion.div>
        </div>
      </section>
    </>
  );
}
