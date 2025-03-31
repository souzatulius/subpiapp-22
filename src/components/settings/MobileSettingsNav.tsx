
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getNavigationSections } from '@/components/dashboard/sidebar/navigationConfig';
import { useIsMobile } from '@/hooks/use-mobile';

const MobileSettingsNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  
  if (!isMobile) return null;

  // Use the same navigation items as in the main dashboard
  const navItems = getNavigationSections();
  
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[#003570] border-t border-gray-700 shadow-lg z-50">
      <div className="flex justify-around">
        {navItems.map((item) => {
          // Improved route matching logic to prevent multiple active items
          const isExactMatch = location.pathname === item.path;
          const isChildRoute = location.pathname.startsWith(item.path + '/');
          
          // Check if this is just a partial match that should be ignored
          const isPartialMatch = navItems.some(
            otherItem => 
              otherItem !== item && 
              otherItem.path.startsWith(item.path + '/') && 
              location.pathname.startsWith(otherItem.path)
          );
          
          // Only active if it's an exact match or a child route without being a partial match
          const isActive = isExactMatch || (isChildRoute && !isPartialMatch);
          
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center justify-center py-2 px-1 flex-1 ${
                isActive 
                  ? 'text-white bg-[#f57737]' 
                  : 'text-gray-300'
              }`}
            >
              <div className={isActive ? "text-white" : "text-[#f57737]"}>
                {item.icon}
              </div>
              <span className="text-[11px] mt-1 truncate">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MobileSettingsNav;
