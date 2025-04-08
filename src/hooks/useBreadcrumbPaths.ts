import { useLocation } from 'react-router-dom';
import { getDisplayName } from '@/utils/breadcrumbUtils';

interface BreadcrumbItem {
  path: string;
  label: string;
}

/**
 * Custom hook for processing breadcrumb paths
 */
export const useBreadcrumbPaths = () => {
  const location = useLocation();
  
  // Remove leading slash and split path into segments
  const pathSegments = location.pathname.substring(1).split('/');
  
  // Generate custom breadcrumbs based on the current path
  const generateCustomBreadcrumbs = (): BreadcrumbItem[] | null => {
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
    
    // Default case: no custom path
    return null;
  };
  
  // Process path segments to create breadcrumb items
  const processPathSegments = (): BreadcrumbItem[] => {
    const customBreadcrumbs = generateCustomBreadcrumbs();
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

  return {
    breadcrumbItems: processPathSegments()
  };
};

export default useBreadcrumbPaths;
