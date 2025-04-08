
import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { getNavigationSections } from '@/components/dashboard/sidebar/navigationConfig';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useSupabaseAuth';

interface MobileBottomNavProps {
  className?: string;
}

const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ className }) => {
  const { user } = useAuth();
  const [userDepartment, setUserDepartment] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch user department
  useEffect(() => {
    const fetchUserDepartment = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('usuarios')
          .select('coordenacao_id')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error fetching user department:', error);
        } else if (data) {
          setUserDepartment(data.coordenacao_id);
        }
      } catch (err) {
        console.error('Failed to fetch user department:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserDepartment();
  }, [user]);
  
  // Get all navigation items
  const allNavItems = getNavigationSections();
  
  // Filter for only the specified navigation items: Dashboard, Comunicação, Relatórios, Zeladoria (Ranking)
  const allowedPages = ['dashboard', 'comunicacao', 'relatorios', 'ranking', 'esic'];
  
  // Filter by department and allowed pages, then map for mobile
  const navItems = allNavItems
    .filter(item => allowedPages.includes(item.id))
    .filter(item => {
      if (item.allowedDepartments && item.allowedDepartments.length > 0) {
        return !userDepartment || item.allowedDepartments.includes(userDepartment);
      }
      return true;
    })
    .map(item => {
      // Rename "Top Zeladoria" to "Zeladoria" for mobile
      if (item.id === 'ranking') {
        return { ...item, label: 'Zeladoria' };
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
      <div className="flex justify-around items-center h-20">
        {navItems.map((item) => {
          const isActive = isNavItemActive(item.path);
          return (
            <NavLink
              key={item.id}
              to={item.path}
              className={() => {
                return `flex flex-col items-center justify-center w-full h-full py-2 
                  ${isActive ? 'bg-white text-[#051b2c]' : 'text-gray-400'}`
              }}
            >
              <div className="text-[#f57737] w-8 h-8">
                {item.icon}
              </div>
              <span className="text-xs mt-1 truncate font-bold">{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileBottomNav;
