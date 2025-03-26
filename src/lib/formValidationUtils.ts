
import { DemandFormData } from '@/hooks/demandForm/types';

export interface ValidationError {
  field: string;
  message: string;
}

export const validateDemandForm = (formData: any, activeStep: number): ValidationError[] => {
  const errors: ValidationError[] = [];
  
  // Only validate on the review step (step 5)
  if (activeStep === 5) {
    // Validate all required fields
    if (!formData.problema_id) {
      errors.push({
        field: 'problema_id',
        message: 'Selecione um tema'
      });
    }

    if (!formData.detalhes_solicitacao || formData.detalhes_solicitacao.trim() === '') {
      errors.push({
        field: 'detalhes_solicitacao',
        message: 'Detalhes da solicitação é obrigatório'
      });
    }

    // Validar campos do protocolo 156
    if (formData.tem_protocolo_156 === true && (!formData.numero_protocolo_156 || formData.numero_protocolo_156.length !== 10)) {
      errors.push({
        field: 'numero_protocolo_156',
        message: 'Digite os 10 dígitos do protocolo 156'
      });
    }
    
    if (!formData.origem_id) {
      errors.push({
        field: 'origem_id',
        message: 'Selecione a origem da demanda'
      });
    }

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
    
    if (!formData.bairro_id) {
      errors.push({
        field: 'bairro_id',
        message: 'Selecione o bairro'
      });
    }
    
    if (!formData.prioridade) {
      errors.push({
        field: 'prioridade',
        message: 'Selecione a prioridade da demanda'
      });
    }

    if (!formData.titulo || formData.titulo.trim() === '') {
      errors.push({
        field: 'titulo',
        message: 'O título da demanda é obrigatório'
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

export const getErrorSummary = (errors: ValidationError[]): string => {
  if (errors.length === 0) return '';

  const fieldNames = errors.map(err => {
    switch (err.field) {
      case 'problema_id': return 'Tema';
      case 'detalhes_solicitacao': return 'Detalhes da Solicitação';
      case 'origem_id': return 'Origem da Demanda';
      case 'tipo_midia_id': return 'Tipo de Mídia';
      case 'nome_solicitante': return 'Nome do Solicitante';
      case 'email_solicitante': return 'Email';
      case 'telefone_solicitante': return 'Telefone';
      case 'bairro_id': return 'Bairro';
      case 'prioridade': return 'Prioridade';
      case 'prazo_resposta': return 'Prazo de Resposta';
      case 'titulo': return 'Título';
      case 'numero_protocolo_156': return 'Protocolo 156';
      default: return err.field;
    }
  });

  if (fieldNames.length === 1) {
    return `Preencha o campo obrigatório: ${fieldNames[0]}`;
  } else if (fieldNames.length === 2) {
    return `Preencha os campos obrigatórios: ${fieldNames[0]} e ${fieldNames[1]}`;
  } else {
    const lastField = fieldNames.pop();
    return `Preencha os campos obrigatórios: ${fieldNames.join(', ')} e ${lastField}`;
  }
};
