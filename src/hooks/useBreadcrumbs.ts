
import { useMemo } from 'react';

interface Breadcrumb {
  path: string;
  label: string;
}

export const useBreadcrumbs = (pathname: string) => {
  const breadcrumbs = useMemo(() => {
    // First breadcrumb is always Dashboard
    const initialCrumbs: Breadcrumb[] = [
      { path: '/dashboard', label: 'Dashboard' }
    ];
    
    if (pathname === '/dashboard') {
      return initialCrumbs;
    }
    
    // Split the path and create breadcrumbs
    const pathSegments = pathname.split('/').filter(Boolean);
    
    const additionalCrumbs = pathSegments.slice(1).map((segment, index) => {
      const path = `/${pathSegments.slice(0, index + 2).join('/')}`;
      const label = formatSegmentLabel(segment);
      
      return { path, label };
    });
    
    return [...initialCrumbs, ...additionalCrumbs];
  }, [pathname]);
  
  return breadcrumbs;
};

// Helper to format segment labels
const formatSegmentLabel = (segment: string): string => {
  const labels: Record<string, string> = {
    'comunicacao': 'Comunicação',
    'responder': 'Responder Demanda',
    'consultar': 'Consultar',
    'cadastrar': 'Cadastrar Demanda',
    'criar-nota': 'Criar Nota',
    'editar-nota': 'Editar Nota',
    'aprovar-nota': 'Aprovar Nota',
    'configuracoes': 'Configurações',
    'settings': 'Configurações',
    'perfil': 'Perfil',
    'relatorios': 'Relatórios',
    'demandas': 'Demandas',
    'notas': 'Notas',
  };
  
  return labels[segment] || segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');
};

export default useBreadcrumbs;
