
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
  
  // Custom breadcrumb paths based on route
  const getBreadcrumbItems = () => {
    const currentPath = location.pathname;
    
    // Define custom breadcrumb configurations
    const customBreadcrumbs = [
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
    
    // Find matching path configuration
    const matchedConfig = customBreadcrumbs.find(config => 
      currentPath === config.path || 
      // Special handling for paths with query parameters
      (currentPath.includes('?') && currentPath.split('?')[0] === config.path)
    );
    
    if (matchedConfig) {
      return matchedConfig.items;
    }
    
    // Default fallback to the old behavior for paths not explicitly defined
    return generateDefaultBreadcrumbs();
  };
  
  const generateDefaultBreadcrumbs = () => {
    // Remove leading slash and split path into segments
    const pathSegments = location.pathname.substring(1).split('/');
    
    // List of segments that should be ocultados no breadcrumb
    const hiddenSegments = ['zeladoria', 'dashboard/dashboard'];
    
    // Filter segments that should be shown
    const filteredSegments = pathSegments.filter((segment, index) => {
      // Remove empty segments
      if (!segment) return false;
      
      // Special case for comunicacao path
      if (segment === 'comunicacao' && index === 1) {
        return true;
      }
      
      // Remove segments that should be hidden
      const fullPath = pathSegments.slice(0, index + 1).join('/');
      if (hiddenSegments.includes(segment) || hiddenSegments.includes(fullPath)) {
        return false;
      }
      
      return true;
    });
    
    // Map segments to breadcrumb items
    return filteredSegments.map((segment, index) => {
      if (!segment || segment === 'dashboard') {
        return { 
          label: 'Início', 
          path: '/dashboard' 
        };
      }
      
      const path = '/' + pathSegments.slice(0, pathSegments.indexOf(segment) + 1).join('/');
      return {
        label: getDisplayName(segment),
        path: path
      };
    });
  };
  
  const getDisplayName = (segment: string) => {
    const displayNames: Record<string, string> = {
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
      // Additional mappings as needed
    };
    
    return displayNames[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
  };
  
  const handleClick = (path: string) => {
    if (path.includes('settings') && onSettingsClick) {
      onSettingsClick();
      return;
    }
    
    navigate(path);
  };
  
  const breadcrumbItems = getBreadcrumbItems();
  
  return (
    <div className="px-6 py-2 text-xs text-gray-500">
      <Breadcrumb>
        <BreadcrumbList>
          {breadcrumbItems.map((item, index) => (
            <React.Fragment key={index}>
              {index > 0 && <BreadcrumbSeparator />}
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <button 
                    onClick={() => handleClick(item.path)}
                    className="hover:text-gray-700 whitespace-nowrap flex items-center"
                  >
                    {index === 0 && <Home className="h-3 w-3 mr-1" />}
                    <span>{item.label}</span>
                  </button>
                </BreadcrumbLink>
              </BreadcrumbItem>
            </React.Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
};

export default BreadcrumbBar;
