
import { ReactNode } from 'react';

export interface Demanda {
  id: string;
  titulo: string;
  status: string;
  prioridade: string;
  prazo_resposta?: string;
  perguntas?: string[] | Record<string, string> | null;
  detalhes_solicitacao?: string;
  areas_coordenacao?: {
    id: string;
    descricao: string;
  } | null;
  origens_demandas?: {
    descricao: string;
  } | null;
  tipos_midia?: {
    descricao: string;
  } | null;
  servicos?: {
    descricao: string;
  } | null;
}

export interface Area {
  id: string;
  descricao: string;
}

export interface ResponderDemandaFormProps {
  onClose: () => void;
}

export type ViewMode = 'list' | 'cards';
