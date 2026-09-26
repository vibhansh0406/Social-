"use client";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const projects = [
  { title: "VEDA-8B (LLM)", category: "AI / Model Architecture", desc: "Custom Large Language Model architecture optimized for specific domain reasoning and low-latency inference.", img: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80" },
  { title: "Modern SaaS Platform", category: "Web / Full-Stack", desc: "High-performance, scalable SaaS infrastructure featuring real-time data synchronization and microservice backends.", img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80" },
];

export function SelectedWork() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-32 md:py-48">
      <motion.h2 
        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        className="font-serif text-5xl md:text-7xl mb-16 text-neutral-100"
      >
        Selected Work.
      </motion.h2>
      <div className="space-y-24">
        {projects.map((project) => (
          <motion.a href="#" key={project.title} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 1 }} className="group block">
            <div className="relative overflow-hidden rounded-lg aspect-[16/9] mb-8 bg-neutral-900">
              <img src={project.img} alt={project.title} className="w-full h-full object-cover transition-transform duration-[1.2s] group-hover:scale-105 grayscale group-hover:grayscale-0" />
            </div>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <p className="text-sm tracking-widest text-neutral-500 uppercase mb-3">{project.category}</p>
                <h3 className="text-4xl md:text-5xl font-serif text-white mb-4">{project.title}</h3>
                <p className="text-neutral-400 text-lg max-w-2xl">{project.desc}</p>
              </div>
              <div className="w-16 h-16 rounded-full border border-neutral-700 flex items-center justify-center group-hover:bg-white group-hover:border-white transition-all duration-500">
                <ArrowUpRight className="w-6 h-6 text-white group-hover:text-black transition-colors duration-500" />
              </div>
            </div>
          </motion.a>
        ))}
      </div>
    </section>
  );
}
