"use client";
import { motion } from "framer-motion";
import CoverflowCarousel from "@/components/ui/coverflow-carousel";

const PROJECTS = [
  {
    src: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=800&fit=crop&q=80",
    alt: "Neural network visualization",
    title: "VEDA-8B",
    subtitle: "LLM Architecture",
    meta: [
      { label: "Type", value: "Language Model" },
      { label: "Parameters", value: "8 Billion" },
      { label: "Status", value: "Production" },
    ],
  },
  {
    src: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=800&fit=crop&q=80",
    alt: "SaaS dashboard analytics",
    title: "Pulse SaaS",
    subtitle: "Full-Stack Platform",
    meta: [
      { label: "Stack", value: "Next.js + Rust" },
      { label: "Users", value: "12,000+" },
      { label: "Status", value: "Live" },
    ],
  },
  {
    src: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&h=800&fit=crop&q=80",
    alt: "Computer vision data stream",
    title: "Vision-X",
    subtitle: "Computer Vision",
    meta: [
      { label: "Framework", value: "PyTorch" },
      { label: "Accuracy", value: "98.4%" },
      { label: "Status", value: "Beta" },
    ],
  },
  {
    src: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=800&fit=crop&q=80",
    alt: "Server racks with blue lighting",
    title: "Neural Gateway",
    subtitle: "API Infrastructure",
    meta: [
      { label: "Stack", value: "Go + gRPC" },
      { label: "Latency", value: "< 50ms" },
      { label: "Status", value: "Production" },
    ],
  },
  {
    src: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=800&fit=crop&q=80",
    alt: "Circuit board macro",
    title: "DataForge",
    subtitle: "Analytics Engine",
    meta: [
      { label: "Stack", value: "ClickHouse" },
      { label: "Throughput", value: "1M rps" },
      { label: "Status", value: "Live" },
    ],
  },
  {
    src: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=800&fit=crop&q=80",
    alt: "Global realtime network",
    title: "ChatMesh",
    subtitle: "Realtime Protocol",
    meta: [
      { label: "Stack", value: "WebSocket + CRDT" },
      { label: "Peers", value: "P2P" },
      { label: "Status", value: "Research" },
    ],
  },
];

export function SelectedWork() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 py-20 sm:py-32 md:py-48">
      <motion.h2
        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        className="font-serif text-4xl sm:text-5xl md:text-7xl mb-10 sm:mb-16 text-neutral-900"
      >
        Selected Work.
      </motion.h2>

      <CoverflowCarousel
        slides={PROJECTS}
        showCaption
        showPagination
        showNavigation
        cardWidth="clamp(160px, 60vw, 340px)"
        label="Selected projects"
        cardClassName="ring-1 ring-neutral-900/10"
      />
    </section>
  );
}
