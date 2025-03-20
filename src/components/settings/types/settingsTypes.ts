
export interface SettingsStats {
  users: number;
  areas: number;
  positions: number;
  services: number;
  districts: number;
  neighborhoods: number;
  announcements: number;
  notifications: number;
}

export interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  description: string;
  section: string;
  highlight?: boolean;
  unreadCount?: number;
}
