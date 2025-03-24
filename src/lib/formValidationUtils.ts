
import { DemandFormData } from '@/hooks/demandForm/types';

export interface ValidationError {
  field: string;
  message: string;
}

export const validateDemandForm = (formData: DemandFormData, activeStep: number): ValidationError[] => {
  const errors: ValidationError[] = [];
  
  // Basic validation based on steps
  switch(activeStep) {
    case 0: // Area and Service step
      if (!formData.area_coordenacao_id) {
        errors.push({ field: 'area_coordenacao_id', message: 'Selecione uma área de coordenação' });
      }
      if (!formData.servico_id) {
        errors.push({ field: 'servico_id', message: 'Selecione um serviço' });
      }
      break;
    case 1: // Origin and Media step
      if (!formData.origem_id) {
        errors.push({ field: 'origem_id', message: 'Selecione uma origem para a demanda' });
      }
      // Only validate tipo_midia_id if origem is Imprensa
      break;
    case 2: // Priority and Deadline step
      if (!formData.prioridade) {
        errors.push({ field: 'prioridade', message: 'Selecione uma prioridade' });
      }
      if (!formData.prazo_resposta) {
        errors.push({ field: 'prazo_resposta', message: 'Defina um prazo para resposta' });
      }
      break;
    // Add more validations for other steps if needed
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
