
export const formatPriority = (priority: string): string => {
  const priorityMap: Record<string, string> = {
    'alta': 'Alta',
    'media': 'Média',
    'baixa': 'Baixa',
  };

  return priorityMap[priority] || priority;
};

export const getPriorityColor = (priority: string) => {
  const priorityColors: Record<string, { bg: string, text: string, border: string }> = {
    'alta': { 
      bg: 'bg-red-100', 
      text: 'text-red-800', 
      border: 'border-red-200' 
    },
    'media': { 
      bg: 'bg-yellow-100', 
      text: 'text-yellow-800', 
      border: 'border-yellow-200' 
    },
    'baixa': { 
      bg: 'bg-green-100', 
      text: 'text-green-800', 
      border: 'border-green-200' 
    }
  };

  return priorityColors[priority] || { 
    bg: 'bg-gray-100', 
    text: 'text-gray-800', 
    border: 'border-gray-200'
  };
};
