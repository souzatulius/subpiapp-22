
import { AlertCircle, Clock } from 'lucide-react';

export const formatPrioridade = (prioridade: string) => {
  switch (prioridade) {
    case 'alta':
      return {
        label: 'Alta',
        className: 'text-orange-600 font-medium'
      };
    case 'media':
      return {
        label: 'Média',
        className: 'text-yellow-600 font-medium'
      };
    default:
      return {
        label: 'Baixa',
        className: 'text-green-600 font-medium'
      };
  }
};

export const formatarData = (dataString: string) => {
  const data = new Date(dataString);
  return new Intl.DateTimeFormat('pt-BR').format(data);
};

export const calcularTempoRestante = (prazoResposta: string) => {
  const diffTime = new Date(prazoResposta).getTime() - new Date().getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) {
    return {
      label: `Atrasada há ${Math.abs(diffDays)} dia(s)`,
      className: 'text-orange-600 font-medium flex items-center gap-1',
      iconName: 'AlertCircle',
      iconClassName: 'text-orange-500'
    };
  } else if (diffDays === 0) {
    return {
      label: 'Vence hoje',
      className: 'text-orange-600 font-medium flex items-center gap-1',
      iconName: 'AlertCircle',
      iconClassName: 'text-orange-500'
    };
  } else if (diffDays <= 2) {
    return {
      label: `Vence em ${diffDays} dia(s)`,
      className: 'text-orange-600 font-medium flex items-center gap-1',
      iconName: 'Clock',
      iconClassName: 'text-orange-500'
    };
  } else {
    return {
      label: `Vence em ${diffDays} dia(s)`,
      className: 'text-green-600 font-medium flex items-center gap-1',
      iconName: 'Clock',
      iconClassName: 'text-green-500'
    };
  }
};
