import React, { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { getNavigationSections } from '@/components/dashboard/sidebar/navigationConfig';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/utils/cn';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { Skeleton } from '@/components/ui/skeleton';

interface DashboardSidebarProps {
  isOpen: boolean;
}

interface SidebarItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  isCollapsed: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ to, icon, label, isCollapsed }) => {
  const location = useLocation();
  
  const isActive = (() => {
    if (to === '/dashboard') {
      return location.pathname === '/dashboard';
    }
    
    if (to === '/dashboard/comunicacao/relatorios') {
      return location.pathname.includes('/relatorios');
    }
    
    return location.pathname.startsWith(to) && !(to === '/dashboard/comunicacao' && location.pathname.includes('/relatorios'));
  })();

  return (
    <NavLink
      to={to}
      className={cn(
        "flex rounded-xl px-3 py-4 transition-all hover:bg-[#0035701a]",
        isActive
          ? "bg-[#003570] text-[#f57737] font-medium"
          : "text-gray-300",
        isCollapsed 
          ? "justify-center items-center" 
          : "items-center justify-start gap-4"
      )}
      title={isCollapsed ? label : undefined}
    >
      <div className="flex-shrink-0 w-7 h-7">{icon}</div>
      {!isCollapsed && <span className="text-lg min-w-[80px]">{label}</span>}
    </NavLink>
  );
};

const SidebarItemSkeleton = ({ isCollapsed }: { isCollapsed: boolean }) => {
  return (
    <div className={cn(
      "flex rounded-xl px-3 py-4",
      isCollapsed 
        ? "justify-center items-center" 
        : "items-center justify-start gap-4"
    )}>
      <Skeleton className="w-7 h-7 rounded-full" />
      {!isCollapsed && <Skeleton className="h-5 w-24" />}
    </div>
  );
};

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({ isOpen }) => {
  const isMobile = useIsMobile();
  const { user } = useAuth();
  const [userDepartment, setUserDepartment] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const sidebarWidth = isOpen ? "w-64" : "w-24";
  const sidebarPadding = isOpen ? "px-4" : "px-3";
  
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
  
  const allNavigationItems = getNavigationSections();
  
  const allowedPages = ['dashboard', 'comunicacao', 'relatorios', 'ranking'];
  
  const navigationItems = allNavigationItems
    .filter(item => allowedPages.includes(item.id))
    .filter(item => {
      if (item.allowedDepartments && item.allowedDepartments.length > 0) {
        return !userDepartment || item.allowedDepartments.includes(userDepartment);
      }
      return true;
    });
  
  return (
    <aside
      className={`${sidebarWidth} ${sidebarPadding} py-6 flex-shrink-0 border-r border-[#00357033] bg-[#051b2c] h-full overflow-y-auto flex flex-col transition-all duration-300 ease-in-out`}
    >
      <nav className="flex-1 flex flex-col">
        <div className="space-y-4 flex-1">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, index) => (
              <SidebarItemSkeleton key={index} isCollapsed={!isOpen} />
            ))
          ) : (
            navigationItems.map((item) => (
              <SidebarItem
                key={item.id}
                to={item.path}
                icon={item.icon}
                label={item.label}
                isCollapsed={!isOpen}
              />
            ))
          )}
        </div>
      </nav>
    </aside>
  );
};

export default DashboardSidebar;
