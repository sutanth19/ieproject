import React, { useState } from 'react';

interface ToolbarButtonProps {
  onClick: () => void;
  disabled?: boolean;
  active?: boolean;
  children: React.ReactNode;
  title?: string;
  size?: 'small' | 'medium';
  isDarkMode?: boolean;
  className?: string;
}

export const ToolbarButton: React.FC<ToolbarButtonProps> = ({
  onClick,
  disabled = false,
  active = false,
  children,
  title,
  size = 'small',
  isDarkMode = false,
  className = '',
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const getButtonStyles = () => {
    const baseStyles: React.CSSProperties = {
      padding: size === 'small' ? '8px' : '10px',
      border: 'none',
      borderRadius: '6px',
      cursor: disabled ? 'not-allowed' : 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.15s ease',
      opacity: disabled ? 0.4 : 1,
      minWidth: size === 'small' ? '36px' : '40px',
      height: size === 'small' ? '36px' : '40px',
      position: 'relative',
      userSelect: 'none',
    };

    if (disabled) {
      return {
        ...baseStyles,
        backgroundColor: 'transparent',
        color: isDarkMode ? 'rgba(248, 248, 248, 0.3)' : 'rgba(75, 85, 99, 0.3)',
        cursor: 'not-allowed',
      };
    }

    if (active) {
      return {
        ...baseStyles,
        backgroundColor: '#46BFE8',
        color: 'white',
        boxShadow: '0 2px 4px rgba(70, 191, 232, 0.3)',
      };
    }

    if (isHovered && !disabled) {
      return {
        ...baseStyles,
        backgroundColor: isDarkMode 
          ? 'rgba(70, 191, 232, 0.15)' 
          : 'rgba(70, 191, 232, 0.08)',
        color: '#46BFE8',
      };
    }

    return {
      ...baseStyles,
      backgroundColor: 'transparent',
      color: isDarkMode ? '#f8f8f8' : '#4b5563',
    };
  };

  const handleClick = () => {
    if (!disabled) {
      onClick();
    }
  };

  return (
    <button
      className={`toolbar-button ${className}`}
      onClick={handleClick}
      disabled={disabled}
      title={title}
      style={getButtonStyles()}
      onMouseEnter={() => !disabled && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
    </button>
  );
};