
// Definição dos passos do formulário
export const FORM_STEPS = [
  {
    title: "Identificação",
    description: "Selecione o tema e informe os detalhes da demanda",
    fields: ["problema_id", "detalhes_solicitacao", "tem_protocolo_156", "numero_protocolo_156"]
  },
  {
    title: "Classificação e Origem",
    description: "Informe a origem e tipo de mídia da demanda",
    fields: ["origem_id", "tipo_midia_id"]
  },
  {
    title: "Dados do Solicitante",
    description: "Preencha os dados de contato do solicitante",
    fields: ["nome_solicitante", "telefone_solicitante", "email_solicitante", "veiculo_imprensa"]
  },
  {
    title: "Localização",
    description: "Informe a localização da demanda",
    fields: ["endereco", "bairro_id"]
  },
  {
    title: "Perguntas e Anexos",
    description: "Adicione perguntas para a área técnica e anexos",
    fields: ["perguntas", "anexos"]
  },
  {
    title: "Prioridade e Prazo",
    description: "Defina a prioridade e prazo para resposta",
    fields: ["prioridade", "prazo_resposta"]
  },
  {
    title: "Revisão",
    description: "Revise os dados informados antes de cadastrar",
    fields: ["titulo"]
  }
];

// Importação explícita do tipo ValidationError
import { ValidationError } from '@/lib/formValidationUtils';

export interface FormContentProps {
  activeStep: number;
  formData: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (name: string, value: string | boolean) => void;
  handlePerguntaChange: (index: number, value: string) => void;
  handleAnexosChange?: (files: string[]) => void;
  areasCoord: any[];
  problemas: any[];
  serviceSearch: string;
  origens: any[];
  tiposMidia: any[];
  selectedDistrito: string;
  setSelectedDistrito: (distrito: string) => void;
  distritos: any[];
  filteredBairros: any[];
  errors: ValidationError[];
}
