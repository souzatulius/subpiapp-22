
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { getNavigationSections } from '@/components/dashboard/sidebar/navigationConfig';

interface MobileBottomNavProps {
  className?: string;
}

const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ className }) => {
  const navItems = getNavigationSections();
  const location = useLocation();

  return (
    <nav className={`md:hidden fixed bottom-0 left-0 right-0 bg-[#003570] border-t border-gray-700 shadow-lg z-50 ${className}`}>
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          // Implementando uma lógica mais precisa de match de rotas
          const isActive = 
            location.pathname === item.path || 
            (location.pathname.startsWith(item.path + '/') && 
             // Exceção para evitar que rotas parciais ativem múltiplos itens
             !navItems.some(
               otherItem => 
                 otherItem.path !== item.path && 
                 location.pathname.startsWith(otherItem.path + '/')
             ));
          
          return (
            <NavLink
              key={item.id}
              to={item.path}
              className={`flex flex-col items-center justify-center w-full h-full py-1 
                ${isActive 
                  ? 'text-white bg-[#f57737]' 
                  : 'text-gray-300'}`
              }
            >
              <div className={isActive ? "text-white" : "text-[#f57737]"}>
                {item.icon}
              </div>
              <span className="text-xs mt-1">{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileBottomNav;
