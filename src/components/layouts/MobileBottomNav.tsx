
import React from 'react';
import { NavLink } from 'react-router-dom';
import { getNavigationSections } from '@/components/dashboard/sidebar/navigationConfig';

interface MobileBottomNavProps {
  className?: string;
}

const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ className }) => {
  const navItems = getNavigationSections();

  return (
    <nav className={`md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50 ${className}`}>
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => (
          <NavLink
            key={item.id}
            to={item.path}
            className={({ isActive }) => 
              `flex flex-col items-center justify-center w-full h-full py-1 
              ${isActive ? 'text-[#174ba9]' : 'text-gray-500'}`
            }
          >
            <div className="text-[#f57737]">
              {item.icon}
            </div>
            <span className="text-xs mt-1">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default MobileBottomNav;
