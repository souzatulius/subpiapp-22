
import { ValidationError } from '@/lib/formValidationUtils';

export const hasFieldError = (field: string, errors: ValidationError[] = []) => {
  return errors.some(err => err.field === field);
};

export const getFieldErrorMessage = (field: string, errors: ValidationError[] = []) => {
  const error = errors.find(err => err.field === field);
  return error ? error.message : '';
};
