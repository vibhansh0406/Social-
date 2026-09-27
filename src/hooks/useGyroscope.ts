"use client";
import { useState, useEffect, useRef } from "react";

export function useGyroscope() {
  const [orientation, setOrientation] = useState({ x: 0, y: 0 });
  const [isIOS, setIsIOS] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState(false);
  
  const targetRef = useRef({ x: 0, y: 0 });
  const currentRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const isApple = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(isApple);
    if (!isApple) setPermissionGranted(true);
  }, []);

  useEffect(() => {
    if (!permissionGranted || typeof window === 'undefined') return;

    const handleOrientation = (event: DeviceOrientationEvent) => {
      if (event.gamma !== null) targetRef.current.x = event.gamma;
      if (event.beta !== null) targetRef.current.y = event.beta;
    };

    window.addEventListener('deviceorientation', handleOrientation, { passive: true });
    return () => window.removeEventListener('deviceorientation', handleOrientation);
  }, [permissionGranted]);

  useEffect(() => {
    let raf: number;
    const animate = () => {
      const targetX = targetRef.current.x;
      const targetY = targetRef.current.y;
      const currentX = currentRef.current.x;
      const currentY = currentRef.current.y;

      // 1. DEADZONE: Ignore micro-movements (hand shakes)
      const dx = targetX - currentX;
      const dy = targetY - currentY;
      
      if (Math.abs(dx) > 0.5 || Math.abs(dy) > 0.5) {
        // 2. HEAVY LERP: Smooth out the movement (0.04 is very smooth)
        currentRef.current.x += dx * 0.04;
        currentRef.current.y += dy * 0.04;
        setOrientation({ x: currentRef.current.x, y: currentRef.current.y });
      }

      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, []);

  const requestPermission = async () => {
    try {
      const DeviceOrientationEventAny = DeviceOrientationEvent as any;
      if (typeof DeviceOrientationEventAny.requestPermission === 'function') {
        const response = await DeviceOrientationEventAny.requestPermission();
        if (response === 'granted') setPermissionGranted(true);
      }
    } catch (e) { console.error(e); }
  };

  return { orientation, isIOS, permissionGranted, requestPermission };
}
