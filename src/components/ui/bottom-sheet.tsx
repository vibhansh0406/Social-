"use client";
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { hapticMedium } from "@/lib/haptics";
import type { CoverflowSlide } from "./coverflow-carousel";

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  slide: CoverflowSlide | null;
}

export default function BottomSheet({ isOpen, onClose, slide }: BottomSheetProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      hapticMedium();
      document.body.style.overflow = "hidden";
    } else {
      const timer = setTimeout(() => setIsVisible(false), 300);
      document.body.style.overflow = "";
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isVisible || !slide) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] transition-opacity duration-300"
        style={{ opacity: isOpen ? 1 : 0 }}
        onClick={onClose}
      />
      
      {/* Sheet */}
      <div 
        className="fixed bottom-0 left-0 right-0 z-[101] bg-[#f5efe6] rounded-t-3xl sm:rounded-t-[2rem] shadow-2xl transform transition-transform duration-300 ease-out"
        style={{ transform: isOpen ? "translateY(0)" : "translateY(100%)" }}
      >
        {/* Handle */}
        <div className="flex justify-center pt-4 pb-2">
          <div className="w-12 h-1.5 bg-neutral-400/40 rounded-full" />
        </div>

        {/* Content */}
        <div className="px-6 pb-8 pt-4 max-h-[70vh] overflow-y-auto">
          <div className="aspect-square rounded-2xl overflow-hidden mb-6 bg-neutral-200">
            <img 
              src={slide.src} 
              alt={slide.alt} 
              className="w-full h-full object-cover"
            />
          </div>
          
          {slide.title && (
            <h3 className="text-3xl sm:text-4xl font-serif text-neutral-900 mb-2">
              {slide.title}
            </h3>
          )}
          
          {slide.subtitle && (
            <p className="text-lg text-neutral-500 mb-6 italic">
              {slide.subtitle}
            </p>
          )}
          
          {slide.meta && slide.meta.length > 0 && (
            <div className="space-y-3">
              {slide.meta.map((row) => (
                <div key={row.label} className="flex justify-between py-3 border-b border-neutral-900/10">
                  <dt className="text-sm text-neutral-500 uppercase tracking-wider">{row.label}</dt>
                  <dd className="text-sm font-medium text-neutral-900">{row.value}</dd>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/60 backdrop-blur-md border border-neutral-900/10 hover:bg-neutral-900 hover:text-white transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </>
  );
}
