
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
          // Improved route matching logic to prevent multiple active items
          const isExactMatch = location.pathname === item.path;
          const isChildRoute = location.pathname.startsWith(item.path + '/');
          
          // Check if this is just a partial match that should be ignored
          // For example, if we're on /dashboard/comunicacao and have a link to /dashboard,
          // we don't want /dashboard to be active
          const isPartialMatch = navItems.some(
            otherItem => 
              otherItem !== item && // Not the current item
              otherItem.path.startsWith(item.path + '/') && // Other item is a child of current
              location.pathname.startsWith(otherItem.path) // Current location is under other item
          );
          
          // Only active if it's an exact match or a child route without being a partial match
          const isActive = isExactMatch || (isChildRoute && !isPartialMatch);
          
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
