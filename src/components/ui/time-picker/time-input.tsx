
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

/**
 * TimeInput component
 * 
 * A specialized input component for handling time (hours/minutes) entry with built-in
 * validation to ensure only valid numerical input is accepted.
 * 
 * @param value - The current input value (usually hours or minutes)
 * @param onChange - Callback fired when input value changes
 * @param onFocus - Callback fired when input receives focus
 * @param onBlur - Callback fired when input loses focus
 * @param className - Additional CSS classes
 * @param placeholder - Placeholder text shown when no value is entered
 */
export function TimeInput({
  value,
  onChange,
  onFocus,
  onBlur,
  className,
  placeholder = "00"
}: TimeInputProps) {
  /**
   * Handles keydown events to restrict input to valid numerical characters
   * and specific control keys (backspace, delete, tab, escape, enter).
   * 
   * @param e - The keyboard event
   */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Allow: backspace(8), delete(46), tab(9), escape(27), enter(13), period(110)
    if (
      [8, 46, 9, 27, 13, 110].indexOf(e.keyCode) !== -1 ||
      // Allow: numbers 0-9 on main keyboard
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
      inputMode="numeric" // Shows numeric keyboard on mobile devices
      pattern="[0-9]*" // Further restricts input to numbers only
      className={`w-16 text-center ${className}`}
      maxLength={2} // Limit to two digits (00-99)
      placeholder={placeholder}
    />
  );
}
