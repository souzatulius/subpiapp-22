
// Definição dos passos do formulário
export const FORM_STEPS = [
  {
    title: "Identificação",
    description: "Selecione o tema, o serviço e informe os detalhes da demanda",
    fields: ["problema_id", "servico_id", "detalhes_solicitacao"]
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

export interface FormContentProps {
  activeStep: number;
  formData: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
  handleServiceSelect: (serviceId: string) => void;
  handlePerguntaChange: (index: number, value: string) => void;
  handleAnexosChange?: (files: string[]) => void;
  areasCoord: any[];
  problemas: any[];
  filteredServicesBySearch: any[];
  serviceSearch: string;
  servicos: any[];
  origens: any[];
  tiposMidia: any[];
  selectedDistrito: string;
  setSelectedDistrito: (distrito: string) => void;
  distritos: any[];
  filteredBairros: any[];
  errors: ValidationError[];
}
