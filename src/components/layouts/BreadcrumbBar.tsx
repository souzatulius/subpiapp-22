
import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export interface BreadcrumbBarProps {
  onSettingsClick?: () => void;
  className?: string;
}

const BreadcrumbBar: React.FC<BreadcrumbBarProps> = ({ 
  onSettingsClick,
  className = "" 
}) => {
  const location = useLocation();
  const paths = location.pathname.split('/').filter(Boolean);

  // Convert URL paths to readable labels
  const getLabel = (path: string) => {
    const pathMap: { [key: string]: string } = {
      'dashboard': 'Dashboard',
      'esic': 'e-SIC',
      'profile': 'Perfil',
      'settings': 'Configurações',
      'users': 'Usuários',
      'ranking': 'Ranking',
      'ranking-subs': 'Ranking',
      'relatorios': 'Relatórios',
      'demandas': 'Demandas',
      'notas': 'Notas',
      'comunicacao': 'Comunicação',
      'edit': 'Editar',
      'view': 'Visualizar',
      'create': 'Novo',
      'zeladoria': 'Zeladoria',
    };
    
    return pathMap[path] || path.charAt(0).toUpperCase() + path.slice(1);
  };
  
  // Check if path is non-clickable (like 'zeladoria')
  const isNonClickable = (path: string) => {
    return ['zeladoria'].includes(path);
  };

  // Hide Dashboard from breadcrumb
  const filteredPaths = paths.filter(path => path !== 'dashboard');

  return (
    <div className={`bg-white border-b border-gray-200 py-2 px-4 ${className}`}>
      <div className="flex items-center text-sm text-gray-500">
        <Link 
          to="/dashboard" 
          className="flex items-center hover:text-primary transition-colors"
        >
          <Home className="h-4 w-4 mr-1" />
          <span>Início</span>
        </Link>

        {filteredPaths.map((path, i) => (
          <React.Fragment key={i}>
            <ChevronRight className="h-4 w-4 mx-1" />
            {i === filteredPaths.length - 1 || (onSettingsClick && path === 'settings') || isNonClickable(path) ? (
              <span 
                className={`${(onSettingsClick && path === 'settings') ? 'cursor-pointer hover:text-primary' : ''}`}
                onClick={onSettingsClick && path === 'settings' ? onSettingsClick : undefined}
              >
                {getLabel(path)}
              </span>
            ) : (
              <Link 
                to={`/${['dashboard', ...filteredPaths.slice(0, i + 1)].join('/')}`}
                className="hover:text-primary transition-colors"
              >
                {getLabel(path)}
              </Link>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default BreadcrumbBar;
