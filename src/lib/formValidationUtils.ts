
import { DemandFormData } from '@/hooks/demandForm';

export interface ValidationError {
  field: string;
  message: string;
}

// Mapa de nomes de campos para nomes amigáveis
const fieldNames: Record<string, string> = {
  titulo: "Título da Demanda",
  problema_id: "Tema",
  origem_id: "Origem da Demanda",
  tipo_midia_id: "Tipo de Mídia",
  prioridade: "Prioridade",
  prazo_resposta: "Prazo para Resposta",
  nome_solicitante: "Nome do Solicitante",
  telefone_solicitante: "Telefone do Solicitante",
  email_solicitante: "Email do Solicitante",
  veiculo_imprensa: "Veículo de Imprensa",
  endereco: "Endereço",
  bairro_id: "Bairro",
  detalhes_solicitacao: "Detalhes da Solicitação",
  numero_protocolo_156: "Número do Protocolo",
  servico_id: "Serviço"
};

// Validação por etapa do formulário
const stepValidations: Record<number, string[]> = {
  0: ["origem_id", "prazo_resposta"], // Origem, Protocolo, Prazo
  1: ["tipo_midia_id"], // Mídia, Solicitante (these fields are now optional)
  2: ["problema_id", "detalhes_solicitacao", "bairro_id"], // Tema, Serviço, Detalhes, Localização
  3: ["titulo"], // Título, Perguntas, Anexos
  4: ["titulo", "problema_id", "origem_id", "prazo_resposta", "bairro_id", "detalhes_solicitacao"] // Revisão (campos obrigatórios)
};

export const validateDemandForm = (formData: DemandFormData, step: number): ValidationError[] => {
  const errors: ValidationError[] = [];
  const fieldsToValidate = step === 4 ? 
    // No passo de revisão, validar todos os campos obrigatórios
    stepValidations[4] : 
    // Nos outros passos, validar apenas os campos da etapa atual
    stepValidations[step] || [];

  // Validar origem_id
  if (fieldsToValidate.includes("origem_id") && !formData.origem_id) {
    errors.push({
      field: "origem_id",
      message: "Selecione a origem da demanda"
    });
  }
  
  // Validar prazo_resposta
  if (fieldsToValidate.includes("prazo_resposta") && !formData.prazo_resposta) {
    errors.push({
      field: "prazo_resposta",
      message: "Defina o prazo para resposta"
    });
  }
  
  // Validar tipo_midia_id para origens específicas
  const requiresMediaType = ["Imprensa", "SMSUB", "SECOM"].includes(
    formData.origem_id ? (formData as any).origem?.descricao || "" : ""
  );
  
  if (requiresMediaType && fieldsToValidate.includes("tipo_midia_id") && !formData.tipo_midia_id) {
    errors.push({
      field: "tipo_midia_id",
      message: "Selecione o tipo de mídia"
    });
  }
  
  // Validar veiculo_imprensa quando tipo_midia_id está preenchido
  if (requiresMediaType && formData.tipo_midia_id && fieldsToValidate.includes("veiculo_imprensa") && !formData.veiculo_imprensa) {
    errors.push({
      field: "veiculo_imprensa",
      message: "Informe o veículo de imprensa"
    });
  }
  
  // Validar problema_id
  if (fieldsToValidate.includes("problema_id") && !formData.problema_id) {
    errors.push({
      field: "problema_id",
      message: "Selecione o tema relacionado à demanda"
    });
  }
  
  // Validar servico_id (apenas se problema_id estiver preenchido e o usuário não marcou "Não sei o serviço")
  if (
    fieldsToValidate.includes("servico_id") && 
    formData.problema_id && 
    !formData.servico_id && 
    !formData.nao_sabe_servico
  ) {
    errors.push({
      field: "servico_id",
      message: "Selecione o serviço ou marque 'Não sei o serviço específico'"
    });
  }
  
  // Validar detalhes_solicitacao
  if (fieldsToValidate.includes("detalhes_solicitacao") && !formData.detalhes_solicitacao) {
    errors.push({
      field: "detalhes_solicitacao",
      message: "Descreva os detalhes da solicitação"
    });
  }
  
  // Validar bairro_id
  if (fieldsToValidate.includes("bairro_id") && !formData.bairro_id) {
    errors.push({
      field: "bairro_id",
      message: "Selecione o bairro"
    });
  }
  
  // Validar titulo
  if (fieldsToValidate.includes("titulo") && !formData.titulo) {
    errors.push({
      field: "titulo",
      message: "Informe o título da demanda"
    });
  }
  
  // Validar numero_protocolo_156 se tem_protocolo_156 for true
  if (
    fieldsToValidate.includes("numero_protocolo_156") &&
    formData.tem_protocolo_156 &&
    (!formData.numero_protocolo_156 || formData.numero_protocolo_156.length < 5)
  ) {
    errors.push({
      field: "numero_protocolo_156",
      message: "Informe o número do protocolo 156"
    });
  }

  // Note: nome_solicitante, telefone_solicitante, and email_solicitante are now optional
  // so we removed them from the validation

  return errors;
};

export const hasFieldError = (fieldName: string, errors: ValidationError[]): boolean => {
  return errors.some(error => error.field === fieldName);
};

export const getFieldErrorMessage = (fieldName: string, errors: ValidationError[]): string => {
  const error = errors.find(error => error.field === fieldName);
  return error ? error.message : '';
};

export const getErrorSummary = (errors: ValidationError[]): string => {
  if (errors.length === 0) return '';

  // Transformar a lista de erros em uma lista de campos com nomes amigáveis
  const fieldList = errors.map(error => fieldNames[error.field] || error.field);
  
  // Remover duplicatas
  const uniqueFields = [...new Set(fieldList)];
  
  if (uniqueFields.length > 1) {
    const lastField = uniqueFields.pop();
    return `Os campos obrigatórios não foram preenchidos: ${uniqueFields.join(', ')} e ${lastField}.`;
  } else {
    return `O campo ${uniqueFields[0]} é obrigatório e não foi preenchido.`;
  }
};
