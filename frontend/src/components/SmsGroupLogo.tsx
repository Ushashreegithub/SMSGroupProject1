import React from 'react';

interface SmsGroupLogoProps {
  height?: number;
  textColor?: string;
  className?: string;
}

export const SmsGroupLogo: React.FC<SmsGroupLogoProps> = ({ 
  height = 32, 
  textColor = '#ffffff',
  className = '' 
}) => {
  const isDarkBg = textColor === '#ffffff' || textColor === 'white';

  if (isDarkBg) {
    return (
      <div 
        className={className}
        style={{ 
          display: 'inline-flex', 
          alignItems: 'center', 
          background: '#ffffff', 
          padding: '4px 10px', 
          borderRadius: '6px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
        }}
      >
        <img 
          src="/sms-group-logo-vector.png" 
          alt="SMS group" 
          style={{ 
            height: `${height}px`, 
            width: 'auto', 
            objectFit: 'contain',
            display: 'block'
          }} 
        />
      </div>
    );
  }

  return (
    <img 
      src="/sms-group-logo-vector.png" 
      alt="SMS group" 
      className={className}
      style={{ 
        height: `${height}px`, 
        width: 'auto', 
        objectFit: 'contain',
        display: 'inline-block', 
        verticalAlign: 'middle' 
      }} 
    />
  );
};
