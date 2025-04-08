
import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { getNavigationSections } from '@/components/dashboard/sidebar/navigationConfig';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { Skeleton } from '@/components/ui/skeleton';

interface MobileBottomNavProps {
  className?: string;
}

const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ className }) => {
  const { user } = useAuth();
  const [userDepartment, setUserDepartment] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
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
  
  const allNavItems = getNavigationSections();
  
  const allowedPages = ['dashboard', 'comunicacao', 'relatorios', 'ranking'];
  
  const navItems = allNavItems
    .filter(item => allowedPages.includes(item.id))
    .filter(item => {
      if (item.allowedDepartments && item.allowedDepartments.length > 0) {
        return !userDepartment || item.allowedDepartments.includes(userDepartment);
      }
      return true;
    })
    .map(item => {
      if (item.id === 'ranking') {
        return { ...item, label: 'Zeladoria' };
      }
      return item;
    });
  
  const location = useLocation();

  const isNavItemActive = (itemPath: string) => {
    if (itemPath === '/dashboard') {
      return location.pathname === '/dashboard';
    }
    
    if (itemPath === '/dashboard/comunicacao') {
      return location.pathname === '/dashboard/comunicacao' || 
             (location.pathname.startsWith('/dashboard/comunicacao/') && 
              !location.pathname.includes('/relatorios'));
    }
    
    if (itemPath === '/dashboard/comunicacao/relatorios') {
      return location.pathname.includes('/relatorios');
    }
    
    return location.pathname === itemPath || location.pathname.startsWith(itemPath + '/');
  };

  return (
    <nav className={`md:hidden fixed bottom-0 left-0 right-0 bg-[#051b2c] shadow-lg z-50 ${className}`}>
      <div className="flex justify-between items-stretch h-20">
        {isLoading ? (
          <>
            {[...Array(4)].map((_, index) => (
              <div 
                key={`skeleton-${index}`} 
                className="flex flex-col items-center justify-center flex-1 py-2 px-1"
              >
                <Skeleton className="w-6 h-6 rounded-full mb-1" />
                <Skeleton className="w-16 h-4 rounded" />
              </div>
            ))}
          </>
        ) : (
          navItems.map((item) => {
            const isActive = isNavItemActive(item.path);
            return (
              <NavLink
                key={item.id}
                to={item.path}
                className={() => {
                  return `flex flex-col items-center justify-center flex-1 min-w-fit py-1 px-2
                    ${isActive ? 'bg-white text-[#051b2c]' : 'text-gray-400'}`
                }}
              >
                <div className="text-[#f57737] w-6 h-6 flex items-center justify-center">
                  {item.icon}
                </div>
                <span className="text-xs mt-1 text-center truncate max-w-full">{item.label}</span>
              </NavLink>
            );
          })
        )}
      </div>
    </nav>
  );
};

export default MobileBottomNav;
