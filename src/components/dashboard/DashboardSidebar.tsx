
import React from 'react';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { BarChart2, FileText, Home, PlusCircle, List, Users } from 'lucide-react';

interface DashboardSidebarProps {
  isOpen: boolean;
}

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({ isOpen }) => {
  const { user, session } = useAuth();
  const location = useLocation();

  const sidebarItems = [
    {
      name: 'Dashboard',
      icon: <Home className="h-5 w-5 mr-2" />,
      href: '/dashboard',
      role: ['Admin', 'Subprefeito', 'Time de Comunicação', 'Gestores', 'Técnico']
    },
    {
      name: 'Cadastrar Demanda',
      icon: <PlusCircle className="h-5 w-5 mr-2" />,
      href: '/cadastrar-demanda',
      role: ['Admin', 'Subprefeito', 'Time de Comunicação', 'Gestores', 'Técnico']
    },
    {
      name: 'Minhas Demandas',
      icon: <List className="h-5 w-5 mr-2" />,
      href: '/demandas',
      role: ['Admin', 'Subprefeito', 'Time de Comunicação', 'Gestores', 'Técnico']
    },
    {
      name: 'Gerenciar Usuários',
      icon: <Users className="h-5 w-5 mr-2" />,
      href: '/gerenciar-usuarios',
      role: ['Admin', 'Subprefeito']
    },
    {
      name: 'Relatórios',
      icon: <FileText className="h-5 w-5 mr-2" />,
      href: '/relatorios',
      role: ['Admin', 'Subprefeito', 'Time de Comunicação', 'Gestores']
    },
    {
      name: 'Ranking das Subs',
      icon: <BarChart2 className="h-5 w-5 mr-2" />,
      href: '/ranking-subs',
      role: ['Admin', 'Subprefeito']
    },
  ];

  const userRoles = session?.user?.app_metadata?.roles || [];

  const filteredSidebarItems = sidebarItems.filter(item =>
    item.role.some(role => userRoles.includes(role))
  );

  return (
    <>
      {/* Sidebar para telas maiores */}
      <aside
        className={`fixed left-0 top-[60px] bottom-0 hidden lg:block transition-all duration-300 ease-in-out ${
          isOpen ? 'w-64' : 'w-0 overflow-hidden'
        }`}
      >
        <div className="h-full flex flex-col bg-gray-50 border-r border-gray-200">
          <div className="flex items-center justify-center h-16 border-b border-gray-200">
            <span className="text-lg font-semibold text-[#003570]">Menu</span>
          </div>
          <nav className="flex-1 p-4 overflow-y-auto">
            <ul className="space-y-1">
              {filteredSidebarItems.map((item) => (
                <li key={item.name}>
                  <NavLink
                    to={item.href}
                    className={({ isActive }) =>
                      `flex items-center p-2 rounded-md transition-colors ${
                        isActive 
                          ? 'bg-[#003570]/10 text-[#003570] font-medium' 
                          : 'text-gray-700 hover:bg-gray-100'
                      }`
                    }
                  >
                    {item.icon}
                    <span>{item.name}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.user_metadata?.avatar_url} />
                <AvatarFallback>{user?.email?.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <p className="text-sm text-gray-500 truncate">{user?.email}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Sidebar responsivo para telas menores */}
      <Sheet>
        <SheetTrigger className="lg:hidden">
          <Menu className="h-6 w-6" />
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <div className="flex items-center justify-center h-16 border-b border-gray-200">
            <span className="text-lg font-semibold text-[#003570]">Menu</span>
          </div>
          <nav className="flex-1 p-4 overflow-y-auto">
            <ul className="space-y-1">
              {filteredSidebarItems.map((item) => (
                <li key={item.name}>
                  <NavLink
                    to={item.href}
                    className={({ isActive }) =>
                      `flex items-center p-2 rounded-md transition-colors ${
                        isActive 
                          ? 'bg-[#003570]/10 text-[#003570] font-medium' 
                          : 'text-gray-700 hover:bg-gray-100'
                      }`
                    }
                  >
                    {item.icon}
                    <span>{item.name}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.user_metadata?.avatar_url} />
                <AvatarFallback>{user?.email?.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <p className="text-sm text-gray-500 truncate">{user?.email}</p>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default DashboardSidebar;
