
/**
 * Format a phone number input to match (XX) XXXXX-XXXX pattern
 */
export const formatPhoneNumber = (value: string): string => {
  // Remove all non-digit characters
  const numbers = value.replace(/\D/g, '');
  
  // Apply the mask based on the length of the digits
  if (numbers.length <= 2) {
    return numbers.length ? `(${numbers}` : '';
  } else if (numbers.length <= 7) {
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
  } else {
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
  }
};

/**
 * Format a date input to match DD/MM/YYYY pattern
 */
export const formatDateInput = (value: string): string => {
  // Remove all non-digit characters
  const numbers = value.replace(/\D/g, '');
  
  // Apply the mask based on the length of the digits
  if (numbers.length <= 2) {
    return numbers;
  } else if (numbers.length <= 4) {
    return `${numbers.slice(0, 2)}/${numbers.slice(2)}`;
  } else {
    return `${numbers.slice(0, 2)}/${numbers.slice(2, 4)}/${numbers.slice(4, 8)}`;
  }
};

/**
 * Convert a formatted date string (DD/MM/YYYY) to a Date object
 */
export const parseFormattedDate = (dateString: string): Date | null => {
  if (!dateString) return null;
  
  // Handle multiple formats
  if (dateString.includes('/')) {
    // DD/MM/YYYY format
    const parts = dateString.split('/');
    if (parts.length !== 3) return null;
    
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // Month is 0-indexed in JS Date
    const year = parseInt(parts[2], 10);
    
    if (isNaN(day) || isNaN(month) || isNaN(year)) return null;
    
    const date = new Date(year, month, day);
    
    // Validate the date is valid (e.g., not 31/02/2023)
    if (
      date.getDate() !== day || 
      date.getMonth() !== month || 
      date.getFullYear() !== year
    ) {
      return null;
    }
    
    return date;
  } else if (dateString.includes('-')) {
    // YYYY-MM-DD format (ISO)
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return null;
      return date;
    } catch (e) {
      return null;
    }
  } else {
    // Try direct parsing
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return null;
      return date;
    } catch (e) {
      return null;
    }
  }
};

/**
 * Convert a Date object to formatted string (DD/MM/YYYY)
 */
export const formatDateToString = (date: Date | string | null | undefined): string => {
  if (!date) return '';
  
  try {
    const d = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(d.getTime())) return '';
    
    const day = d.getDate().toString().padStart(2, '0');
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const year = d.getFullYear();
    
    return `${day}/${month}/${year}`;
  } catch (error) {
    console.error('Error formatting date to string:', error);
    return '';
  }
};
