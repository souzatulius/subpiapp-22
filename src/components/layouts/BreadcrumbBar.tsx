
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
import { useIsMobile } from '@/hooks/use-mobile';

interface BreadcrumbBarProps {
  onSettingsClick?: () => void;
}

const BreadcrumbBar: React.FC<BreadcrumbBarProps> = ({ onSettingsClick }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  // Remove leading slash and split path into segments
  const pathSegments = location.pathname.substring(1).split('/');
  
  const getDisplayName = (segment: string, fullPath: string) => {
    // Custom display names for specific paths
    const customRoutes: Record<string, string> = {
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
      'esic': 'e-SIC',  // Updated to show "e-SIC" instead of "Esic"
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
        { path: '/dashboard/comunicacao/releases', label: 'Notícias' },
        { path: '/dashboard/comunicacao/cadastrar-release', label: 'Novo' }
      ];
    }
    
    if (path.includes('/dashboard/comunicacao/releases')) {
      return [
        { path: '/dashboard', label: 'Início' },
        { path: '/dashboard/comunicacao', label: 'Comunicação' },
        { path: '/dashboard/comunicacao/releases', label: 'Notícias' }
      ];
    }
    
    if (path.includes('/dashboard/comunicacao/aprovar-nota')) {
      return [
        { path: '/dashboard', label: 'Início' },
        { path: '/dashboard/comunicacao', label: 'Comunicação' },
        { path: '/dashboard/comunicacao/notas', label: 'Notas' },
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
        { path: '/dashboard/comunicacao/notas', label: 'Notas' },
        { path: '/dashboard/comunicacao/criar-nota', label: 'Nova' }
      ];
    }
    
    if (path.includes('/dashboard/comunicacao/cadastrar') || 
        path.includes('/dashboard/comunicacao/cadastrar-demanda')) {
      return [
        { path: '/dashboard', label: 'Início' },
        { path: '/dashboard/comunicacao', label: 'Comunicação' },
        { path: '/dashboard/comunicacao/demandas', label: 'Demandas' },
        { path: path, label: 'Nova' }
      ];
    }
    
    if (path.includes('/dashboard/comunicacao/consultar-notas') || 
        path.includes('/dashboard/comunicacao/notas')) {
      return [
        { path: '/dashboard', label: 'Início' },
        { path: '/dashboard/comunicacao', label: 'Comunicação' },
        { path: '/dashboard/comunicacao/notas', label: 'Notas' }
      ];
    }
    
    // Special case for the Zeladoria ranking path - hide "zeladoria" segment
    if (path.includes('/dashboard/zeladoria/ranking-subs')) {
      return [
        { path: '/dashboard', label: 'Início' },
        { path: '/dashboard/zeladoria/ranking-subs', label: 'Ranking da Zeladoria' }
      ];
    }
    
    // Special case for e-SIC path
    if (path.includes('/dashboard/esic')) {
      return [
        { path: '/dashboard', label: 'Início' },
        { path: '/dashboard/esic', label: 'e-SIC' }
      ];
    }
    
    // Default case: use the path segments
    return null;
  };
  
  // Get custom breadcrumbs if defined for this route
  const customBreadcrumbs = generateCustomBreadcrumbs();
  
  // Filter out the "zeladoria" segment from the breadcrumb if using the default processor
  const processPathSegments = () => {
    if (customBreadcrumbs) return customBreadcrumbs;
    
    return pathSegments
      .filter(segment => segment !== '' && segment !== 'zeladoria')
      .map((segment, index) => {
        // Reconstruct the full path without the filtered segments
        const visibleSegments = pathSegments
          .filter(seg => seg !== '' && seg !== 'zeladoria')
          .slice(0, index + 1);
        
        // We need to keep the original structure for the path
        const fullPathSegments = pathSegments.slice(0, pathSegments.indexOf(segment) + 1);
        const fullPath = fullPathSegments.join('/');
        
        return {
          path: '/' + fullPath,
          label: getDisplayName(segment, visibleSegments.join('/'))
        };
      });
  };
  
  const breadcrumbItems = processPathSegments();
  
  const handleNavigate = (path: string) => {
    // If this is a settings path and we have a special handler, use it
    if (path.includes('/settings') && onSettingsClick) {
      onSettingsClick();
      return;
    }
    
    navigate(path);
  };
  
  return (
    <div className={`px-4 py-1.5 text-xs text-gray-500 ${isMobile ? 'bg-white shadow-sm' : ''}`}>
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
