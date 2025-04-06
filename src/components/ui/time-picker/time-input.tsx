
import * as React from "react";
import { Input } from "@/components/ui/input";

interface TimeInputProps {
  value: string;
  onChange: (value: string) => void;
  onFocus: () => void;
  onBlur: () => void;
  className?: string;
  placeholder?: string;
}

export function TimeInput({
  value,
  onChange,
  onFocus,
  onBlur,
  className,
  placeholder = "00"
}: TimeInputProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Allow: backspace, delete, tab, escape, enter, and numbers
    if (
      [8, 46, 9, 27, 13, 110].indexOf(e.keyCode) !== -1 ||
      // Allow: numbers 0-9
      (e.keyCode >= 48 && e.keyCode <= 57) ||
      // Allow: numpad numbers 0-9
      (e.keyCode >= 96 && e.keyCode <= 105)
    ) {
      // Input is valid, do nothing
      return;
    }
    // Prevent any other input
    e.preventDefault();
  };
  
  return (
    <Input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onFocus={onFocus}
      onBlur={onBlur}
      onKeyDown={handleKeyDown}
      inputMode="numeric"
      pattern="[0-9]*"
      className={`w-16 text-center ${className}`}
      maxLength={2}
      placeholder={placeholder}
    />
  );
}
