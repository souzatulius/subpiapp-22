
import React from 'react';
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProfileMenu from './ProfileMenu';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { useLocation, Link } from 'react-router-dom';
import { NotificationsPopover } from './NotificationsPopover';
import { useAuth } from '@/hooks/useSupabaseAuth';

interface HeaderProps {
  showControls?: boolean;
  toggleSidebar?: () => void;
}

const Header: React.FC<HeaderProps> = ({ showControls = false, toggleSidebar }) => {
  const location = useLocation();
  const { user } = useAuth();
  
  // Check if current page is a public page or main dashboard page
  const isPublicPage = ['/login', '/register', '/forgot-password', '/email-verified', '/'].includes(location.pathname) || 
                      location.pathname.includes('/404');
  const isMainDashboardPage = location.pathname === '/dashboard';
  
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
  
  // Generate breadcrumbs based on current path
  const generateBreadcrumbs = () => {
    // Don't show breadcrumbs on public pages or main dashboard page
    if (!user || isPublicPage || isMainDashboardPage) {
      return null;
    }
    
    const paths = location.pathname.split('/').filter(path => path);
    
    if (paths.length === 0) return null;
    
    // Special case for dashboard to avoid duplication
    if (paths.length === 1 && paths[0] === 'dashboard') {
      return (
        <Breadcrumb className="w-full">
          <BreadcrumbList>
            <BreadcrumbItem>
              <span className="font-medium">Dashboard</span>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      );
    }
    
    // Special case for settings - make settings breadcrumb clickable
    if (paths.includes('settings')) {
      return (
        <Breadcrumb className="w-full">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/dashboard">Dashboard</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              {/* Make "Configurações" clickable to return to settings dashboard */}
              <BreadcrumbLink asChild>
                <Link to="/settings">Configurações</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            
            {paths.length > 1 && paths[0] === 'settings' && paths[1] && (
              <>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <span className="font-medium">
                    {routeNames[paths[1]] || (paths[1].charAt(0).toUpperCase() + paths[1].slice(1))}
                  </span>
                </BreadcrumbItem>
              </>
            )}
          </BreadcrumbList>
        </Breadcrumb>
      );
    }
    
    return (
      <Breadcrumb className="w-full">
        <BreadcrumbList>
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
            
            return (
              <React.Fragment key={index}>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  {index === paths.length - 1 ? (
                    <span className="font-medium">{formattedPath}</span>
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
    );
  };
  
  return (
    <header className="sticky top-0 bg-white border-b z-30 flex flex-col shadow-sm">
      {/* Main header row with logo and user controls */}
      <div className="h-16 flex items-center justify-between px-4">
        <div className="flex items-center">
          {/* Only show the menu toggle button if not on a public page */}
          {showControls && toggleSidebar && !isPublicPage && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="mr-2 hidden md:flex" /* Hide on mobile */
              onClick={toggleSidebar}
            >
              <Menu className="h-5 w-5" />
            </Button>
          )}
        </div>
        
        {/* Logo centered in the header */}
        <div className="absolute left-1/2 transform -translate-x-1/2 h-10 flex items-center">
          <img 
            src="/lovable-uploads/f0e9c688-4d13-4dee-aa68-f4ac4292ad11.png" 
            alt="SUB-PI Logo" 
            className="h-full object-contain"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          {/* Only show user controls if not on a public page */}
          {!isPublicPage && (
            <>
              <NotificationsPopover />
              <ProfileMenu />
            </>
          )}
        </div>
      </div>
      
      {/* Breadcrumb row below the main header */}
      {user && !isPublicPage && !isMainDashboardPage && (
        <div className="px-4 py-2 border-t bg-gray-25">
          {generateBreadcrumbs()}
        </div>
      )}
    </header>
  );
};

export default Header;
