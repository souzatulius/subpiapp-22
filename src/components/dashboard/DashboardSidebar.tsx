
import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { getNavigationSections } from '@/components/dashboard/sidebar/navigationConfig';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/utils/cn';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useSupabaseAuth';

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
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-[#f57737]",
          isActive
            ? "bg-[#003570] text-[#f57737] font-medium"
            : "text-gray-300 hover:bg-[#0035701a]",
          isCollapsed ? "justify-center" : ""
        )
      }
    >
      <div className="flex-shrink-0 w-8 h-8">{icon}</div>
      {!isCollapsed && <span className="text-lg font-bold">{label}</span>}
    </NavLink>
  );
};

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({ isOpen }) => {
  const isMobile = useIsMobile();
  const { user } = useAuth();
  const [userDepartment, setUserDepartment] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Base sidebar width calculation
  const sidebarWidth = isOpen ? "w-64" : "w-16";
  const sidebarPadding = isOpen ? "px-4" : "px-2";
  
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
  
  // Get navigation items from centralized config
  const allNavigationItems = getNavigationSections();
  
  // Filter for only the specified navigation items: Dashboard, Comunicação, Relatórios, Zeladoria (Ranking)
  const allowedPages = ['dashboard', 'comunicacao', 'relatorios', 'ranking', 'esic'];
  
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
      className={`${sidebarWidth} ${sidebarPadding} py-4 flex-shrink-0 border-r border-[#00357033] bg-[#051b2c] h-full fixed left-0 top-16 bottom-0 overflow-y-auto transition-all duration-300 ease-in-out`}
    >
      <nav className="space-y-6 flex flex-col h-full">
        <div className="space-y-6">
          {navigationItems.map((item) => (
            <SidebarItem
              key={item.id}
              to={item.path}
              icon={item.icon}
              label={item.label}
              isCollapsed={!isOpen}
            />
          ))}
        </div>
      </nav>
    </aside>
  );
};

export default DashboardSidebar;
