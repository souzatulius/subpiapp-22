
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
      dashboard: 'Início',
      comunicacao: 'Comunicação',
      'cadastrar-demanda': 'Cadastrar Demanda',
      cadastrar: 'Cadastrar',
      settings: 'Configurações',
      profile: 'Meu Perfil',
      'consultar-demandas': 'Consultar Demandas',
      'consultar-notas': 'Consultar Notas',
      usuarios: 'Usuários',
      relatorios: 'Relatórios',
      'ranking-subs': 'Ranking da Zeladoria',
      // Adicione outros mapeamentos conforme necessário
    };
    
    return displayNames[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
  };

  // Lista de segmentos que devem ser ocultados no breadcrumb
  const hiddenSegments = ['zeladoria'];
  
  const handleClick = (index: number) => {
    const segment = pathSegments[index];
    
    // Verificar se é a seção de configurações e há um manipulador especial
    if (segment === 'settings' && onSettingsClick) {
      onSettingsClick();
      return;
    }
    
    // Se for comunicacao, garantir que o caminho tenha comunicacao duplicado
    if (segment === 'comunicacao') {
      navigate('/dashboard/comunicacao/comunicacao');
      return;
    }
    
    const path = '/' + pathSegments.slice(0, index + 1).join('/');
    navigate(path);
  };
  
  // Filtrar segmentos duplicados consecutivos e segmentos que devem ser ocultados
  const filteredSegments = pathSegments.filter((segment, index) => {
    // Remover segmentos vazios
    if (!segment) return false;
    
    // Remover segmentos que devem ser ocultados
    if (hiddenSegments.includes(segment)) return false;
    
    // Remover duplicatas consecutivas (como comunicacao/comunicacao), exceto para o caso especial
    if (index > 0 && segment === pathSegments[index - 1] && segment !== 'comunicacao') {
      return false;
    }
    
    return true;
  });
  
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
          
          {filteredSegments.map((segment, index) => {
            if (!segment) return null;
            
            return (
              <React.Fragment key={index}>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <button 
                      onClick={() => handleClick(pathSegments.indexOf(segment))}
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
