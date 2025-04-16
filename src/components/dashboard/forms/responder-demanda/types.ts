
export interface Demanda {
  id: string;
  titulo: string;
  detalhes_solicitacao?: string;
  resumo_situacao?: string; // Added field for resumo
  prazo_resposta?: string;
  prioridade: string;
  perguntas?: Record<string, string>;
  status: string;
  horario_publicacao: string;
  endereco?: string;
  nome_solicitante?: string;
  email_solicitante?: string;
  telefone_solicitante?: string;
  veiculo_imprensa?: string;
  arquivo_url?: string;
  anexos?: string[];
  coordenacao_id?: string;
  coordenacao?: {
    id?: string;
    descricao: string;
    sigla?: string;
  };
  supervisao_tecnica_id?: string;
  bairro_id?: string;
  autor_id?: string;
  tipo_midia_id?: string;
  origem_id?: string;
  problema_id?: string;
  servico_id?: string;
  protocolo?: string;
  tema?: {
    id: string;
    descricao: string;
    icone?: string;
    coordenacao?: {
      id?: string;
      descricao: string;
      sigla?: string;
    }
  };
  areas_coordenacao?: any;
  origens_demandas?: {
    id: string;
    descricao: string;
  };
  tipos_midia?: {
    id: string; 
    descricao: string;
  };
  bairros?: {
    id: string;
    nome: string;
    distritos?: {
      id: string;
      nome: string;
    }
  };
  distrito?: {
    id: string;
    nome: string;
  };
  autor?: {
    id: string;
    nome_completo: string;
  };
  servico?: {
    id?: string;
    descricao: string;
  };
  problema?: {
    id?: string;
    descricao?: string;
    coordenacao?: {
      id?: string;
      descricao?: string;
      sigla?: string;
    }
  };
}
