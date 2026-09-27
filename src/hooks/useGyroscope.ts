"use client";
import { useState, useEffect, useRef } from "react";

export function useGyroscope() {
  const [orientation, setOrientation] = useState({ x: 0, y: 0 });
  const [isIOS, setIsIOS] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const targetRef = useRef({ x: 0, y: 0 });
  const currentRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const isApple = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(isApple);
    
    if (!isApple) {
      setPermissionGranted(true);
    }
  }, []);

  useEffect(() => {
    if (!permissionGranted) return;

    const handleOrientation = (event: DeviceOrientationEvent) => {
      const x = event.gamma || 0;
      const y = event.beta || 0;
      targetRef.current = { x, y };
    };

    window.addEventListener('deviceorientation', handleOrientation, { passive: true });
    return () => window.removeEventListener('deviceorientation', handleOrientation);
  }, [permissionGranted]);

  useEffect(() => {
    let raf: number;
    const animate = () => {
      currentRef.current.x += (targetRef.current.x - currentRef.current.x) * 0.08;
      currentRef.current.y += (targetRef.current.y - currentRef.current.y) * 0.08;
      setOrientation({ ...currentRef.current });
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
        if (response === 'granted') {
          setPermissionGranted(true);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  return { orientation, isIOS, permissionGranted, requestPermission };
}
