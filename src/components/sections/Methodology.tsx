"use client";
import { motion } from "framer-motion";
import { useDevice } from "@/hooks/useDevice";

const steps = [
  { num: "01", title: "Research & Logic", desc: "Defining constraints and mapping algorithmic pathways." },
  { num: "02", title: "Architecture & Code", desc: "Building robust systems and training models." },
  { num: "03", title: "Deployment & Intelligence", desc: "Scaling infrastructure and ensuring seamless integration." },
];

export function Methodology() {
  const { isDesktop } = useDevice();

  return (
    <section className="mx-auto max-w-7xl px-6 sm:px-12 py-24 sm:py-40 border-t border-white/10">
      <motion.h2 
        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        className="font-serif text-5xl sm:text-7xl md:text-8xl mb-20 text-white tracking-tight"
      >
        Methodology.
      </motion.h2>
      
      <div className="space-y-16 sm:space-y-32">
        {steps.map((step, i) => (
          <motion.div 
            key={step.num} 
            initial={{ opacity: 0, y: 30 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: i * 0.1 }} 
            className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-12 items-start border-b border-white/10 pb-12 md:pb-20 group"
          >
            {/* Number */}
            <div className="md:col-span-2">
              <span className="text-4xl md:text-6xl font-serif text-white/40 group-hover:text-white transition-colors duration-700">
                {step.num}
              </span>
            </div>
            
            {/* Title */}
            <div className="md:col-span-4">
              <h3 className="text-2xl md:text-4xl font-medium text-white leading-tight tracking-tight">
                {step.title}
              </h3>
            </div>
            
            {/* Description */}
            <div className="md:col-span-6">
              <p className="text-base md:text-lg text-white/70 leading-relaxed max-w-md">
                {step.desc}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
