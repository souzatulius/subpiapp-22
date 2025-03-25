
export interface SettingsStats {
  users: number;
  areas: number;
  positions: number;
  services: number;
  districts: number;
  neighborhoods: number;
  announcements: number;
  notifications: number;
  usuarios: number;
  areasCoordenacao: number;
  coordenacoes: number;
  cargos: number;
  problemas: number;
  tiposMidia: number;
  origensDemanda: number;
  distritos: number;
  bairros: number;
  comunicados: number;
  configuracoesNotificacoes: number;
  permissoes: number;
  temas: number;
}

export interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  description: string;
  section: string;
  highlight?: boolean;
  unreadCount?: number;
  onClick?: () => void;
}
