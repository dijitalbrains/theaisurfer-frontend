import React from 'react';
import { Waves } from 'lucide-react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ size = 'md', showText = true }) => {
  const sizes = {
    sm: { icon: 'w-6 h-6', text: 'text-lg' },
    md: { icon: 'w-10 h-10', text: 'text-2xl' },
    lg: { icon: 'w-16 h-16', text: 'text-4xl' },
  };

  return (
    <div className="flex items-center gap-3">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-primary rounded-xl blur-lg opacity-50 animate-glow" />
        <div className="relative bg-gradient-primary rounded-xl p-2">
          <Waves className={`${sizes[size].icon} text-white`} />
        </div>
      </div>
      {showText && (
        <span className={`${sizes[size].text} font-bold text-gradient-primary`}>
          theaisurfer
        </span>
      )}
    </div>
  );
};
