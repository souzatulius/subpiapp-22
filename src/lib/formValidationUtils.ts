
import { DemandFormData } from '@/hooks/demandForm/types';

export interface ValidationError {
  field: string;
  message: string;
}

export const validateDemandForm = (formData: DemandFormData, activeStep: number): ValidationError[] => {
  const errors: ValidationError[] = [];
  
  // Basic validation based on steps
  switch(activeStep) {
    case 0: // Detalhes da Solicitação
      if (!formData.detalhes_solicitacao?.trim()) {
        errors.push({ field: 'detalhes_solicitacao', message: 'Descreva os detalhes da solicitação' });
      }
      break;
    case 1: // Area and Service step
      if (!formData.area_coordenacao_id) {
        errors.push({ field: 'area_coordenacao_id', message: 'Selecione uma área de coordenação' });
      }
      if (!formData.servico_id) {
        errors.push({ field: 'servico_id', message: 'Selecione um serviço' });
      }
      break;
    case 2: // Origin and Media step
      if (!formData.origem_id) {
        errors.push({ field: 'origem_id', message: 'Selecione uma origem para a demanda' });
      }
      // Only validate tipo_midia_id if origem is Imprensa (assuming it has a specific ID)
      break;
    case 3: // Priority and Deadline step
      if (!formData.prioridade) {
        errors.push({ field: 'prioridade', message: 'Selecione uma prioridade' });
      }
      if (!formData.prazo_resposta) {
        errors.push({ field: 'prazo_resposta', message: 'Defina um prazo para resposta' });
      }
      break;
    case 4: // Requester Info step
      // No mandatory fields in this step typically, but can add if needed
      break;
    case 5: // Location step
      // Add location validation if needed
      break;
    case 6: // Title and Questions step
      if (!formData.titulo?.trim()) {
        errors.push({ field: 'titulo', message: 'Defina um título para a demanda' });
      }
      break;
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
