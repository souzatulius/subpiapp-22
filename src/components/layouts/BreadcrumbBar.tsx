
import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BreadcrumbItem {
  label: string;
  path: string;
}

interface BreadcrumbBarProps {
  className?: string;
  onSettingsClick?: () => void;
}

const BreadcrumbBar: React.FC<BreadcrumbBarProps> = ({ className, onSettingsClick }) => {
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(Boolean);
  
  // Mapping to convert path segments to readable labels
  const segmentLabels: Record<string, string> = {
    'dashboard': 'Dashboard',
    'comunicacao': 'Comunicação',
    'demandas': 'Demandas',
    'notas': 'Notas',
    'criar': 'Criar',
    'nova': 'Nova',
    'detalhe': 'Detalhe',
    'responder': 'Responder',
    'aprovar': 'Aprovar',
    'configuracoes': 'Configurações',
    'usuarios': 'Usuários',
    'perfil': 'Perfil',
    'admin': 'Administração',
    'areas': 'Áreas',
    'temas': 'Temas',
    'servicos': 'Serviços',
    'relatorios': 'Relatórios',
    'editar': 'Editar',
    'consultar': 'Consultar'
  };
  
  const breadcrumbs: BreadcrumbItem[] = [];
  let currentPath = '';
  
  // Build breadcrumb trail
  pathSegments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    
    // Only add to breadcrumbs if it's a known path
    if (segment in segmentLabels) {
      breadcrumbs.push({
        label: segmentLabels[segment],
        path: currentPath
      });
    }
  });
  
  return (
    <div className={cn("bg-white border-b border-gray-200", className)}>
      <div className="max-w-screen-xl mx-auto px-4 py-2">
        <div className="flex items-center space-x-1 text-sm">
          <Link to="/dashboard" className="flex items-center text-gray-500 hover:text-gray-700" onClick={onSettingsClick && location.pathname === '/settings' ? onSettingsClick : undefined}>
            <Home className="h-4 w-4" />
          </Link>
          
          {breadcrumbs.map((breadcrumb, index) => (
            <React.Fragment key={index}>
              <ChevronRight className="h-4 w-4 text-gray-400" />
              
              {index === breadcrumbs.length - 1 ? (
                <span className="font-medium text-gray-900">
                  {breadcrumb.label}
                </span>
              ) : (
                <Link 
                  to={breadcrumb.path}
                  className="text-gray-500 hover:text-gray-700"
                >
                  {breadcrumb.label}
                </Link>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BreadcrumbBar;
