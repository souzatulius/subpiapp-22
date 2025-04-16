
/**
 * Utility functions for handling time input in the DatePicker component
 */

/**
 * Formats time values to ensure they have leading zeros and are valid
 */
export const formatTimeValue = (value: string, type: 'hours' | 'minutes'): string => {
  if (value === '') {
    return '00';
  }
  
  const numValue = parseInt(value, 10);
  if (isNaN(numValue)) {
    return '00';
  }
  
  const maxValue = type === 'hours' ? 23 : 59;
  const minValue = 0;
  
  // Clamp to valid range
  const clampedValue = Math.max(minValue, Math.min(numValue, maxValue));
  
  // Add leading zero
  return clampedValue.toString().padStart(2, '0');
};

/**
 * Validates time inputs to ensure they're within valid ranges
 */
export const isValidTimeInput = (value: string, type: 'hours' | 'minutes'): boolean => {
  if (value === '') return true;
  
  // Check if it's a valid number
  if (!value.match(/^\d+$/)) return false;
  
  const numValue = parseInt(value, 10);
  
  if (type === 'hours') {
    return numValue >= 0 && numValue <= 23;
  } else {
    return numValue >= 0 && numValue <= 59;
  }
};

/**
 * Creates a new date with updated hours and minutes
 */
export const createDateWithTime = (
  baseDate: Date, 
  hours: string | number, 
  minutes: string | number
): Date => {
  const hoursNum = typeof hours === 'string' ? parseInt(hours, 10) : hours;
  const minutesNum = typeof minutes === 'string' ? parseInt(minutes, 10) : minutes;
  
  // Create a new date object to avoid mutating the original
  const newDate = new Date(baseDate.getTime());
  
  // Only set hours/minutes if they're valid numbers
  if (!isNaN(hoursNum) && !isNaN(minutesNum)) {
    console.log(`createDateWithTime: Setting time to ${hoursNum}:${minutesNum} on date:`, newDate.toISOString());
    newDate.setHours(hoursNum, minutesNum);
    console.log("createDateWithTime: Resulting date:", newDate.toISOString());
  } else {
    console.warn("createDateWithTime: Invalid hours or minutes", { hours, minutes });
  }
  
  return newDate;
};
