import React from 'react';
import { useScrollDirection } from '../../hooks/useScrollDirection';

export const ScrollParallaxDecorations: React.FC = () => {
  const { scrollY } = useScrollDirection();

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none" aria-hidden="true">
      {/* Parallax Golden Mandala 1 (Top Right) */}
      <div 
        className="absolute -top-16 -right-20 w-96 h-96 rounded-full border border-gold/15 opacity-60 animate-orbit-cw will-change-transform"
        style={{
          transform: `translate3d(0, ${(scrollY * -0.12).toFixed(1)}px, 0)`,
        }}
      >
        <div className="absolute inset-8 border border-dashed border-gold/10 rounded-full" />
        <div className="absolute inset-16 border border-gold/15 rounded-full" />
      </div>

      {/* Parallax Golden Aura Orb 2 (Middle Left) */}
      <div 
        className="absolute top-1/2 -left-28 w-[500px] h-[500px] rounded-full bg-gold/5 blur-[100px] will-change-transform"
        style={{
          transform: `translate3d(0, ${(scrollY * 0.08).toFixed(1)}px, 0)`,
        }}
      />

      {/* Parallax Sacred Crest 3 (Bottom Right) */}
      <div 
        className="absolute bottom-20 -right-24 w-80 h-80 rounded-full border border-gold/20 opacity-40 animate-orbit-ccw will-change-transform"
        style={{
          transform: `translate3d(0, ${(scrollY * -0.06).toFixed(1)}px, 0)`,
        }}
      >
        <div className="absolute inset-10 border border-gold/15 rounded-full" />
      </div>
    </div>
  );
};
