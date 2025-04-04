
type BreadcrumbItem = {
  label: string;
  path: string;
};

type BreadcrumbConfig = {
  path: string;
  items: BreadcrumbItem[];
};

// Define custom breadcrumb configurations
export const customBreadcrumbs: BreadcrumbConfig[] = [
  // Releases & Notícias
  {
    path: '/dashboard/comunicacao/releases',
    items: [
      { label: 'Início', path: '/dashboard' },
      { label: 'Comunicação', path: '/dashboard/comunicacao' },
      { label: 'Releases e Notícias', path: '/dashboard/comunicacao/releases' }
    ]
  },
  // Novo Release
  {
    path: '/dashboard/comunicacao/cadastrar-release',
    items: [
      { label: 'Início', path: '/dashboard' },
      { label: 'Comunicação', path: '/dashboard/comunicacao' },
      { label: 'Releases e Notícias', path: '/dashboard/comunicacao/releases' },
      { label: 'Novo Release', path: '/dashboard/comunicacao/cadastrar-release' }
    ]
  },
  // Aprovar Notas
  {
    path: '/dashboard/comunicacao/aprovar-nota',
    items: [
      { label: 'Início', path: '/dashboard' },
      { label: 'Comunicação', path: '/dashboard/comunicacao' },
      { label: 'Notas de Imprensa', path: '/dashboard/comunicacao/notas' },
      { label: 'Aprovar Notas', path: '/dashboard/comunicacao/aprovar-nota' }
    ]
  },
  // Consultar Demandas
  {
    path: '/dashboard/comunicacao/demandas',
    items: [
      { label: 'Início', path: '/dashboard' },
      { label: 'Comunicação', path: '/dashboard/comunicacao' },
      { label: 'Demandas', path: '/dashboard/comunicacao/demandas' }
    ]
  },
  // Gerar Nota
  {
    path: '/dashboard/comunicacao/criar-nota',
    items: [
      { label: 'Início', path: '/dashboard' },
      { label: 'Comunicação', path: '/dashboard/comunicacao' },
      { label: 'Notas de Imprensa', path: '/dashboard/comunicacao/notas' },
      { label: 'Gerar Nota', path: '/dashboard/comunicacao/criar-nota' }
    ]
  },
  // Nova Solicitação
  {
    path: '/dashboard/comunicacao/cadastrar',
    items: [
      { label: 'Início', path: '/dashboard' },
      { label: 'Comunicação', path: '/dashboard/comunicacao' },
      { label: 'Demandas', path: '/dashboard/comunicacao/demandas' },
      { label: 'Nova Solicitação', path: '/dashboard/comunicacao/cadastrar' }
    ]
  },
  // Consultar Notas
  {
    path: '/dashboard/comunicacao/notas',
    items: [
      { label: 'Início', path: '/dashboard' },
      { label: 'Comunicação', path: '/dashboard/comunicacao' },
      { label: 'Notas de Imprensa', path: '/dashboard/comunicacao/notas' }
    ]
  }
];

// List of segments that should be hidden in the breadcrumb
export const hiddenSegments = ['zeladoria', 'dashboard/dashboard'];

export const displayNames: Record<string, string> = {
  dashboard: 'Início',
  comunicacao: 'Comunicação',
  'cadastrar-demanda': 'Cadastrar Demanda',
  cadastrar: 'Nova Solicitação',
  settings: 'Configurações',
  profile: 'Meu Perfil',
  demandas: 'Demandas',
  notas: 'Notas de Imprensa',
  usuarios: 'Usuários',
  relatorios: 'Relatórios',
  'ranking-subs': 'Ranking da Zeladoria',
  releases: 'Releases e Notícias',
  'cadastrar-release': 'Novo Release',
  'criar-nota': 'Gerar Nota',
  'aprovar-nota': 'Aprovar Notas',
};
