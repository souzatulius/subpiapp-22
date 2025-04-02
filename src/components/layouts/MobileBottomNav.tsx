
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { getNavigationSections } from '@/components/dashboard/sidebar/navigationConfig';

interface MobileBottomNavProps {
  className?: string;
}

const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ className }) => {
  const navItems = getNavigationSections().map(item => {
    // Rename "Ranking das Subs" to just "Ranking"
    if (item.id === 'ranking') {
      return { ...item, label: 'Ranking' };
    }
    return item;
  });
  
  const location = useLocation();

  // Function to determine if a nav item should be active
  const isNavItemActive = (itemPath: string) => {
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
    
    // For other items, standard behavior
    return location.pathname === itemPath || location.pathname.startsWith(itemPath + '/');
  };

  return (
    <nav className={`md:hidden fixed bottom-0 left-0 right-0 bg-[#051b2c] shadow-lg z-50 ${className}`}>
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => (
          <NavLink
            key={item.id}
            to={item.path}
            className={() => {
              const active = isNavItemActive(item.path);
              return `flex flex-col items-center justify-center w-full h-full py-2 
                ${active ? 'bg-white text-gray-600' : 'text-gray-400'}`
            }}
          >
            <div className="text-[#f57737]">
              {item.icon}
            </div>
            <span className="text-xs mt-1 truncate">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default MobileBottomNav;
