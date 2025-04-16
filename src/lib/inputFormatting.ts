
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
  // Remove all non-digit characters except for space and colon (for time)
  const inputChars = value.replace(/[^\d\s:]/g, '');
  
  // Split into date and time parts
  const parts = inputChars.split(' ');
  const dateDigits = parts[0]?.replace(/\D/g, '') || '';
  
  // Format date part
  let formattedDate = '';
  if (dateDigits.length <= 2) {
    formattedDate = dateDigits;
  } else if (dateDigits.length <= 4) {
    formattedDate = `${dateDigits.slice(0, 2)}/${dateDigits.slice(2)}`;
  } else {
    formattedDate = `${dateDigits.slice(0, 2)}/${dateDigits.slice(2, 4)}/${dateDigits.slice(4, 8)}`;
  }
  
  // If we have time parts, add them
  if (parts.length > 1) {
    const timePart = parts[1];
    return `${formattedDate} ${timePart}`;
  }
  
  return formattedDate;
};

/**
 * Convert a formatted date string (DD/MM/YYYY HH:MM) to a Date object
 */
export const parseFormattedDate = (dateString: string): Date | null => {
  if (!dateString) return null;
  
  // Handle multiple formats
  try {
    if (dateString.includes('/')) {
      // DD/MM/YYYY format or DD/MM/YYYY HH:MM format
      const parts = dateString.split(' ');
      const dateParts = parts[0].split('/');
      
      if (dateParts.length !== 3) return null;
      
      const day = parseInt(dateParts[0], 10);
      const month = parseInt(dateParts[1], 10) - 1; // Month is 0-indexed in JS Date
      const year = parseInt(dateParts[2], 10);
      
      if (isNaN(day) || isNaN(month) || isNaN(year)) return null;
      
      // Check if we have time part
      let hours = 0;
      let minutes = 0;
      
      if (parts.length > 1 && parts[1].includes(':')) {
        const timeParts = parts[1].split(':');
        hours = parseInt(timeParts[0], 10);
        minutes = parseInt(timeParts[1], 10);
        
        if (isNaN(hours) || isNaN(minutes)) {
          hours = 0;
          minutes = 0;
        }
      }
      
      const date = new Date(year, month, day, hours, minutes);
      
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
  } catch (e) {
    console.error("Error parsing date:", e);
    return null;
  }
};

/**
 * Convert a Date object to formatted string (DD/MM/YYYY HH:MM)
 */
export const formatDateToString = (date: Date | string | null | undefined): string => {
  if (!date) return '';
  
  try {
    const d = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(d.getTime())) return '';
    
    const day = d.getDate().toString().padStart(2, '0');
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const year = d.getFullYear();
    const hours = d.getHours().toString().padStart(2, '0');
    const minutes = d.getMinutes().toString().padStart(2, '0');
    
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  } catch (error) {
    console.error('Error formatting date to string:', error);
    return '';
  }
};
