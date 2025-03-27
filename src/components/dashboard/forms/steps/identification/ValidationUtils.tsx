
import { ValidationError } from '@/lib/formValidationUtils';

export const hasFieldError = (fieldName: string, errors: ValidationError[] = []) => {
  return errors.some(err => err.field === fieldName);
};

export const getFieldErrorMessage = (fieldName: string, errors: ValidationError[] = []) => {
  const error = errors.find(err => err.field === fieldName);
  return error ? error.message : '';
};
