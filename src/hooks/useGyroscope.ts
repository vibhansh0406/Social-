"use client";
import { useState, useEffect, useRef } from "react";

interface OrientationData {
  beta: number;
  gamma: number;
}

export function useGyroscope() {
  const [orientation, setOrientation] = useState<OrientationData>({ beta: 0, gamma: 0 });
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isSupported, setIsSupported] = useState(false);
  const targetRef = useRef<OrientationData>({ beta: 0, gamma: 0 });
  const currentRef = useRef<OrientationData>({ beta: 0, gamma: 0 });

  useEffect(() => {
    if (typeof window !== 'undefined' && 'DeviceOrientationEvent' in window) {
      setIsSupported(true);
      if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
        setHasPermission(false);
      } else {
        setHasPermission(true);
      }
    }
  }, []);

  useEffect(() => {
    if (!isSupported || hasPermission !== true) return;

    const handleOrientation = (event: DeviceOrientationEvent) => {
      const beta = Math.max(-30, Math.min(30, event.beta || 0));
      const gamma = Math.max(-30, Math.min(30, event.gamma || 0));
      targetRef.current = { beta, gamma };
    };

    window.addEventListener('deviceorientation', handleOrientation, { passive: true });
    return () => window.removeEventListener('deviceorientation', handleOrientation);
  }, [isSupported, hasPermission]);

  useEffect(() => {
    let raf: number;
    const lerp = (start: number, end: number, factor: number) => start + (end - start) * factor;
    
    const animate = () => {
      currentRef.current.beta = lerp(currentRef.current.beta, targetRef.current.beta, 0.08);
      currentRef.current.gamma = lerp(currentRef.current.gamma, targetRef.current.gamma, 0.08);
      setOrientation({ ...currentRef.current });
      raf = requestAnimationFrame(animate);
    };
    
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, []);

  const requestPermission = async () => {
    try {
      const permission = await (DeviceOrientationEvent as any).requestPermission();
      if (permission === 'granted') {
        setHasPermission(true);
      }
    } catch (error) {
      console.error('Permission request failed:', error);
    }
  };

  return { orientation, hasPermission, isSupported, requestPermission };
}
