
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
    perguntas: string[] | null;
    arquivo_url: string | null;
    supervisao_tecnica_id: string | null;
    origem_id: string | null;
    tipo_midia_id: string | null;
    bairro_id: string | null;
    autor_id: string | null;
    areas_coordenacao: {
        id: string;
        descricao: string;
    } | null;
    origens_demandas?: {
        descricao: string;
    };
    tipos_midia?: {
        descricao: string;
    };
}

export interface Resposta {
    texto: string;
    respostas?: { [key: string]: string };
}

export interface Area {
    id: string;
    descricao: string;
}

export interface ResponderDemandaFormProps {
    onClose: () => void;
}

export type ViewMode = 'list' | 'cards';
