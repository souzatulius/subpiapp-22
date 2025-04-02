
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getNavigationSections } from '@/components/dashboard/sidebar/navigationConfig';
import { useIsMobile } from '@/hooks/use-mobile';

const MobileSettingsNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  
  if (!isMobile) return null;
  
  // Get the same navigation items used in dashboard
  const navItems = getNavigationSections().map(item => {
    // Rename "Ranking das Subs" to just "Ranking"
    if (item.id === 'ranking') {
      return { ...item, label: 'Ranking' };
    }
    return item;
  });
  
  // Custom isActive function for navigation items
  const isLinkActive = (itemPath: string) => {
    // For Dashboard, only highlight if it's exactly the dashboard path
    if (itemPath === '/dashboard') {
      return location.pathname === '/dashboard';
    }
    
    // Special case for "Comunicação" - only active on exact match or non-relatorios paths
    if (itemPath === '/dashboard/comunicacao') {
      return location.pathname === '/dashboard/comunicacao' || 
             (location.pathname.startsWith('/dashboard/comunicacao/') && 
              !location.pathname.includes('/relatorios'));
    }
    
    // Special case for "Relatórios"
    if (itemPath === '/dashboard/comunicacao/relatorios') {
      return location.pathname.includes('/relatorios');
    }
    
    // For settings page, special handling
    if (itemPath === '/settings') {
      return location.pathname === '/settings' || 
        location.pathname.startsWith('/settings/');
    }
    
    // For other items, standard behavior
    return location.pathname === itemPath || location.pathname.startsWith(itemPath + '/');
  };
  
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[#051b2c] shadow-lg z-50">
      <div className="flex justify-around">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => navigate(item.path)}
            className={`flex flex-col items-center justify-center py-2 px-1 flex-1 h-16 ${
              isLinkActive(item.path) ? 'bg-white text-gray-600' : 'text-gray-400'
            }`}
          >
            <div className="text-[#f57737]">
              {item.icon}
            </div>
            <span className="text-xs mt-1 truncate">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default MobileSettingsNav;
