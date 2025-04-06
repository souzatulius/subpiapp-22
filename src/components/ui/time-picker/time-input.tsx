
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
  return (
    <Input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onFocus={onFocus}
      onBlur={onBlur}
      className={`w-16 text-center ${className}`}
      maxLength={2}
      placeholder={placeholder}
    />
  );
}
