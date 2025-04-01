
import React from 'react';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { useLocation, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useSupabaseAuth';

const BreadcrumbBar: React.FC = () => {
  const location = useLocation();
  const { user } = useAuth();
  
  // Check if current page is a public page or main dashboard
  const isPublicPage = ['/login', '/register', '/forgot-password', '/email-verified', '/'].includes(location.pathname) || 
                      location.pathname.includes('/404');
  const isMainDashboard = location.pathname === '/dashboard';
  
  // Don't render breadcrumbs on public pages or main dashboard
  if (!user || isPublicPage || isMainDashboard) {
    return null;
  }
  
  // Map of route paths to friendly names
  const routeNames: Record<string, string> = {
    'dashboard': 'Dashboard',
    'comunicacao': 'Comunicação',
    'notas': 'Notas para Imprensa',
    'cadastrar': 'Cadastrar Demanda',
    'responder': 'Responder Demandas',
    'consultar-demandas': 'Consultar Demandas',
    'criar-nota': 'Criar Nota',
    'aprovar-nota': 'Aprovar Nota',
    'consultar-notas': 'Consultar Notas',
    'relatorios': 'Relatórios',
    'zeladoria': 'Zeladoria',
    'ranking-subs': 'Ranking das Subs',
    'settings': 'Configurações'
  };
  
  const paths = location.pathname.split('/').filter(path => path);
  
  if (paths.length === 0) return null;
  
  // Special case for dashboard to avoid duplication
  if (paths.length === 1 && paths[0] === 'dashboard') {
    return null; // No breadcrumbs on main dashboard
  }
  
  return (
    <div className="max-w-7xl mx-auto px-6 pt-4 pb-1">
      <Breadcrumb className="w-full">
        <BreadcrumbList className="text-xs text-gray-500">
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/dashboard">Dashboard</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          
          {paths.map((path, index) => {
            // Skip the first path if it's dashboard to avoid duplication
            if (index === 0 && path === 'dashboard') return null;
            
            // Get friendly name from the map or capitalize the first letter
            const formattedPath = routeNames[path] || (path.charAt(0).toUpperCase() + path.slice(1));
            
            // Build the correct URL path
            // Ensure proper path for comunicacao section
            let href = `/${paths.slice(0, index + 1).join('/')}`;
            
            // Special handling for "comunicacao" to ensure correct link
            if (path === 'comunicacao' && index > 0 && paths[index-1] === 'dashboard') {
              href = '/dashboard/comunicacao/comunicacao';
            }
            
            // Make "Configurações" in settings section clickable
            if (path === 'settings' && paths.length > 1) {
              return (
                <React.Fragment key={index}>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                      <Link to="/settings">Configurações</Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                </React.Fragment>
              );
            }
            
            return (
              <React.Fragment key={index}>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  {index === paths.length - 1 ? (
                    <span className="text-gray-600 font-medium">{formattedPath}</span>
                  ) : (
                    <BreadcrumbLink asChild>
                      <Link to={href}>{formattedPath}</Link>
                    </BreadcrumbLink>
                  )}
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
