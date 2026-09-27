"use client";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useState, useEffect } from "react";

const socials = [
  { name: "GitHub", url: "https://github.com/vibhansh0406" },
  { name: "Instagram", url: "https://instagram.com/vibhansh_04" },
];

export function Initiate() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative mx-auto max-w-7xl px-6 sm:px-12 py-24 sm:py-40 flex flex-col min-h-[80vh] justify-between">
      
      {/* Main CTA - Centered */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} 
        whileInView={{ opacity: 1, scale: 1 }} 
        viewport={{ once: true }} 
        transition={{ duration: 1 }}
        className="flex flex-col items-center text-center z-10 w-full"
      >
        <h2 className="font-serif text-5xl sm:text-7xl md:text-9xl text-neutral-900 tracking-tighter leading-[0.9] mb-12">
          Let's build the <br />
          <span className="italic text-neutral-500">future.</span>
        </h2>

        <a href="mailto:vvibhansh@gmail.com" className="group relative inline-flex items-center gap-4 text-xl sm:text-2xl text-neutral-900 mb-20">
          <span className="relative z-10">Transmit Message</span>
          <ArrowUpRight className="w-6 h-6 group-hover:rotate-45 transition-transform duration-500" />
          <div className="absolute inset-x-0 bottom-0 border-b border-neutral-900/30 group-hover:border-neutral-900 transition-colors" />
        </a>
      </motion.div>

      {/* Deep Footer - Mobile Optimized */}
      <footer className="mt-auto pt-12 border-t border-neutral-900/10 flex flex-col items-center gap-10 w-full">
        
        {/* Socials */}
        <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
          {socials.map((s) => (
            <motion.a 
              key={s.name} 
              href={s.url} 
              target="_blank" 
              rel="noopener noreferrer"
              whileHover={{ y: -3 }}
              className="px-8 py-3 rounded-full bg-white/60 border border-neutral-900/10 backdrop-blur-md text-xs sm:text-sm uppercase tracking-widest text-neutral-800 hover:bg-neutral-900 hover:text-white hover:border-neutral-900 transition-all duration-300 shadow-sm"
            >
              {s.name}
            </motion.a>
          ))}
        </div>

        {/* Time & Copyright - Centered Stack */}
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex items-center gap-3 text-neutral-500">
            <span className="text-[10px] sm:text-xs uppercase tracking-widest">Local Time</span>
            <span className="font-mono text-sm sm:text-base text-neutral-900">{time} IST</span>
          </div>
          <div className="text-[10px] text-neutral-400 uppercase tracking-widest mt-2">
            © 2024 VibSocial. Engineered by Vibhansh.
          </div>
        </div>
      </footer>
    </section>
  );
}
