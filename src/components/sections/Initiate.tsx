"use client";
import { motion } from "framer-motion";
import { ArrowUpRight, Circle } from "lucide-react";
import { useDevice } from "@/hooks/useDevice";
import { useState, useEffect } from "react";

const socials = [
  { name: "GitHub", url: "https://github.com/vibhansh0406" },
  { name: "Instagram", url: "https://instagram.com/vibhansh_04" },
];

export function Initiate() {
  const { isHighEnd } = useDevice();
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
    <section className="relative mx-auto max-w-7xl px-6 sm:px-12 py-32 sm:py-48 flex flex-col min-h-[80vh] justify-between">
      
      {/* Main CTA */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} 
        whileInView={{ opacity: 1, scale: 1 }} 
        viewport={{ once: true }} 
        transition={{ duration: 1 }}
        className="flex flex-col items-center text-center z-10"
      >
        <div className="flex items-center gap-2 mb-8 px-4 py-2 rounded-full bg-neutral-900/5 border border-neutral-900/10 backdrop-blur-md">
          <Circle className="w-2 h-2 fill-green-500 text-green-500 animate-pulse" />
          <span className="text-[10px] uppercase tracking-widest text-neutral-600 font-medium">Available for Q3 2024</span>
        </div>

        <h2 className="font-serif text-5xl sm:text-7xl md:text-9xl text-neutral-900 tracking-tighter leading-[0.9] mb-12">
          Let's build the <br />
          <span className="italic text-neutral-500">future.</span>
        </h2>

        <a href="mailto:vvibhansh@gmail.com" className="group relative inline-flex items-center gap-4 text-xl sm:text-2xl text-neutral-900">
          <span className="relative z-10">Transmit Message</span>
          <ArrowUpRight className="w-6 h-6 group-hover:rotate-45 transition-transform duration-500" />
          <div className="absolute inset-0 border-b border-neutral-900/30 group-hover:border-neutral-900 transition-colors" />
        </a>
      </motion.div>

      {/* Deep Footer */}
      <footer className="mt-20 pt-12 border-t border-neutral-900/10 flex flex-col md:flex-row justify-between items-end gap-12">
        
        {/* Socials with Hover Depth */}
        <div className="flex flex-wrap gap-4">
          {socials.map((s, i) => (
            <motion.a 
              key={s.name} 
              href={s.url} 
              target="_blank" 
              rel="noopener noreferrer"
              whileHover={{ y: -5, scale: 1.05 }}
              className="px-6 py-3 rounded-full bg-white/50 border border-neutral-900/10 backdrop-blur-md text-xs uppercase tracking-widest text-neutral-800 hover:bg-neutral-900 hover:text-white hover:border-neutral-900 transition-all duration-300 shadow-sm hover:shadow-xl"
            >
              {s.name}
            </motion.a>
          ))}
        </div>

        {/* Context & Time */}
        <div className="flex flex-col items-start md:items-end gap-2">
          <div className="flex items-center gap-3 text-neutral-500">
            <span className="text-xs uppercase tracking-widest">Local Time</span>
            <span className="font-mono text-sm text-neutral-900">{time} IST</span>
          </div>
          <div className="text-[10px] text-neutral-400 uppercase tracking-widest mt-2">
            © 2024 VibSocial. Engineered by Vibhansh.
          </div>
        </div>
      </footer>
    </section>
  );
}
