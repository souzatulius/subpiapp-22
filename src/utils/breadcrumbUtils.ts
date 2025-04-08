/**
 * Utility functions for breadcrumb navigation
 */

// Custom display names for specific paths
export const customRouteNames: Record<string, string> = {
  'cadastrar-release': 'Novo',
  'releases': 'Notícias',
  'cadastrar-demanda': 'Nova',
  'cadastrar': 'Nova',
  'demandas': 'Demandas',
  'consultar-demandas': 'Demandas',
  'criar-nota': 'Nova',
  'aprovar-nota': 'Aprovar Notas',
  'notas': 'Notas',
  'consultar-notas': 'Notas',
  'relatorios': 'Relatórios',
  'ranking-subs': 'Ranking da Zeladoria',
  'dashboard': 'Início',
  'comunicacao': 'Comunicação',
  'settings': 'Configurações',
  'profile': 'Meu Perfil',
  'usuarios': 'Usuários',
  'esic': 'e-SIC',
};

/**
 * Gets a display name for a path segment
 */
export const getDisplayName = (segment: string, fullPath: string): string => {
  // Check if we have a custom name for the full path
  if (customRouteNames[fullPath]) {
    return customRouteNames[fullPath];
  }
  
  // Otherwise use the custom name for the segment or capitalize it
  return customRouteNames[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
};
