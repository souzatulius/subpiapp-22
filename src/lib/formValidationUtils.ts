
import { DemandFormData } from '@/hooks/demandForm/types';

export interface ValidationError {
  field: string;
  message: string;
}

export const validateDemandForm = (formData: any, activeStep: number): ValidationError[] => {
  const errors: ValidationError[] = [];
  
  // Step 0: Identification
  if (activeStep === 0) {
    if (!formData.titulo || formData.titulo.trim() === '') {
      errors.push({
        field: 'titulo',
        message: 'O título da demanda é obrigatório'
      });
    }
    
    if (!formData.problema_id) {
      errors.push({
        field: 'problema_id',
        message: 'Selecione um tema'
      });
    }
    
    if (!formData.servico_id) {
      errors.push({
        field: 'servico_id',
        message: 'Selecione um serviço'
      });
    }
  }
  
  // Step 1: Classification and Origin
  else if (activeStep === 1) {
    if (!formData.origem_id) {
      errors.push({
        field: 'origem_id',
        message: 'Selecione a origem da demanda'
      });
    }
  }
  
  // Step 2: Requester Info
  else if (activeStep === 2) {
    if (!formData.nome_solicitante || formData.nome_solicitante.trim() === '') {
      errors.push({
        field: 'nome_solicitante',
        message: 'O nome do solicitante é obrigatório'
      });
    }
    
    if (formData.email_solicitante && !validateEmail(formData.email_solicitante)) {
      errors.push({
        field: 'email_solicitante',
        message: 'E-mail inválido'
      });
    }
  }
  
  // Step 3: Location
  // No required fields for now
  
  // Step 4: Questions and Details
  // No required fields for now
  
  // Step 5: Priority and Deadline
  else if (activeStep === 5) {
    if (!formData.prioridade) {
      errors.push({
        field: 'prioridade',
        message: 'Selecione a prioridade da demanda'
      });
    }
  }
  
  return errors;
};

export const getFieldErrorMessage = (field: string, errors: ValidationError[]): string | null => {
  const error = errors.find(err => err.field === field);
  return error ? error.message : null;
};

export const hasFieldError = (field: string, errors: ValidationError[]): boolean => {
  return errors.some(err => err.field === field);
};

function validateEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}
