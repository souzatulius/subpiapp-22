
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
  supervisoesTecnicas: number;
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

export interface CardData {
  title: string;
  description: string;
  icon: JSX.Element;
  link: string;
  color: string;
  count?: number;
  category: string;
  loading?: boolean;
  chart?: JSX.Element;
}
