import React from 'react';
import { useScrollDirection } from '../../hooks/useScrollDirection';
import { ArrowUp, Sparkles } from 'lucide-react';

export const RoyalScrollProgress: React.FC = () => {
  const { scrollProgress, scrollY, scrollDirection } = useScrollDirection();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* 24K Royal Gold Glowing Progress Thread */}
      <div 
        className="fixed top-0 left-0 right-0 z-50 h-[3px] bg-black/10 pointer-events-none"
        aria-hidden="true"
      >
        <div 
          className="h-full bg-gradient-to-r from-[#B8860B] via-[#D4AF37] to-[#FFF8E7] shadow-[0_0_12px_rgba(212,175,55,0.8)] relative transition-all duration-100 ease-out"
          style={{ width: `${(scrollProgress * 100).toFixed(1)}%` }}
        >
          {/* Leading Diamond Spark Gem */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-2.5 h-2.5 bg-[#FFF8E7] border border-[#D4AF37] rotate-45 shadow-[0_0_8px_#D4AF37] aura-pulse" />
        </div>
      </div>

      {/* Floating Back to Top Button (Appears when scrolled down) */}
      <div 
        className={`fixed bottom-5 right-20 sm:right-24 z-40 transition-all duration-500 ${
          scrollY > 350 ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-6 pointer-events-none'
        }`}
      >
        <button
          onClick={scrollToTop}
          className="w-10 h-10 rounded-full bg-[#FFFDF9]/95 text-maroon border-2 border-gold shadow-gold-glow flex items-center justify-center hover:bg-maroon hover:text-gold transition-all duration-300 hover:scale-110 active:scale-95 group cursor-pointer backdrop-blur-md"
          title="Scroll to Top"
          aria-label="Scroll to Top"
        >
          <ArrowUp className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
        </button>
      </div>
    </>
  );
};
