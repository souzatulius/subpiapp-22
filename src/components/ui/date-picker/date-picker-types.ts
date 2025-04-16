
/**
 * Types for the DatePicker component
 */

export interface DatePickerProps {
  /** The currently selected date */
  date?: Date;
  /** Callback function when a date is selected */
  onSelect: (date?: Date) => void;
  /** Placeholder text when no date is selected */
  placeholder?: string;
  /** Additional CSS class names */
  className?: string;
  /** Whether to show time selection controls */
  showTimeSelect?: boolean;
  /** Whether to use dropdown selectors for time instead of text inputs */
  useDropdownTimeSelect?: boolean;
}

export interface TimeInputProps {
  value: string;
  onChange: (value: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
}

export interface TimeDropdownProps {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  label: string;
}

