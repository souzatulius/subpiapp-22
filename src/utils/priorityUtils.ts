
export const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'alta':
      return {
        bg: 'bg-red-100',
        text: 'text-red-800',
        border: 'border-red-200'
      };
    case 'media':
      return {
        bg: 'bg-yellow-100',
        text: 'text-yellow-800',
        border: 'border-yellow-200'
      };
    case 'baixa':
      return {
        bg: 'bg-green-100',
        text: 'text-green-800',
        border: 'border-green-200'
      };
    default:
      return {
        bg: 'bg-gray-100',
        text: 'text-gray-800',
        border: 'border-gray-200'
      };
  }
};

export const formatPriority = (priority: string) => {
  switch (priority) {
    case 'alta': return 'Alta';
    case 'media': return 'Média';
    case 'baixa': return 'Baixa';
    default: return priority.charAt(0).toUpperCase() + priority.slice(1);
  }
};

export const calcularTempoRestante = (prazoResposta: string) => {
  if (!prazoResposta) return null;
  
  const diffTime = new Date(prazoResposta).getTime() - new Date().getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) {
    return {
      label: `Atrasada há ${Math.abs(diffDays)} dia(s)`,
      className: 'text-red-600 font-medium flex items-center gap-1',
    };
  } else if (diffDays === 0) {
    return {
      label: 'Vence hoje',
      className: 'text-orange-600 font-medium flex items-center gap-1',
    };
  } else {
    // Vence em x dias - azul
    return {
      label: `Vence em ${diffDays} dia(s)`,
      className: 'text-blue-600 font-medium flex items-center gap-1',
    };
  }
};
