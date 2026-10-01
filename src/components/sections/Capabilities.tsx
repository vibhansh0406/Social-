"use client";
import { motion } from "framer-motion";
import { Brain, Network, Code2, Server } from "lucide-react";

const capabilities = [
  { icon: Brain, title: "Machine Learning", desc: "Predictive modeling, data pipelines, and intelligent algorithms." },
  { icon: Network, title: "Deep Learning", desc: "Neural networks, NLP, and computer vision architectures." },
  { icon: Code2, title: "Full-Stack Web", desc: "High-performance interfaces and robust backend systems." },
  { icon: Server, title: "Scalable Architecture", desc: "Cloud infrastructure, microservices, and deployment strategies." },
];

export function Capabilities() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 py-20 sm:py-32 md:py-48">
      <motion.h2 
        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        className="font-serif text-4xl sm:text-5xl md:text-7xl mb-10 sm:mb-16 text-white"
      >
        Capabilities.
      </motion.h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-neutral-900/10 border border-neutral-900/10">
        {capabilities.map((cap, i) => (
          <motion.div
            key={cap.title}
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            transition={{ duration: 0.8, delay: i * 0.1 }}
            className="group p-6 sm:p-10 md:p-16 bg-white/5 backdrop-blur-md hover:bg-white/10 transition-colors duration-500 relative overflow-hidden"
          >
            <cap.icon className="w-8 h-8 sm:w-12 sm:h-12 text-white/70 group-hover:text-white transition-colors duration-500 mb-4 sm:mb-8" />
            <h3 className="text-xl sm:text-2xl md:text-3xl font-medium text-white mb-2 sm:mb-4">{cap.title}</h3>
            <p className="text-white/70 text-sm sm:text-lg leading-relaxed max-w-md">{cap.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
