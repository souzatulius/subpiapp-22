
import { 
  Clock, 
  FileText, 
  CheckCircle, 
  AlertTriangle, 
  Archive, 
  Ban, 
  MessageSquare,
  Edit, 
  Search,
  AlarmClock,
  MailCheck,
  FileCheck,
  FileClock,
  FileX,
  Trash,
  Send
} from "lucide-react";

// Tipos para garantir a padronização
export interface StatusConfig {
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
  iconName: keyof typeof statusIcons;
}

export type StatusMapType = Record<string, StatusConfig>;

// Cores definidas conforme a identidade visual
const colors = {
  azulClaro: {
    text: 'text-blue-700',
    bg: 'bg-blue-50',
    border: 'border-blue-200'
  },
  azulMedio: {
    text: 'text-blue-800',
    bg: 'bg-blue-100',
    border: 'border-blue-300'
  },
  azulEscuro: {
    text: 'text-blue-900',
    bg: 'bg-blue-200',
    border: 'border-blue-400'
  },
  laranja: {
    text: 'text-orange-700',
    bg: 'bg-orange-50',
    border: 'border-orange-200'
  },
  cinzaClaro: {
    text: 'text-gray-500',
    bg: 'bg-gray-50',
    border: 'border-gray-200'
  },
  cinzaMedio: {
    text: 'text-gray-600',
    bg: 'bg-gray-100',
    border: 'border-gray-300'
  },
  cinzaEscuro: {
    text: 'text-gray-700',
    bg: 'bg-gray-200',
    border: 'border-gray-400'
  }
};

// Mapeamento dos ícones do lucide-react (usados em vez dos emojis para melhor integração)
export const statusIcons = {
  // Demandas
  Clock,
  Search,
  AlarmClock,
  MailCheck,
  FileText,
  FileCheck,
  CheckCircle,
  Edit,
  FileX,
  Ban,
  Archive,
  
  // Notas
  FileClock,
  CheckCircle2: CheckCircle,
  AlertTriangle,
  Trash,
  Send
};

// Mapeamento dos status de demandas para os rótulos de UI
export const demandaStatusMap: StatusMapType = {
  'pendente': {
    label: 'Nova',
    ...colors.azulClaro,
    iconName: 'Clock'
  },
  'em_andamento': {
    label: 'Em análise',
    ...colors.azulMedio,
    iconName: 'Search'
  },
  'aberta': {
    label: 'Aguardando resposta',
    ...colors.laranja,
    iconName: 'AlarmClock'
  },
  'respondida': {
    label: 'Respondida',
    ...colors.azulEscuro,
    iconName: 'MailCheck'
  },
  'aguardando_nota': {
    label: 'Aguardando nota',
    ...colors.laranja,
    iconName: 'FileText'
  },
  'aguardando_aprovacao': {
    label: 'Nota em aprovação',
    ...colors.laranja,
    iconName: 'FileCheck'
  },
  'concluida': {
    label: 'Finalizada',
    ...colors.cinzaEscuro,
    iconName: 'CheckCircle'
  },
  'concluida_editada': {
    label: 'Finalizada com edição',
    ...colors.cinzaMedio,
    iconName: 'Edit'
  },
  'concluida_recusada': {
    label: 'Finalizada (nota recusada)',
    ...colors.cinzaMedio,
    iconName: 'FileX'
  },
  'cancelada': {
    label: 'Cancelada',
    ...colors.cinzaClaro,
    iconName: 'Ban'
  },
  'arquivada': {
    label: 'Arquivada',
    ...colors.cinzaClaro,
    iconName: 'Archive'
  }
};

// Mapeamento dos status de notas para os rótulos de UI
export const notaStatusMap: StatusMapType = {
  'pendente': {
    label: 'Aguardando aprovação',
    ...colors.laranja,
    iconName: 'FileClock'
  },
  'aprovada': {
    label: 'Aprovada',
    ...colors.azulEscuro,
    iconName: 'CheckCircle'
  },
  'rejeitada': {
    label: 'Recusada',
    ...colors.cinzaMedio,
    iconName: 'AlertTriangle'
  },
  'excluida': {
    label: 'Excluída',
    ...colors.cinzaClaro,
    iconName: 'Trash'
  },
  'concluido': {
    label: 'Publicada',
    ...colors.azulMedio,
    iconName: 'Send'
  }
};

// Função utilitária para obter a configuração de um status de demanda
export const getDemandaStatusConfig = (status: string): StatusConfig => {
  return demandaStatusMap[status] || {
    label: status.charAt(0).toUpperCase() + status.slice(1),
    ...colors.cinzaClaro,
    iconName: 'Clock'
  };
};

// Função utilitária para obter a configuração de um status de nota
export const getNotaStatusConfig = (status: string): StatusConfig => {
  return notaStatusMap[status] || {
    label: status.charAt(0).toUpperCase() + status.slice(1),
    ...colors.cinzaClaro,
    iconName: 'FileText'
  };
};
