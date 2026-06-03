import { useEffect, useRef, useState } from "react";
import { usePresence } from "motion/react";

interface SandTransitionImageProps {
  src: string;
  alt: string;
  className?: string;
  key?: string | number;
}

export function SandTransitionImage({ src, alt, className = "" }: SandTransitionImageProps) {
  const [isPresent, safeToRemove] = usePresence();
  const filterIdRef = useRef(`sand-filter-${Math.random().toString(36).substring(2, 11)}`);
  
  const [progress, setProgress] = useState(isPresent ? 1 : 0);
  const [isEntering, setIsEntering] = useState(isPresent);

  useEffect(() => {
    let active = true;
    const startTime = performance.now();
    const duration = 900; // 900ms transition time

    setIsEntering(isPresent);

    const tick = (now: number) => {
      if (!active) return;
      const elapsed = now - startTime;
      const t = Math.min(elapsed / duration, 1);

      let currentProgress = 0;
      if (isPresent) {
        // Entering: quartic ease-out
        const eased = 1 - Math.pow(1 - t, 4);
        currentProgress = 1 - eased; // Start at 1 (dissolved) and go to 0 (fully clear)
      } else {
        // Exiting: cubic ease-in
        const eased = Math.pow(t, 3);
        currentProgress = eased; // Start at 0 (fully clear) and go to 1 (dissolved)
      }

      setProgress(currentProgress);

      if (t < 1) {
        requestAnimationFrame(tick);
      } else {
        if (!isPresent) {
          safeToRemove?.();
        }
      }
    };

    requestAnimationFrame(tick);

    return () => {
      active = false;
    };
  }, [isPresent, safeToRemove]);

  const filterId = filterIdRef.current;

  // Calculations for filter values
  const scale = 150 * progress;
  const dy = isEntering ? -80 * progress : 120 * progress;
  const dx = isEntering ? -30 * progress : 30 * progress;
  const stdDeviation = 6 * progress;
  const alpha = Math.max(0, 1 - progress * 1.2);

  return (
    <div className={`relative w-full h-full ${className}`}>
      {/* Inline SVG definitions for the sand displacement effect */}
      <svg className="absolute w-0 h-0 pointer-events-none" aria-hidden="true" style={{ position: 'absolute', width: 0, height: 0 }}>
        <defs>
          <filter id={filterId} x="-50%" y="-50%" width="200%" height="200%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="1.8"
              numOctaves="4"
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale={scale}
              xChannelSelector="R"
              yChannelSelector="G"
              result="displaced"
            />
            <feOffset
              in="displaced"
              dx={dx}
              dy={dy}
              result="offset"
            />
            <feGaussianBlur
              in="offset"
              stdDeviation={stdDeviation}
              result="blur"
            />
            <feColorMatrix
              type="matrix"
              values={`1 0 0 0 0
                       0 1 0 0 0
                       0 0 1 0 0
                       0 0 0 ${alpha} 0`}
            />
          </filter>
        </defs>
      </svg>

      <img
        src={src}
        alt={alt}
        crossOrigin="anonymous"
        referrerPolicy="no-referrer"
        className="w-full h-full object-contain"
        style={{
          filter: `url(#${filterId})`,
        }}
      />
    </div>
  );
}
export default SandTransitionImage;
