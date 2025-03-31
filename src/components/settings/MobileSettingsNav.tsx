
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
          const isActive = location.pathname.includes(item.path);
          
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
