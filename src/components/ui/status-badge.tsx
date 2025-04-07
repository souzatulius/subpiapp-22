
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  FileText, 
  Archive, 
  XCircle,
  CalendarClock,
  Pencil
} from 'lucide-react';

interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md' | 'lg';
}

export const DemandaStatusBadge: React.FC<StatusBadgeProps> = ({ 
  status, 
  size = 'md' 
}) => {
  // Define icon size based on the badge size
  const iconSize = size === 'sm' ? 'h-3 w-3 mr-1' : size === 'lg' ? 'h-5 w-5 mr-2' : 'h-4 w-4 mr-1';
  
  // Define class variants based on status
  const getVariantClass = () => {
    switch (status) {
      case 'pendente':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'em_andamento':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'concluida':
      case 'respondida':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelada':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'arquivada':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'aguardando_nota':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'aguardando_aprovacao':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };
  
  // Get status icon
  const getStatusIcon = () => {
    switch (status) {
      case 'pendente':
        return <Clock className={iconSize} />;
      case 'em_andamento':
        return <AlertCircle className={iconSize} />;
      case 'concluida':
      case 'respondida':
        return <CheckCircle className={iconSize} />;
      case 'cancelada':
        return <XCircle className={iconSize} />;
      case 'arquivada':
        return <Archive className={iconSize} />;
      case 'aguardando_nota':
        return <FileText className={iconSize} />;
      case 'aguardando_aprovacao':
        return <CalendarClock className={iconSize} />;
      default:
        return null;
    }
  };
  
  // Format status text
  const formatStatus = () => {
    switch (status) {
      case 'pendente':
        return 'Pendente';
      case 'em_andamento':
        return 'Em Andamento';
      case 'concluida':
        return 'Concluída';
      case 'respondida':
        return 'Respondida';
      case 'cancelada':
        return 'Cancelada';
      case 'arquivada':
        return 'Arquivada';
      case 'aguardando_nota':
        return 'Aguardando Nota';
      case 'aguardando_aprovacao':
        return 'Aguardando Aprovação';
      default:
        return status;
    }
  };
  
  return (
    <Badge 
      variant="outline" 
      className={`${getVariantClass()} ${size === 'sm' ? 'text-xs py-0 px-2' : size === 'lg' ? 'text-base py-1 px-3' : 'text-sm py-0.5 px-2'} capitalize`}
    >
      {getStatusIcon()}
      {formatStatus()}
    </Badge>
  );
};

export const NotaStatusBadge: React.FC<StatusBadgeProps> = ({ 
  status, 
  size = 'md' 
}) => {
  // Define icon size based on the badge size
  const iconSize = size === 'sm' ? 'h-3 w-3 mr-1' : size === 'lg' ? 'h-5 w-5 mr-2' : 'h-4 w-4 mr-1';
  
  // Define class variants based on status
  const getVariantClass = () => {
    switch (status) {
      case 'pendente':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'aprovada':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejeitada':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'excluida':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };
  
  // Get status icon
  const getStatusIcon = () => {
    switch (status) {
      case 'pendente':
        return <Clock className={iconSize} />;
      case 'aprovada':
        return <CheckCircle className={iconSize} />;
      case 'rejeitada':
        return <XCircle className={iconSize} />;
      case 'excluida':
        return <Archive className={iconSize} />;
      default:
        return null;
    }
  };
  
  // Format status text
  const formatStatus = () => {
    switch (status) {
      case 'pendente':
        return 'Pendente';
      case 'aprovada':
        return 'Aprovada';
      case 'rejeitada':
        return 'Rejeitada';
      case 'excluida':
        return 'Excluída';
      default:
        return status;
    }
  };
  
  return (
    <Badge 
      variant="outline" 
      className={`${getVariantClass()} ${size === 'sm' ? 'text-xs py-0 px-2' : size === 'lg' ? 'text-base py-1 px-3' : 'text-sm py-0.5 px-2'} capitalize`}
    >
      {getStatusIcon()}
      {formatStatus()}
    </Badge>
  );
};
