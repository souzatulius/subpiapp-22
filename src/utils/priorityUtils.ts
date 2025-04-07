
export const formatPriority = (priority: string): string => {
  const priorityMap: Record<string, string> = {
    'alta': 'Alta',
    'media': 'Média',
    'baixa': 'Baixa',
  };

  return priorityMap[priority] || priority;
};

export const getPriorityColor = (priority: string) => {
  const priorityColors: Record<string, { bg: string, text: string, border: string, hoverBg: string, selectedBg: string }> = {
    'alta': { 
      bg: 'bg-red-100', 
      text: 'text-red-800', 
      border: 'border-red-200',
      hoverBg: 'hover:bg-[#002855]',
      selectedBg: 'bg-orange-500'
    },
    'media': { 
      bg: 'bg-yellow-100', 
      text: 'text-yellow-800', 
      border: 'border-yellow-200',
      hoverBg: 'hover:bg-[#002855]',
      selectedBg: 'bg-orange-500'
    },
    'baixa': { 
      bg: 'bg-green-100', 
      text: 'text-green-800', 
      border: 'border-green-200',
      hoverBg: 'hover:bg-[#002855]',
      selectedBg: 'bg-orange-500'
    }
  };

  return priorityColors[priority] || { 
    bg: 'bg-gray-100', 
    text: 'text-gray-800', 
    border: 'border-gray-200',
    hoverBg: 'hover:bg-[#002855]',
    selectedBg: 'bg-orange-500'
  };
};

// Função auxiliar para uso com botões de toggle de prioridade
export const getPriorityStyles = (priority: string, isSelected: boolean) => {
  const colors = getPriorityColor(priority);
  
  if (isSelected) {
    return 'bg-orange-500 text-white border-none hover:bg-orange-600';
  }
  
  return `${colors.bg} ${colors.text} ${colors.border} ${colors.hoverBg} hover:text-white`;
};
