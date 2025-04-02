
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

// Types for standardization
export interface StatusConfig {
  label: string;
  text: string;
  bg: string;
  borderColor: string;
  iconName: keyof typeof statusIcons;
}

export type StatusMapType = Record<string, StatusConfig>;

// Colors defined according to the visual identity
const colors = {
  azulClaro: {
    text: 'text-blue-700',
    bg: 'bg-blue-50',
    borderColor: 'border-blue-200'
  },
  azulMedio: {
    text: 'text-blue-800',
    bg: 'bg-blue-100',
    borderColor: 'border-blue-300'
  },
  azulEscuro: {
    text: 'text-blue-900',
    bg: 'bg-blue-200',
    borderColor: 'border-blue-400'
  },
  laranja: {
    text: 'text-orange-700',
    bg: 'bg-orange-50',
    borderColor: 'border-orange-200'
  },
  cinzaClaro: {
    text: 'text-gray-500',
    bg: 'bg-gray-50',
    borderColor: 'border-gray-200'
  },
  cinzaMedio: {
    text: 'text-gray-600',
    bg: 'bg-gray-100',
    borderColor: 'border-gray-300'
  },
  cinzaEscuro: {
    text: 'text-gray-700',
    bg: 'bg-gray-200',
    borderColor: 'border-gray-400'
  }
};

// Mapping of lucide-react icons (used instead of emojis for better integration)
export const statusIcons = {
  // Demands
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
  
  // Notes
  FileClock,
  CheckCircle2: CheckCircle,
  AlertTriangle,
  Trash,
  Send
};

// Mapping demand statuses to UI labels
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

// Mapping note statuses to UI labels
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

// Utility function to get config for a demand status
export const getDemandaStatusConfig = (status: string): StatusConfig => {
  return demandaStatusMap[status] || {
    label: status.charAt(0).toUpperCase() + status.slice(1),
    ...colors.cinzaClaro,
    iconName: 'Clock'
  };
};

// Utility function to get config for a note status
export const getNotaStatusConfig = (status: string): StatusConfig => {
  return notaStatusMap[status] || {
    label: status.charAt(0).toUpperCase() + status.slice(1),
    ...colors.cinzaClaro,
    iconName: 'FileText'
  };
};
