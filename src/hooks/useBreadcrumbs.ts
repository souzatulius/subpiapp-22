
import { useMemo } from 'react';

interface Breadcrumb {
  path: string;
  label: string;
}

export function useBreadcrumbs(pathname: string): Breadcrumb[] {
  return useMemo(() => {
    const paths = pathname.split('/').filter(Boolean);
    let currentPath = '';
    
    const breadcrumbs: Breadcrumb[] = [
      { path: '/', label: 'Início' }
    ];
    
    paths.forEach(path => {
      currentPath += `/${path}`;
      
      let label = path
        .split('-')
        .map(segment => segment.charAt(0).toUpperCase() + segment.slice(1))
        .join(' ');
      
      // Custom mappings for specific routes
      switch (path) {
        case 'dashboard':
          label = 'Dashboard';
          break;
        case 'comunicacao':
          label = 'Comunicação';
          break;
        case 'cadastrar':
          label = 'Cadastrar';
          break;
        case 'consultar':
          label = 'Consultar';
          break;
        case 'demandas':
          label = 'Demandas';
          break;
        case 'notas':
          label = 'Notas';
          break;
        case 'criar-nota':
          label = 'Criar Nota';
          break;
        case 'responder':
          label = 'Responder';
          break;
      }
      
      breadcrumbs.push({
        path: currentPath,
        label
      });
    });
    
    return breadcrumbs;
  }, [pathname]);
}
