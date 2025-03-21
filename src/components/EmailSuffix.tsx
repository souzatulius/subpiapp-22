
import React, { useState, useRef, useEffect } from 'react';

interface EmailSuffixProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  suffix: string;
  error?: boolean;
  placeholder?: string;
  className?: string;
}

const EmailSuffix: React.FC<EmailSuffixProps> = ({
  id,
  value,
  onChange,
  suffix,
  error = false,
  placeholder = '',
  className = ''
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Handle outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const borderColor = error 
    ? 'border-subpi-orange' 
    : isFocused 
      ? 'border-subpi-orange' 
      : isHovered 
        ? 'border-gray-400' 
        : 'border-gray-300';

  return (
    <div 
      className={`flex w-full overflow-hidden ${borderColor} transition-colors ${className}`} 
      onClick={() => {
        setIsFocused(true);
        inputRef.current?.focus();
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <input 
        id={id} 
        ref={inputRef} 
        type="text" 
        value={value} 
        onChange={handleChange} 
        onFocus={() => setIsFocused(true)} 
        placeholder="usuario" 
        className={`px-4 py-2 w-full border ${isHovered && !isFocused ? 'border-gray-400' : 'border-gray-300'} rounded-l-xl focus:outline-none focus:ring-2 focus:ring-[#003570] focus:border-transparent transition-all duration-200`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)} 
      />
      <div 
        className={`bg-gray-100 w-full px-4 py-2 border ${isHovered && !isFocused ? 'border-gray-400' : 'border-gray-300'} rounded-r-xl focus:outline-none focus:ring-2 focus:ring-[#003570] focus:border-transparent transition-all duration-200 pr-1`}
      >
        {suffix}
      </div>
    </div>
  );
};

export default EmailSuffix;
