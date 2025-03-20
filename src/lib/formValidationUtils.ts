
import { DemandFormData } from '@/hooks/demandForm/types';

export interface ValidationError {
  field: string;
  message: string;
}

export const validateDemandForm = (formData: DemandFormData, activeStep: number): ValidationError[] => {
  // All fields are now optional, so we return empty array (no validation errors)
  return [];
};

export const getFieldErrorMessage = (field: string, errors: ValidationError[]): string | null => {
  const error = errors.find(err => err.field === field);
  return error ? error.message : null;
};

export const hasFieldError = (field: string, errors: ValidationError[]): boolean => {
  return errors.some(err => err.field === field);
};
