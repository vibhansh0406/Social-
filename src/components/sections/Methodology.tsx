"use client";
import { motion } from "framer-motion";

const steps = [
  { num: "01", title: "Research & Logic", desc: "Defining constraints and mapping algorithmic pathways." },
  { num: "02", title: "Architecture & Code", desc: "Building robust systems and training models." },
  { num: "03", title: "Deployment & Intelligence", desc: "Scaling infrastructure and ensuring seamless integration." },
];

export function Methodology() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-32 md:py-48 border-t border-neutral-900/10">
      <motion.h2 
        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        className="font-serif text-5xl md:text-7xl mb-24 text-neutral-900"
      >
        Methodology.
      </motion.h2>
      <div className="space-y-20">
        {steps.map((step, i) => (
          <motion.div key={step.num} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: i * 0.15 }} className="grid grid-cols-1 md:grid-cols-12 gap-8 items-baseline border-b border-neutral-900/10 pb-10 group">
            <span className="col-span-2 text-4xl md:text-6xl font-serif text-neutral-600 group-hover:text-neutral-900 transition-colors duration-500">{step.num}</span>
            <h3 className="col-span-4 text-2xl md:text-4xl font-medium text-neutral-900">{step.title}</h3>
            <p className="col-span-6 text-neutral-600 text-lg leading-relaxed">{step.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
