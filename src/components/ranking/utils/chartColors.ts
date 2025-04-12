
// Custom color palette for charts based on requirements
export const chartColors = {
  blue: '#095dff',      // Azul 
  green: '#01e30e',     // Verde
  lightGray: '#f4f4f4', // Cinza claro
  darkOrange: '#ea580d', // Laranja escuro
  mediumOrange: '#f4a100', // Laranja médio
  mediumBlue: '#174ba9',  // Azul médio
  darkBlue: '#051b2c',   // Azul escuro
};

// Color arrays for different chart types
export const barChartColors = [
  '#0066FF', // Blue
  '#F97316', // Orange
  '#10B981', // Green
  '#6366F1', // Indigo
  '#EC4899', // Pink
];

export const pieChartColors = [
  '#0066FF', // Blue
  '#F97316', // Orange
  '#10B981', // Green
  '#6366F1', // Indigo
  '#EC4899', // Pink
  '#8B5CF6', // Purple
  '#F59E0B', // Amber
  '#EF4444', // Red
  '#64748B', // Slate
  '#0EA5E9', // Sky
];

// Adding line chart colors
export const lineChartColors = [
  '#0066FF', // Blue
  '#F97316', // Orange
  '#10B981', // Green
  '#6366F1', // Indigo
  '#EC4899', // Pink
];

// Function to get colors with opacity
export const getColorWithOpacity = (color: string, opacity: number): string => {
  // Convert hex to rgba
  if (color.startsWith('#')) {
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }
  return color;
};

// Helper for service classification mapping
export const servicoMapeado: Record<string, { grupo: string; responsavel: string }> = {
  // 🌳 Poda e Remoção de Árvores
  "poda remocao arvores": { grupo: "Poda Remoção Árvores", responsavel: "subprefeitura" },
  "poda remocao manejo arvore": { grupo: "Poda Remoção Árvores", responsavel: "subprefeitura" },
  "poda arvore enel": { grupo: "Poda Remoção Árvores", responsavel: "enel" },
  "remocao arvore enel": { grupo: "Poda Remoção Árvores", responsavel: "enel" },
  "poda de árvores": { grupo: "Poda Remoção Árvores", responsavel: "subprefeitura" },
  "corte de árvores": { grupo: "Poda Remoção Árvores", responsavel: "subprefeitura" },

  // 🕳️ Tapa-Buraco
  "tapa buraco": { grupo: "Tapa Buraco", responsavel: "dzu" },
  "tapa-buraco": { grupo: "Tapa Buraco", responsavel: "dzu" },
  "tapa-buraco sabesp": { grupo: "Tapa Buraco", responsavel: "sabesp" },
  "tapa-buraco pavimento": { grupo: "Tapa Buraco", responsavel: "dzu" },

  // 🧹 Limpeza de Córregos e Bocas de Lobo
  "limpeza de córregos": { grupo: "Limpeza de Córregos e Bocas de Lobo", responsavel: "subprefeitura" },
  "limpeza manual de córregos": { grupo: "Limpeza de Córregos e Bocas de Lobo", responsavel: "subprefeitura" },
  "hidrojato (microdrenagem mecanizada)": { grupo: "Limpeza de Córregos e Bocas de Lobo", responsavel: "subprefeitura" },
  "microdrenagem": { grupo: "Limpeza de Córregos e Bocas de Lobo", responsavel: "subprefeitura" },
  "limpeza de boca de lobo": { grupo: "Limpeza de Córregos e Bocas de Lobo", responsavel: "subprefeitura" },
  "limpeza de bueiros selimp": { grupo: "Limpeza de Córregos e Bocas de Lobo", responsavel: "selimp" },

  // 🛠️ Conservação de Galerias
  "conservacao galerias": { grupo: "Conservação de Galerias", responsavel: "subprefeitura" },
  "manutenção conservação galerias": { grupo: "Conservação de Galerias", responsavel: "subprefeitura" },
  "conserto ou troca de boca de lobo": { grupo: "Conservação de Galerias", responsavel: "subprefeitura" },
  "conserto ou troca de grelha": { grupo: "Conservação de Galerias", responsavel: "subprefeitura" },
  "manutenção de galerias sabesp": { grupo: "Conservação de Galerias", responsavel: "sabesp" },
  "galerias sabesp": { grupo: "Conservação de Galerias", responsavel: "sabesp" },

  // 🧱 Conservação de Logradouros
  "conservacao logradouros": { grupo: "Conservação de Logradouros", responsavel: "subprefeitura" },
  "conservacao logradouros publicos": { grupo: "Conservação de Logradouros", responsavel: "subprefeitura" },
  "reforma de guias": { grupo: "Conservação de Logradouros", responsavel: "subprefeitura" },
  "rebaixamento de sarjetas": { grupo: "Conservação de Logradouros", responsavel: "subprefeitura" },
  "rebaixamento de sarjetões": { grupo: "Conservação de Logradouros", responsavel: "subprefeitura" },
  "nivelamento de tampa pv": { grupo: "Conservação de Logradouros", responsavel: "subprefeitura" },

  // 🧽 Limpeza Urbana
  "lavagem e desinfecção de vias públicas pós-feiras livres": { grupo: "Limpeza Urbana", responsavel: "selimp" },
  "capinação em guias e sarjetas selimp": { grupo: "Limpeza Urbana", responsavel: "selimp" },
  "pintura antipichação": { grupo: "Limpeza Urbana", responsavel: "selimp" },
  "cata-bagulho": { grupo: "Limpeza Urbana", responsavel: "selimp" },

  // 🛠️ Manutenção de Equipamentos Urbanos
  "serralheria": { grupo: "Manutenção de Equipamentos Urbanos", responsavel: "subprefeitura" },
  "serralheria manutencao equipamentos": { grupo: "Manutenção de Equipamentos Urbanos", responsavel: "subprefeitura" },
  "reforma de academia da terceira idade": { grupo: "Manutenção de Equipamentos Urbanos", responsavel: "subprefeitura" },
  "conserto de grades ou corrimões": { grupo: "Manutenção de Equipamentos Urbanos", responsavel: "subprefeitura" }
};

// Helper to classify service responsibility
export const getServiceResponsibility = (serviceType: string): string => {
  if (!serviceType) return 'subprefeitura';
  
  const normalizedService = serviceType.toLowerCase().trim();
  
  for (const [key, value] of Object.entries(servicoMapeado)) {
    if (normalizedService.includes(key)) {
      return value.responsavel;
    }
  }
  
  // Default case
  if (normalizedService.includes('enel') || normalizedService.includes('eletropaulo')) {
    return 'enel';
  }
  if (normalizedService.includes('sabesp')) {
    return 'sabesp';
  }
  if (normalizedService.includes('selimp')) {
    return 'selimp';
  }
  if (normalizedService.includes('tapa') && normalizedService.includes('buraco')) {
    return 'dzu';
  }
  
  return 'subprefeitura';
};

// Helper to get service group
export const getServiceGroup = (serviceType: string): string => {
  if (!serviceType) return 'Outros';
  
  const normalizedService = serviceType.toLowerCase().trim();
  
  for (const [key, value] of Object.entries(servicoMapeado)) {
    if (normalizedService.includes(key)) {
      return value.grupo;
    }
  }
  
  // Default categorization
  if (normalizedService.includes('poda') || normalizedService.includes('árvore')) {
    return 'Poda Remoção Árvores';
  }
  if (normalizedService.includes('tapa') && normalizedService.includes('buraco')) {
    return 'Tapa Buraco';
  }
  if (normalizedService.includes('limpeza') && (normalizedService.includes('córrego') || normalizedService.includes('bueiro'))) {
    return 'Limpeza de Córregos e Bocas de Lobo';
  }
  
  return 'Outros';
};
