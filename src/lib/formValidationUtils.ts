
import { DemandFormData } from '@/hooks/demandForm/types';

export interface ValidationError {
  field: string;
  message: string;
}

export const validateDemandForm = (formData: DemandFormData, activeStep: number): ValidationError[] => {
  const errors: ValidationError[] = [];
  
  // Step 0: Identification validation
  if (activeStep === 0 || activeStep === 5) {
    if (!formData.titulo) {
      errors.push({ field: 'titulo', message: 'Título é obrigatório' });
    }
    if (!formData.area_coordenacao_id) {
      errors.push({ field: 'area_coordenacao_id', message: 'Área de Coordenação é obrigatória' });
    }
    if (!formData.servico_id) {
      errors.push({ field: 'servico_id', message: 'Serviço é obrigatório' });
    }
  }
  
  // Step 1: Origin and Classification validation
  if (activeStep === 1 || activeStep === 5) {
    if (!formData.origem_id) {
      errors.push({ field: 'origem_id', message: 'Origem da Demanda é obrigatória' });
    }
    if (!formData.tipo_midia_id) {
      errors.push({ field: 'tipo_midia_id', message: 'Tipo de Mídia é obrigatório' });
    }
  }
  
  // Step 2: Priority and Deadline validation
  if (activeStep === 2 || activeStep === 5) {
    if (!formData.prioridade) {
      errors.push({ field: 'prioridade', message: 'Prioridade é obrigatória' });
    }
    if (!formData.prazo_resposta) {
      errors.push({ field: 'prazo_resposta', message: 'Prazo para Resposta é obrigatório' });
    }
  }
  
  // Step 4: Location validation
  if (activeStep === 4 || activeStep === 5) {
    if (!formData.bairro_id) {
      errors.push({ field: 'bairro_id', message: 'Bairro é obrigatório' });
    }
  }
  
  // Step 5: Questions and Details validation
  if (activeStep === 5) {
    if (!formData.detalhes_solicitacao) {
      errors.push({ field: 'detalhes_solicitacao', message: 'Detalhes da Solicitação são obrigatórios' });
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
