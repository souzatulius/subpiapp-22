import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home } from 'lucide-react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb';

interface BreadcrumbBarProps {
  onSettingsClick?: () => void;
}

const BreadcrumbBar: React.FC<BreadcrumbBarProps> = ({ onSettingsClick }) => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Remove leading slash and split path into segments
  const pathSegments = location.pathname.substring(1).split('/');
  
  const getDisplayName = (segment: string, fullPath: string) => {
    // Custom display names for specific paths
    const customRoutes: Record<string, string> = {
      'cadastrar-release': 'Novo Release',
      'releases': 'Releases e Notícias',
      'cadastrar-demanda': 'Nova Solicitação',
      'cadastrar': 'Nova Solicitação',
      'demandas': 'Demandas',
      'consultar-demandas': 'Demandas',
      'criar-nota': 'Gerar Nota',
      'aprovar-nota': 'Aprovar Notas',
      'notas': 'Notas de Imprensa',
      'consultar-notas': 'Notas de Imprensa',
      'relatorios': 'Relatórios',
      'ranking-subs': 'Ranking da Zeladoria',
      'dashboard': 'Início',
      'comunicacao': 'Comunicação',
      'settings': 'Configurações',
      'profile': 'Meu Perfil',
      'usuarios': 'Usuários',
    };
    
    // Check if we have a custom name for the full path
    if (customRoutes[fullPath]) {
      return customRoutes[fullPath];
    }
    
    // Otherwise use the custom name for the segment or capitalize it
    return customRoutes[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
  };

  // Generate custom breadcrumbs based on the current path
  const generateCustomBreadcrumbs = () => {
    const path = location.pathname;
    
    // Custom breadcrumb paths
    if (path.includes('/dashboard/comunicacao/cadastrar-release')) {
      return [
        { path: '/dashboard', label: 'Início' },
        { path: '/dashboard/comunicacao', label: 'Comunicação' },
        { path: '/dashboard/comunicacao/releases', label: 'Releases e Notícias' },
        { path: '/dashboard/comunicacao/cadastrar-release', label: 'Novo Release' }
      ];
    }
    
    if (path.includes('/dashboard/comunicacao/releases')) {
      return [
        { path: '/dashboard', label: 'Início' },
        { path: '/dashboard/comunicacao', label: 'Comunicação' },
        { path: '/dashboard/comunicacao/releases', label: 'Releases e Notícias' }
      ];
    }
    
    if (path.includes('/dashboard/comunicacao/aprovar-nota')) {
      return [
        { path: '/dashboard', label: 'Início' },
        { path: '/dashboard/comunicacao', label: 'Comunicação' },
        { path: '/dashboard/comunicacao/notas', label: 'Notas de Imprensa' },
        { path: '/dashboard/comunicacao/aprovar-nota', label: 'Aprovar Notas' }
      ];
    }
    
    if (path.includes('/dashboard/comunicacao/consultar-demandas') || 
        path.includes('/dashboard/comunicacao/demandas')) {
      return [
        { path: '/dashboard', label: 'Início' },
        { path: '/dashboard/comunicacao', label: 'Comunicação' },
        { path: '/dashboard/comunicacao/demandas', label: 'Demandas' }
      ];
    }
    
    if (path.includes('/dashboard/comunicacao/criar-nota')) {
      return [
        { path: '/dashboard', label: 'Início' },
        { path: '/dashboard/comunicacao', label: 'Comunicação' },
        { path: '/dashboard/comunicacao/notas', label: 'Notas de Imprensa' },
        { path: '/dashboard/comunicacao/criar-nota', label: 'Gerar Nota' }
      ];
    }
    
    if (path.includes('/dashboard/comunicacao/cadastrar') || 
        path.includes('/dashboard/comunicacao/cadastrar-demanda')) {
      return [
        { path: '/dashboard', label: 'Início' },
        { path: '/dashboard/comunicacao', label: 'Comunicação' },
        { path: '/dashboard/comunicacao/demandas', label: 'Demandas' },
        { path: path, label: 'Nova Solicitação' }
      ];
    }
    
    if (path.includes('/dashboard/comunicacao/consultar-notas') || 
        path.includes('/dashboard/comunicacao/notas')) {
      return [
        { path: '/dashboard', label: 'Início' },
        { path: '/dashboard/comunicacao', label: 'Comunicação' },
        { path: '/dashboard/comunicacao/notas', label: 'Notas de Imprensa' }
      ];
    }
    
    // Default case: use the path segments
    return null;
  };
  
  // Get custom breadcrumbs if defined for this route
  const customBreadcrumbs = generateCustomBreadcrumbs();
  
  // Use the custom breadcrumbs if available, otherwise process the path segments
  const breadcrumbItems = customBreadcrumbs || pathSegments
    .filter(segment => segment !== '')
    .map((segment, index) => {
      const fullPath = pathSegments.slice(0, index + 1).join('/');
      return {
        path: '/' + fullPath,
        label: getDisplayName(segment, fullPath)
      };
    });
  
  const handleNavigate = (path: string) => {
    // If this is a settings path and we have a special handler, use it
    if (path.includes('/settings') && onSettingsClick) {
      onSettingsClick();
      return;
    }
    
    navigate(path);
  };
  
  return (
    <div className="px-6 py-2 text-xs text-gray-500">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <button onClick={() => navigate('/dashboard')} className="flex items-center hover:text-gray-700">
                <Home className="h-3 w-3 mr-1" />
                <span>Início</span>
              </button>
            </BreadcrumbLink>
          </BreadcrumbItem>
          
          {breadcrumbItems && breadcrumbItems.length > 0 && breadcrumbItems.map((item, index) => {
            // Skip the first item (dashboard/início) since we already have the home icon
            if (item.path === '/dashboard') return null;
            
            return (
              <React.Fragment key={index}>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <button 
                      onClick={() => handleNavigate(item.path)}
                      className="hover:text-gray-700 whitespace-nowrap"
                    >
                      {item.label}
                    </button>
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </React.Fragment>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
};

export default BreadcrumbBar;
