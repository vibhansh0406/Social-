"use client";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const socials = [
  { name: "GitHub", url: "https://github.com/vibhansh0406" },
  { name: "Instagram", url: "https://instagram.com/vibhansh_04" },
];

export function Initiate() {
  return (
    <section className="relative mx-auto max-w-7xl px-4 sm:px-6 py-32 sm:py-48 md:py-64 flex flex-col min-h-[70vh]">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} 
        whileInView={{ opacity: 1, scale: 1 }} 
        viewport={{ once: true }} 
        transition={{ duration: 1 }}
        className="flex-grow flex flex-col items-center justify-center text-center"
      >
        <p className="text-xs sm:text-sm tracking-[0.3em] text-neutral-500 uppercase mb-6 sm:mb-8">Initiate.</p>
        <h2 className="font-serif text-4xl sm:text-6xl md:text-8xl mb-8 sm:mb-12 text-neutral-900 tracking-tighter leading-[1.1]">
          Ready to build the <br className="hidden sm:block" /> next generation of <br className="hidden sm:block" />
          <span className="italic text-neutral-500">intelligent systems?</span>
        </h2>
        <a href="mailto:vvibhansh@gmail.com" className="group inline-flex items-center gap-3 sm:gap-4 text-xl sm:text-2xl md:text-3xl text-neutral-900 border-b border-neutral-400 pb-3 sm:pb-4 hover:border-neutral-900 transition-colors duration-500">
          Transmit Message
          <ArrowUpRight className="w-5 h-5 sm:w-8 sm:h-8 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-500" />
        </a>
      </motion.div>

      {/* Premium Social Footer */}
      <footer className="mt-auto pt-20 flex flex-col items-center gap-8">
        <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
          {socials.map((s) => (
            <a 
              key={s.name} 
              href={s.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="group relative px-5 py-2.5 rounded-full border border-neutral-900/20 bg-white/30 backdrop-blur-sm text-[10px] sm:text-xs uppercase tracking-widest text-neutral-700 hover:bg-neutral-900 hover:text-white hover:border-neutral-900 hover:scale-105 transition-all duration-300"
            >
              {s.name}
            </a>
          ))}
        </div>
        
        <div className="flex flex-col sm:flex-row justify-between items-center w-full text-[10px] text-neutral-500 tracking-widest uppercase gap-2 px-4">
          <span>© 2026 VibSocial</span>
          <span>Engineered by Vibhansh</span>
        </div>
      </footer>
    </section>
  );
}
