
export interface Demanda {
    id: string;
    titulo: string;
    status: string;
    prioridade: string;
    horario_publicacao: string;
    prazo_resposta: string | null;
    endereco: string | null;
    nome_solicitante: string | null;
    email_solicitante: string | null;
    telefone_solicitante: string | null;
    veiculo_imprensa: string | null;
    detalhes_solicitacao: string | null;
    perguntas: string[] | Record<string, string> | null;
    arquivo_url: string | null;
    supervisao_tecnica_id?: string | null;
    origem_id: string | null;
    tipo_midia_id: string | null;
    bairro_id: string | null;
    autor_id: string | null;
    problema_id: string;
    servico_id?: string | null;
    protocolo?: string | null;
    tema?: {
        id: string;
        descricao: string;
        icone?: string;
    } | null;
    areas_coordenacao?: {
        id: string;
        descricao: string;
    } | null;
    origens_demandas?: {
        id?: string;
        descricao: string;
    };
    tipos_midia?: {
        id?: string;
        descricao: string;
    };
    bairros?: {
        id?: string;
        nome: string;
        distrito_id?: string;
    };
    distrito?: {
        id?: string;
        nome: string;
    };
    coordenacao_id?: string;
    anexos?: string[] | null;
    autor?: {
        id: string;
        nome_completo: string;
    };
    servico?: {
        id: string;
        descricao: string;
    };
    problema?: {
        id: string;
        descricao: string;
        icone?: string;
    };
}

export interface Resposta {
    texto: string;
    respostas?: { [key: string]: string };
    comentarios?: string | null;
}

export interface Area {
    id: string;
    descricao: string;
}

export interface ResponderDemandaFormProps {
    onClose: () => void;
}

export type ViewMode = 'list' | 'cards';
