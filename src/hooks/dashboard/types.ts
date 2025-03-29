export type ActionCardItem = {
  id: string;
  title: string;
  icon: React.ReactNode; // usado diretamente no componente
  iconId?: string; // usado no form para selecionar o ícone
  path?: string;
  color: 
    | 'blue' 
    | 'green' 
    | 'orange' 
    | 'gray-light' 
    | 'gray-dark' 
    | 'blue-dark' 
    | 'orange-light' 
    | 'gray-ultra-light' 
    | 'lime' 
    | 'orange-600';
  width?: '25' | '50' | '75' | '100';
  height?: '1' | '2';

  // novos campos relacionados ao form
  type?: 'standard' | 'data_dynamic';
  dataSourceKey?: string;
  allowedDepartments?: string[];
  allowedRoles?: string[];
  displayMobile?: boolean;
  mobileOrder?: number;

  // controle visual e funcional
  isCustom?: boolean;
  isDraggable?: boolean;
};
