import React from 'react';

interface ToolbarDividerProps {
  isDarkMode?: boolean;
}

export const ToolbarDivider: React.FC<ToolbarDividerProps> = ({ isDarkMode = false }) => (
  <div 
    className="toolbar-divider"
    style={{ 
      width: '1px', 
      height: '28px', 
      backgroundColor: isDarkMode ? '#4b5563' : '#e2e8f0', 
      margin: '0 6px',
      flexShrink: 0
    }} 
  />
);