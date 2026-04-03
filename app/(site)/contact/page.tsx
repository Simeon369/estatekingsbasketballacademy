"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { IoLocation, IoCall, IoMail, IoTime, IoLogoInstagram, IoLogoFacebook, IoLogoTwitter, IoLogoYoutube, IoCheckmarkCircle } from "react-icons/io5";
import Button from "@/components/ui/Button";
import { fadeInUp, staggerContainer, staggerItem } from "@/lib/animations";

const contactInfo = [
  {
    icon: IoLocation,
    title: "Venue",
    content: "Giants of Africa Basketball Court, Mini Stadium, Abesan, Lagos",
  },
  { icon: IoCall, title: "Phone", content: "+234 803 801 2444", href: "tel:+2348038012444" },
  { icon: IoMail, title: "Email", content: "estatekingsbball@gmail.com", href: "mailto:estatekingsbball@gmail.com" },
  { icon: IoTime, title: "Training Days", content: "Friday 2PM–5PM · Saturday 7AM–9AM" },
];
const socials = [
  { icon: IoLogoInstagram, href: "#", label: "Instagram" },
  { icon: IoLogoFacebook, href: "#", label: "Facebook" },
  { icon: IoLogoTwitter, href: "#", label: "Twitter" },
  { icon: IoLogoYoutube, href: "#", label: "YouTube" },
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", program: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as
          | { error?: string }
          | null;
        throw new Error(data?.error || "Failed to send message");
      }

      setSubmitted(true);
      setForm({ name: "", email: "", phone: "", program: "", message: "" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <section className="pt-32 pb-16 bg-dark">
        <div className="container mx-auto px-4">
          <motion.div className="text-center" initial="hidden" animate="visible" variants={fadeInUp}>
            <TribalPatternStrip className="h-10 md:h-12 mb-8 opacity-90" />
            <h1 className="text-5xl md:text-7xl font-heading text-white mb-6">Contact <span className="text-primary">Us</span></h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">Ready to start your basketball journey? Get in touch today.</p>
          </motion.div>
        </div>
      </section>

      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <h2 className="text-3xl font-heading mb-8">Send Us a Message</h2>
              {submitted ? (
                <motion.div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                  <IoCheckmarkCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-2xl font-heading text-green-700 mb-2">Message Sent!</h3>
                  <p className="text-green-600">Thank you. We'll get back to you within 24 hours.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {error ? (
                    <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">
                      {error}
                    </div>
                  ) : null}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                      <input disabled={isSubmitting} type="text" id="name" name="name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary" placeholder="John Doe" />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                      <input disabled={isSubmitting} type="email" id="email" name="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary" placeholder="john@example.com" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                      <input disabled={isSubmitting} type="tel" id="phone" name="phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary" placeholder="(123) 456-7890" />
                    </div>
                    <div>
                      <label htmlFor="program" className="block text-sm font-medium text-gray-700 mb-2">
                        Program
                      </label>
                      <select disabled={isSubmitting} id="program" name="program" value={form.program} onChange={(e) => setForm({ ...form, program: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary bg-white">
                        <option value="">Select</option>
                        <option value="basketball-development">
                          Basketball Development (Ages 4–18)
                        </option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">Message *</label>
                    <textarea disabled={isSubmitting} id="message" name="message" required rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary resize-none" placeholder="Your message..." />
                  </div>
                  <Button type="submit" size="lg">
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              )}
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <h2 className="text-3xl font-heading mb-8">Get in Touch</h2>
              <motion.div className="space-y-6 mb-12" variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                {contactInfo.map((info) => (
                  <motion.div key={info.title} variants={staggerItem} className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <info.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-heading text-lg">{info.title}</h3>
                      {info.href ? <a href={info.href} className="text-gray-600 hover:text-primary">{info.content}</a> : <p className="text-gray-600">{info.content}</p>}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
              <div className="mb-12">
                <h3 className="font-heading text-lg mb-4">Follow Us</h3>
                <div className="flex gap-4">
                  {socials.map((s) => (
                    <motion.a key={s.label} href={s.href} className="w-12 h-12 bg-dark rounded-xl flex items-center justify-center hover:bg-primary transition-colors" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                      <s.icon className="w-6 h-6 text-white" />
                    </motion.a>
                  ))}
                </div>
              </div>
              <div className="aspect-video bg-gray-200 rounded-2xl overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3963.2963679829!2d3.2664033739753386!3d6.610049122153608!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103b91516e54e993%3A0x44c1c342778e08ea!2sGOA%20Abesan!5e0!3m2!1sen!2sng!4v1772655764510!5m2!1sen!2sng"
                  width="600"
                  height="450"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full"
                ></iframe>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-dark">
        <div className="container mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-4xl md:text-5xl font-heading text-white mb-6">Prefer to Visit?</h2>
            <a href="tel:+1234567890" className="inline-block px-8 py-4 bg-primary text-white font-heading text-lg tracking-wider hover:bg-primary/90 transition-colors mr-4">Call Now</a>
            <a href="#" className="inline-block px-8 py-4 border-2 border-white text-white font-heading text-lg tracking-wider hover:bg-white hover:text-dark transition-colors">Get Directions</a>
          </motion.div>
        </div>
      </section>
    </>
  );
}
