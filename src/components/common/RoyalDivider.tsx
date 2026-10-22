import React from 'react';

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
    <div className={`flex items-center justify-center space-x-3 my-6 ${className}`}>
      <div className="h-[1px] flex-1 max-w-[120px] bg-gradient-to-r from-transparent via-[#D4AF37] to-[#D4AF37] opacity-60"></div>
      
      {/* Royal Crest / Mandala Center */}
      <div className="flex items-center space-x-2 text-gold">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="transform rotate-45">
          <rect x="5" y="5" width="14" height="14" stroke={strokeColor} strokeWidth="1.2" fill="none"/>
          <circle cx="12" cy="12" r="3" fill={fillColor}/>
        </svg>
        
        {text && (
          <span className="font-script text-xl px-2 text-gold-deep select-none">
            {text}
          </span>
        )}

        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="transform -rotate-45">
          <rect x="5" y="5" width="14" height="14" stroke={strokeColor} strokeWidth="1.2" fill="none"/>
          <circle cx="12" cy="12" r="3" fill={fillColor}/>
        </svg>
      </div>

      <div className="h-[1px] flex-1 max-w-[120px] bg-gradient-to-l from-transparent via-[#D4AF37] to-[#D4AF37] opacity-60"></div>
    </div>
  );
};
