"use client";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

export function Initiate() {
  return (
    <section className="relative mx-auto max-w-7xl px-6 py-48 md:py-64 text-center">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 1 }}>
        <p className="text-sm tracking-[0.3em] text-neutral-500 uppercase mb-8">Initiate.</p>
        <h2 className="font-serif text-6xl md:text-9xl mb-12 text-white tracking-tighter">
          Ready to build the <br /> next generation of <br />
          <span className="italic text-neutral-400">intelligent systems?</span>
        </h2>
        <a href="mailto:vvibhansh@gmail.com" className="group inline-flex items-center gap-4 text-2xl md:text-3xl text-white border-b border-neutral-700 pb-4 hover:border-white transition-colors duration-500">
          Transmit Message
          <ArrowUpRight className="w-8 h-8 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-500" />
        </a>
      </motion.div>
      <footer className="absolute bottom-8 left-6 right-6 flex flex-col md:flex-row justify-between items-center text-xs text-neutral-600 tracking-widest uppercase">
        <span>© 2026 VibSocial</span>
        <span>Engineered by Vibhansh</span>
      </footer>
    </section>
  );
}
