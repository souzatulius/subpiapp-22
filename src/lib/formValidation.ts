
export const validateEmail = (email: string): boolean => {
  if (!email) return false;
  const pattern = /^[^\s@]+$/;
  return pattern.test(email);
};

export const validatePassword = (password: string): { 
  isValid: boolean;
  min: boolean;
  uppercase: boolean;
  number: boolean;
} => {
  const min = password.length >= 5 && password.length <= 12;
  const uppercase = /[A-Z]/.test(password);
  const number = /[0-9]/.test(password);
  
  return {
    isValid: min && uppercase && number,
    min,
    uppercase,
    number
  };
};

export const validatePasswordsMatch = (password: string, confirmPassword: string): boolean => {
  return password === confirmPassword && password !== '';
};

export const validatePhone = (phone: string): boolean => {
  if (!phone) return false;
  // Remove non-numeric characters for validation
  const numericPhone = phone.replace(/\D/g, '');
  return numericPhone.length >= 10 && numericPhone.length <= 11;
};

export const validateDate = (date: string): boolean => {
  if (!date) return false;
  
  // Simple format validation (DD/MM/YYYY)
  const pattern = /^\d{2}\/\d{2}\/\d{4}$/;
  if (!pattern.test(date)) return false;
  
  // Parse date components
  const [day, month, year] = date.split('/').map(Number);
  
  // Check if date is valid
  const parsedDate = new Date(year, month - 1, day);
  return (
    parsedDate.getDate() === day &&
    parsedDate.getMonth() === month - 1 &&
    parsedDate.getFullYear() === year &&
    year >= 1900 && 
    year <= new Date().getFullYear()
  );
};

export const formatPhone = (value: string): string => {
  const digits = value.replace(/\D/g, '');
  let formatted = '';
  
  if (digits.length <= 2) {
    formatted = `(${digits}`;
  } else if (digits.length <= 7) {
    formatted = `(${digits.substring(0, 2)}) ${digits.substring(2)}`;
  } else {
    formatted = `(${digits.substring(0, 2)}) ${digits.substring(2, 7)}-${digits.substring(7, 11)}`;
  }
  
  return formatted;
};

export const formatDate = (value: string): string => {
  const digits = value.replace(/\D/g, '');
  let formatted = '';
  
  if (digits.length <= 2) {
    formatted = digits;
  } else if (digits.length <= 4) {
    formatted = `${digits.substring(0, 2)}/${digits.substring(2)}`;
  } else {
    formatted = `${digits.substring(0, 2)}/${digits.substring(2, 4)}/${digits.substring(4, 8)}`;
  }
  
  return formatted;
};
