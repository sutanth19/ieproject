import React, { useState } from 'react';

interface ToolbarDropdownProps {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  isDarkMode?: boolean;
  width?: string;
  title?: string;
}

export const ToolbarDropdown: React.FC<ToolbarDropdownProps> = ({ 
  value, 
  onChange, 
  options, 
  isDarkMode = false, 
  width = '120px', 
  title 
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const getSelectStyles = (): React.CSSProperties => ({
    padding: '6px 10px',
    border: `1px solid ${isFocused ? '#46BFE8' : (isDarkMode ? '#4b5563' : '#cbd5e1')}`,
    borderRadius: '6px',
    fontSize: '14px',
    backgroundColor: isDarkMode ? '#1e2e4a' : 'white',
    color: isDarkMode ? '#f8f8f8' : '#374151',
    cursor: 'pointer',
    outline: 'none',
    transition: 'border-color 0.2s',
    width,
    minWidth: width,
  });

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={getSelectStyles()}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      title={title}
      className="toolbar-dropdown"
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};