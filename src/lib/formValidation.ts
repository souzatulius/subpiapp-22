
/**
 * Format a phone number to (XX) XXXXX-XXXX pattern
 */
export const formatPhone = (value: string): string => {
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
 * Format a date to DD/MM/YYYY pattern
 */
export const formatDate = (value: string): string => {
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
 * Validate that passwords match
 */
export const validatePasswordsMatch = (password: string, confirmPassword: string): boolean => {
  return password === confirmPassword;
};
