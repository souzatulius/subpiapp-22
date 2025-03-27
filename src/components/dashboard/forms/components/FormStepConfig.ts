
// Definição dos passos do formulário
export interface FormStep {
  title: string;
  description?: string; // Make description optional
  fields: string[];
}

export const FORM_STEPS: FormStep[] = [
  {
    title: "Origem e Prazo",
    fields: ["origem_id", "tem_protocolo_156", "numero_protocolo_156", "prazo_resposta"]
  },
  {
    title: "Problema",
    fields: ["problema_id", "servico_id", "nao_sabe_servico"]
  },
  {
    title: "Localização",
    fields: ["endereco", "bairro_id"]
  },
  {
    title: "Organização",
    fields: ["titulo", "perguntas", "anexos"]
  },
  {
    title: "Informações do Solicitante",
    fields: ["tipo_midia_id", "veiculo_imprensa", "nome_solicitante", "telefone_solicitante", "email_solicitante"]
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
  servicos?: any[];
  filteredServicos?: any[];
  handleServiceSearch?: (value: string) => void;
  nextStep?: () => void;
  onNavigateToStep?: (step: number) => void;
}
