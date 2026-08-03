import React from 'react';

interface SmsGroupLogoProps {
  height?: number;
  textColor?: string;
  className?: string;
}

export const SmsGroupLogo: React.FC<SmsGroupLogoProps> = ({ 
  height = 36, 
  textColor = 'currentColor',
  className = '' 
}) => {
  const width = Math.round(height * (220 / 48));

  return (
    <svg 
      width={width} 
      height={height} 
      viewBox="0 0 220 48" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ display: 'inline-block', verticalAlign: 'middle' }}
    >
      {/* SMS Text */}
      <text 
        x="0" 
        y="35" 
        fill={textColor} 
        fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" 
        fontWeight="900" 
        fontSize="34" 
        letterSpacing="-0.5px"
      >
        SMS
      </text>

      {/* Target Logo Icon */}
      <g transform="translate(94, 23)">
        {/* Outer Ring - Red (Left) & Blue (Right) */}
        <path 
          d="M 0 -16 A 16 16 0 0 0 0 16" 
          stroke="#E30613" 
          strokeWidth="3.5" 
          fill="none" 
          strokeLinecap="round"
        />
        <path 
          d="M 0 16 A 16 16 0 0 0 0 -16" 
          stroke="#00529C" 
          strokeWidth="3.5" 
          fill="none" 
          strokeLinecap="round"
        />

        {/* Middle Ring - Blue (Left) & Red (Right) */}
        <path 
          d="M 0 -9.5 A 9.5 9.5 0 0 0 0 9.5" 
          stroke="#00529C" 
          strokeWidth="3" 
          fill="none" 
          strokeLinecap="round"
        />
        <path 
          d="M 0 9.5 A 9.5 9.5 0 0 0 0 -9.5" 
          stroke="#E30613" 
          strokeWidth="3" 
          fill="none" 
          strokeLinecap="round"
        />

        {/* Center Solid Dot */}
        <circle cx="0" cy="0" r="3.5" fill={textColor} />
      </g>

      {/* group Text */}
      <text 
        x="122" 
        y="35" 
        fill={textColor} 
        fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" 
        fontWeight="800" 
        fontSize="34" 
        letterSpacing="-0.5px"
      >
        group
      </text>
    </svg>
  );
};
