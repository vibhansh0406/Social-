/**
 * Haptic feedback utility for mobile devices
 * Triggers vibration API if available
 */
export function haptic(duration: number = 10) {
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    try {
      navigator.vibrate(duration);
    } catch (e) {
      // Silently fail if vibration not supported
    }
  }
}

export function hapticLight() {
  haptic(10);
}

export function hapticMedium() {
  haptic(20);
}

export function hapticHeavy() {
  haptic(40);
}

export function hapticSuccess() {
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    navigator.vibrate([10, 50, 10]);
  }
}
