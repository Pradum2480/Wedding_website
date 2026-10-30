import React from 'react';
import { Sparkles } from 'lucide-react';

interface RoyalDividerProps {
  className?: string;
  theme?: 'gold' | 'maroon' | 'light';
  text?: string;
}

export const RoyalDivider: React.FC<RoyalDividerProps> = ({ 
  className = '', 
  theme = 'gold',
  text 
}) => {
  const strokeColor = theme === 'maroon' ? '#6D1427' : theme === 'light' ? '#FFF8E7' : '#D4AF37';
  const fillColor = theme === 'maroon' ? '#4A0E1B' : theme === 'light' ? '#FFFCF5' : '#D4AF37';

  return (
    <div className={`flex items-center justify-center space-x-3 my-7 ${className}`}>
      {/* Left Shimmer Line */}
      <div className="h-[1.5px] flex-1 max-w-[140px] bg-gradient-to-r from-transparent via-[#D4AF37] to-[#D4AF37] opacity-70" />
      
      {/* Royal Crest / Sacred Diamond Center with Breathing Pulse */}
      <div className="flex items-center space-x-2 text-gold relative">
        <Sparkles className="w-3 h-3 text-gold-deep/60 animate-spin-slow pointer-events-none" />

        <div className="relative flex items-center justify-center">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="transform rotate-45 transition-transform duration-700 hover:rotate-90">
            <rect x="5" y="5" width="14" height="14" stroke={strokeColor} strokeWidth="1.2" fill="none" className="transition-all" />
            <circle cx="12" cy="12" r="3" fill={fillColor} className="aura-pulse" />
          </svg>
        </div>
        
        {text && (
          <span className="font-script text-2xl px-2 text-gold-deep select-none">
            {text}
          </span>
        )}

        <div className="relative flex items-center justify-center">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="transform -rotate-45 transition-transform duration-700 hover:-rotate-90">
            <rect x="5" y="5" width="14" height="14" stroke={strokeColor} strokeWidth="1.2" fill="none" className="transition-all" />
            <circle cx="12" cy="12" r="3" fill={fillColor} className="aura-pulse" />
          </svg>
        </div>

        <Sparkles className="w-3 h-3 text-gold-deep/60 animate-spin-slow pointer-events-none" />
      </div>

      {/* Right Shimmer Line */}
      <div className="h-[1.5px] flex-1 max-w-[140px] bg-gradient-to-l from-transparent via-[#D4AF37] to-[#D4AF37] opacity-70" />
    </div>
  );
};
