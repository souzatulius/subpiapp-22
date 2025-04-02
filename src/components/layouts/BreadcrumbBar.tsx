
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

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
    if (pathSegments[index] === 'settings' && onSettingsClick) {
      onSettingsClick();
      return;
    }
    
    const path = '/' + pathSegments.slice(0, index + 1).join('/');
    navigate(path);
  };
  
  return (
    <div className="bg-white border-b border-gray-200 px-4 py-2 text-sm flex items-center overflow-x-auto">
      <button 
        onClick={() => navigate('/dashboard')} 
        className="flex items-center text-blue-600 hover:text-blue-800"
      >
        <Home className="h-4 w-4 mr-1" />
        <span>Início</span>
      </button>
      
      {pathSegments.map((segment, index) => {
        if (!segment) return null;
        
        return (
          <React.Fragment key={index}>
            <ChevronRight className="h-4 w-4 mx-1 text-gray-500" />
            <button 
              onClick={() => handleClick(index)}
              className="hover:text-blue-600 whitespace-nowrap"
            >
              {getDisplayName(segment)}
            </button>
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default BreadcrumbBar;
