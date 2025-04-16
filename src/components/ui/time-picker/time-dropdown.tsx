
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
  // Local state to ensure we properly track the user's selection
  const [currentValue, setCurrentValue] = React.useState(value);
  
  // Update local state if parent value changes
  React.useEffect(() => {
    if (value !== currentValue) {
      console.log(`TimeDropdown (${label}): Update from parent:`, value);
      setCurrentValue(value);
    }
  }, [value, currentValue, label]);
  
  // Log when the dropdown is rendered with its current value
  React.useEffect(() => {
    console.log(`TimeDropdown (${label}): Rendered with value:`, currentValue);
  }, [currentValue, label]);

  const handleChange = (newValue: string) => {
    console.log(`TimeDropdown (${label}): Value selected:`, newValue);
    setCurrentValue(newValue);
    onChange(newValue);
  };

  return (
    <Select value={currentValue} onValueChange={handleChange}>
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
