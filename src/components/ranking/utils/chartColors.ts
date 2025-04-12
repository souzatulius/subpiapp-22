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
  'rgba(59, 130, 246, 0.7)', // blue-500
  'rgba(249, 115, 22, 0.7)', // orange-500
  'rgba(16, 185, 129, 0.7)', // green-500
  'rgba(244, 63, 94, 0.7)',  // rose-500
  'rgba(168, 85, 247, 0.7)', // purple-500
  'rgba(234, 179, 8, 0.7)',  // yellow-500
  'rgba(14, 165, 233, 0.7)', // sky-500
  'rgba(239, 68, 68, 0.7)',  // red-500
];

export const lineChartColors = [
  'rgba(59, 130, 246, 1)', // blue-500
  'rgba(249, 115, 22, 1)', // orange-500
  'rgba(16, 185, 129, 1)', // green-500
  'rgba(244, 63, 94, 1)',  // rose-500
  'rgba(168, 85, 247, 1)', // purple-500
];

export const pieChartColors = [
  'rgba(59, 130, 246, 0.8)',  // blue-500
  'rgba(249, 115, 22, 0.8)',  // orange-500
  'rgba(16, 185, 129, 0.8)',  // green-500
  'rgba(244, 63, 94, 0.8)',   // rose-500
  'rgba(168, 85, 247, 0.8)',  // purple-500
  'rgba(234, 179, 8, 0.8)',   // yellow-500
  'rgba(14, 165, 233, 0.8)',  // sky-500
  'rgba(239, 68, 68, 0.8)',   // red-500
  'rgba(124, 58, 237, 0.8)',  // violet-500
  'rgba(236, 72, 153, 0.8)',  // pink-500
];

// Function to get colors with opacity
export const getColorWithOpacity = (color: string, opacity: number): string => {
  // If color is in rgba format, extract the components and change opacity
  const rgbaMatch = color.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*[\d.]+\)/);
  if (rgbaMatch) {
    const [, r, g, b] = rgbaMatch;
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }

  // If color is in hex format, convert to rgba
  const hexMatch = color.match(/#([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})/i);
  if (hexMatch) {
    const [, r, g, b] = hexMatch;
    const rInt = parseInt(r, 16);
    const gInt = parseInt(g, 16);
    const bInt = parseInt(b, 16);
    return `rgba(${rInt}, ${gInt}, ${bInt}, ${opacity})`;
  }

  // If color is already in a different format, return it unchanged
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
