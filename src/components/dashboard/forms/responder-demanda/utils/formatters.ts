
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Return className and text for prioridade formatting
export const formatPrioridade = (prioridade: string) => {
  switch (prioridade.toLowerCase()) {
    case 'alta':
      return { className: "px-2 py-1 rounded-full bg-red-100 text-red-800 text-xs", label: "Alta" };
    case 'média':
    case 'media':
      return { className: "px-2 py-1 rounded-full bg-yellow-100 text-yellow-800 text-xs", label: "Média" };
    case 'baixa':
      return { className: "px-2 py-1 rounded-full bg-green-100 text-green-800 text-xs", label: "Baixa" };
    default:
      return { className: "px-2 py-1 rounded-full bg-gray-100 text-gray-800 text-xs", label: prioridade };
  }
};

// Return className and components for tempo restante
export const calcularTempoRestante = (prazo: string) => {
  const prazoDate = new Date(prazo);
  const agora = new Date();
  const diffMs = prazoDate.getTime() - agora.getTime();
  const diffHoras = Math.floor(diffMs / (1000 * 60 * 60));
  
  if (diffHoras < 0) {
    return { 
      className: "text-red-600 flex items-center", 
      iconName: "AlertCircle",
      iconClassName: "h-3 w-3 mr-1",
      label: "Atrasado" 
    };
  } else if (diffHoras < 24) {
    return { 
      className: "text-orange-600 flex items-center", 
      iconName: "Clock",
      iconClassName: "h-3 w-3 mr-1",
      label: `${diffHoras}h restantes` 
    };
  } else {
    const diffDias = Math.floor(diffHoras / 24);
    return { 
      className: "text-green-600 flex items-center", 
      iconName: "Clock",
      iconClassName: "h-3 w-3 mr-1",
      label: `${diffDias}d restantes` 
    };
  }
};

export const formatarData = (dataString: string) => {
  return format(new Date(dataString), "dd/MM/yyyy 'às' HH:mm", {
    locale: ptBR
  });
};
