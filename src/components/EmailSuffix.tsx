
import React, { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';
import { cn } from "@/lib/utils";

interface EmailSuffixProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  suffix?: string;
  error?: boolean;
  className?: string;
  registerField?: UseFormRegisterReturn;
  hideSuffix?: boolean;
}

const EmailSuffix: React.FC<EmailSuffixProps> = ({
  id,
  value,
  onChange,
  suffix = "@smsub.prefeitura.sp.gov.br",
  error = false,
  className = '',
  registerField,
  hideSuffix = false
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showSuffix, setShowSuffix] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Show suffix when user starts typing
  useEffect(() => {
    setShowSuffix(value.length > 0 && !hideSuffix);
  }, [value, hideSuffix]);

  // Clean the input value to ensure no suffix is included
  useEffect(() => {
    if (value && value.includes('@')) {
      const username = value.split('@')[0];
      if (username !== value) {
        onChange(username);
      }
    }
  }, [value, onChange]);

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
    const inputValue = e.target.value;
    // Clean any @ or domain that might have been pasted
    const cleanedValue = inputValue.split('@')[0];
    onChange(cleanedValue);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    // Prevent cursor from going beyond the end of the user input
    if (e.key === "ArrowRight") {
      const input = inputRef.current;
      if (input) {
        const selectionStart = input.selectionStart || 0;
        if (selectionStart >= value.length) {
          e.preventDefault();
        }
      }
    }
  };

  // Style classes for the container
  const containerBorderColor = error 
    ? 'border-[#f57b35]' 
    : isFocused
      ? 'border-transparent ring-2 ring-[#003570]'
      : isHovered
        ? 'border-gray-600' 
        : 'border-gray-300';

  return (
    <div 
      className={cn(
        `relative flex h-12 w-full rounded-xl border ${containerBorderColor} bg-white shadow-sm transition-all duration-300`,
        className
      )}
      onClick={() => {
        setIsFocused(true);
        inputRef.current?.focus();
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative flex-grow">
        <input 
          id={id} 
          ref={inputRef} 
          type="text" 
          value={value} 
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)} 
          className="h-full w-full border-0 bg-transparent px-4 py-3 text-base focus:outline-none focus:ring-0"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          placeholder="Digite apenas o usuário (sem @smsub...)"
          {...registerField}
        />
        {showSuffix && (
          <span 
            className="pointer-events-none absolute top-1/2 transform -translate-y-1/2 text-base text-gray-500"
            style={{ 
              left: `calc(${4 + value.length * 0.6}em)`,
              transition: 'left 0.1s ease-out',
            }}
          >
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
};

export default EmailSuffix;
