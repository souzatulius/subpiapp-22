
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
  
  const getDisplayName = (segment: string) => {
    const displayNames: Record<string, string> = {
      dashboard: 'Dashboard',
      comunicacao: 'Comunicação',
      'cadastrar-demanda': 'Cadastrar Demanda',
      cadastrar: 'Cadastrar',
      settings: 'Configurações',
      profile: 'Meu Perfil',
      'consultar-demandas': 'Consultar Demandas',
      'consultar-notas': 'Consultar Notas',
      usuarios: 'Usuários',
      // Adicione outros mapeamentos conforme necessário
    };
    
    return displayNames[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
  };
  
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
          
          {pathSegments.map((segment, index) => {
            if (!segment) return null;
            
            return (
              <React.Fragment key={index}>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <button 
                      onClick={() => handleClick(index)}
                      className="hover:text-gray-700 whitespace-nowrap"
                    >
                      {getDisplayName(segment)}
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
