"use client";
import { useState, useEffect } from "react";

export function useDevice() {
  const [isHighEnd, setIsHighEnd] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const desktopQuery = window.matchMedia("(pointer: fine)");
    setIsDesktop(desktopQuery.matches);
    const cores = navigator.hardwareConcurrency || 2;
    setIsHighEnd(cores >= 4 || desktopQuery.matches);
  }, []);

  return { isHighEnd, isDesktop };
}
