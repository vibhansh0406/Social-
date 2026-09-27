"use client";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

export function Initiate() {
  return (
    <section className="relative mx-auto max-w-7xl px-4 sm:px-6 py-32 sm:py-48 md:py-64 text-center">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 1 }}>
        <p className="text-xs sm:text-sm tracking-[0.3em] text-neutral-500 uppercase mb-6 sm:mb-8">Initiate.</p>
        <h2 className="font-serif text-4xl sm:text-6xl md:text-9xl mb-8 sm:mb-12 text-neutral-900 tracking-tighter leading-tight">
          Ready to build the <br className="hidden sm:block" /> next generation of <br className="hidden sm:block" />
          <span className="italic text-neutral-500">intelligent systems?</span>
        </h2>
        <a href="mailto:vvibhansh@gmail.com" className="group inline-flex items-center gap-3 sm:gap-4 text-xl sm:text-2xl md:text-3xl text-neutral-900 border-b border-neutral-400 pb-3 sm:pb-4 hover:border-neutral-900 transition-colors duration-500">
          Transmit Message
          <ArrowUpRight className="w-5 h-5 sm:w-8 sm:h-8 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-500" />
        </a>
      </motion.div>
      <footer className="absolute bottom-6 sm:bottom-8 left-4 sm:left-6 right-4 sm:right-6 flex flex-col sm:flex-row justify-between items-center text-[10px] sm:text-xs text-neutral-500 tracking-widest uppercase gap-2">
        <span>© 2026 VibSocial</span>
        <span>Engineered by Vibhansh</span>
      </footer>
    </section>
  );
}
