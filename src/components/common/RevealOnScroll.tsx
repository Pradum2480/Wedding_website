import React, { useEffect, useRef, useState } from 'react';
import { useScrollDirection } from '../../hooks/useScrollDirection';

interface RevealOnScrollProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'fade-up' | 'scale-up' | 'fade-in' | 'slide-left' | 'slide-right';
  delayMs?: number;
  durationMs?: number;
  threshold?: number;
  once?: boolean;
}

export const RevealOnScroll: React.FC<RevealOnScrollProps> = ({
  children,
  className = '',
  variant = 'fade-up',
  delayMs = 0,
  durationMs = 650,
  threshold = 0.08,
  once = true,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement | null>(null);
  const { scrollDirection } = useScrollDirection();
  const lastDirectionRef = useRef<'down' | 'up'>('down');

  useEffect(() => {
    lastDirectionRef.current = scrollDirection;
  }, [scrollDirection]);

  useEffect(() => {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) {
            observer.unobserve(entry.target);
          }
        } else if (!once) {
          // Re-trigger animation when scrolling away and back
          setIsVisible(false);
        }
      },
      {
        threshold,
        rootMargin: '20px 0px -20px 0px',
      }
    );

    const currentEl = elementRef.current;
    if (currentEl) {
      observer.observe(currentEl);
    }

    return () => {
      if (currentEl) {
        observer.unobserve(currentEl);
      }
    };
  }, [threshold, once]);

  // Compute direction-aware entrance styles based on upward or downward scroll
  const getVariantStyles = () => {
    if (!isVisible) {
      const isUp = lastDirectionRef.current === 'up';

      switch (variant) {
        case 'scale-up':
          return `opacity-0 scale-95 ${isUp ? '-translate-y-6' : 'translate-y-6'}`;
        case 'slide-left':
          return 'opacity-0 -translate-x-8';
        case 'slide-right':
          return 'opacity-0 translate-x-8';
        case 'fade-in':
          return 'opacity-0';
        case 'fade-up':
        default:
          return `opacity-0 ${isUp ? '-translate-y-7' : 'translate-y-7'}`;
      }
    }
    return 'opacity-100 scale-100 translate-x-0 translate-y-0';
  };

  return (
    <div
      ref={elementRef}
      className={`transition-all ${getVariantStyles()} ${className}`}
      style={{
        transitionDuration: `${durationMs}ms`,
        transitionDelay: isVisible ? `${delayMs}ms` : '0ms',
        transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
        willChange: 'transform, opacity',
      }}
    >
      {children}
    </div>
  );
};
