import React from 'react';

interface GradientTextProps {
  text: string;
  className?: string;
}

const GradientText: React.FC<GradientTextProps> = ({ text, className = '' }) => {
  return (
    <span className={`bg-clip-text text-transparent bg-gradient-to-r from-solana-purple to-solana-green ${className}`}>
      {text}
    </span>
  );
};

export default GradientText;
