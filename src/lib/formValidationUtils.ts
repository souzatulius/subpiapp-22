
import { DemandFormData } from '@/hooks/demandForm/types';

export interface ValidationError {
  field: string;
  message: string;
}

export const validateDemandForm = (formData: DemandFormData, activeStep: number): ValidationError[] => {
  const errors: ValidationError[] = [];
  
  // Validate based on steps
  switch(activeStep) {
    case 0: // Problema e Serviço
      if (!formData.problema_id) {
        errors.push({ field: 'problema_id', message: 'Selecione um problema' });
      }
      if (!formData.servico_id) {
        errors.push({ field: 'servico_id', message: 'Selecione um serviço' });
      }
      if (!formData.detalhes_solicitacao?.trim()) {
        errors.push({ field: 'detalhes_solicitacao', message: 'Descreva os detalhes da solicitação' });
      }
      break;
    case 1: // Origem da Demanda
      if (!formData.origem_id) {
        errors.push({ field: 'origem_id', message: 'Selecione uma origem para a demanda' });
      }
      // Validate tipo_midia_id and veiculo_imprensa based on origem_id
      // Add your specific validation logic here
      break;
    case 2: // Requester Info
      // Add validation for requester info if needed
      break;
    case 3: // Location
      if (!formData.endereco?.trim()) {
        errors.push({ field: 'endereco', message: 'Informe o endereço' });
      }
      if (!formData.bairro_id) {
        errors.push({ field: 'bairro_id', message: 'Selecione um bairro' });
      }
      break;
    case 4: // Priority and Deadline
      if (!formData.prioridade) {
        errors.push({ field: 'prioridade', message: 'Selecione uma prioridade' });
      }
      if (!formData.prazo_resposta) {
        errors.push({ field: 'prazo_resposta', message: 'Defina um prazo para resposta' });
      }
      break;
    case 5: // Title and Questions
      if (!formData.titulo?.trim()) {
        errors.push({ field: 'titulo', message: 'Defina um título para a demanda' });
      }
      // At least one question is required
      if (formData.perguntas.every(p => !p.trim())) {
        errors.push({ field: 'perguntas', message: 'Adicione pelo menos uma pergunta' });
      }
      break;
    case 6: // File Upload
      // File upload is optional
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
