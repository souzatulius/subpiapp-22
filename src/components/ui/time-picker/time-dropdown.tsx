
import * as React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TimeDropdownProps {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder?: string;
  label: string;
}

/**
 * TimeDropdown component
 * 
 * A specialized dropdown component for selecting time values (hours or minutes)
 * from a predefined list of options.
 * 
 * @param value - The current selected value
 * @param onChange - Callback fired when the selection changes
 * @param options - Array of options to display in the dropdown
 * @param placeholder - Placeholder text shown when no value is selected
 * @param label - Accessibility label for the dropdown
 */
export function TimeDropdown({
  value,
  onChange,
  options,
  placeholder = "00",
  label
}: TimeDropdownProps) {
  // Log whenever the value changes or is set
  React.useEffect(() => {
    console.log(`TimeDropdown (${label}): Current value:`, value);
  }, [value, label]);

  const handleChange = (newValue: string) => {
    console.log(`TimeDropdown (${label}): Value selected:`, newValue);
    onChange(newValue);
  };

  return (
    <Select value={value} onValueChange={handleChange}>
      <SelectTrigger 
        className="w-16 text-center" 
        aria-label={label}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map(option => (
          <SelectItem key={option} value={option}>
            {option}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
