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
  
  // Create a mapping of display names for paths
  const getDisplayName = (segment: string, fullPath: string) => {
    // Custom display names based on full paths
    const customPaths: Record<string, string> = {
      'dashboard/comunicacao/releases': 'Releases e Notícias',
      'dashboard/comunicacao/cadastrar-release': 'Novo Release',
      'dashboard/comunicacao/aprovar-nota': 'Aprovar Notas',
      'dashboard/comunicacao/consultar-demandas': 'Demandas',
      'dashboard/comunicacao/criar-nota': 'Gerar Nota',
      'dashboard/comunicacao/cadastrar': 'Nova Solicitação',
      'dashboard/comunicacao/consultar-notas': 'Notas de Imprensa',
    };
    
    // Check if there's a custom path match first
    if (customPaths[fullPath]) {
      return customPaths[fullPath];
    }
    
    // Otherwise use segment-specific display names
    const displayNames: Record<string, string> = {
      dashboard: 'Início',
      comunicacao: 'Comunicação',
      'cadastrar-demanda': 'Cadastrar Demanda',
      cadastrar: 'Cadastrar',
      settings: 'Configurações',
      profile: 'Meu Perfil',
      demandas: 'Consultar Demandas',
      notas: 'Consultar Notas',
      usuarios: 'Usuários',
      relatorios: 'Relatórios',
      'ranking-subs': 'Ranking da Zeladoria',
    };
    
    return displayNames[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
  };

  // Lista de segmentos que devem ser ocultados no breadcrumb
  const hiddenSegments = ['zeladoria', 'dashboard/dashboard'];
  
  const handleClick = (index: number) => {
    const segment = pathSegments[index];
    
    // Verificar se é a seção de configurações e há um manipulador especial
    if (segment === 'settings' && onSettingsClick) {
      onSettingsClick();
      return;
    }
    
    const path = '/' + pathSegments.slice(0, index + 1).join('/');
    navigate(path);
  };
  
  // Build the breadcrumb paths
  const buildBreadcrumbs = () => {
    const breadcrumbs = [];
    let currentPath = '';
    
    for (let i = 0; i < pathSegments.length; i++) {
      const segment = pathSegments[i];
      if (!segment) continue;
      
      // Add to the current path
      currentPath += (currentPath ? '/' : '') + segment;
      
      // Skip hidden segments
      if (hiddenSegments.includes(segment) || hiddenSegments.includes(currentPath)) {
        continue;
      }
      
      // Special case for duplicate dashboard paths
      if (segment === 'dashboard' && i > 0 && pathSegments[i-1] === 'dashboard') {
        continue;
      }
      
      // Add the breadcrumb
      breadcrumbs.push({
        path: currentPath,
        name: getDisplayName(segment, currentPath),
        index: i
      });
    }
    
    return breadcrumbs;
  };
  
  const breadcrumbs = buildBreadcrumbs();
  
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
          
          {breadcrumbs.map((breadcrumb, index) => (
            <React.Fragment key={index}>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <button 
                    onClick={() => handleClick(breadcrumb.index)}
                    className="hover:text-gray-700 whitespace-nowrap"
                  >
                    {breadcrumb.name}
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
