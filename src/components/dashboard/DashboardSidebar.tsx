import React from 'react';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { BarChart2, FileText } from 'lucide-react';

interface DashboardSidebarProps {
  isOpen: boolean;
}

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({ isOpen }) => {
  const { user, session } = useAuth();
  const location = useLocation();

  const sidebarItems = [
    {
      name: 'Dashboard',
      icon: null,
      href: '/dashboard',
      role: ['Admin', 'Subprefeito', 'Time de Comunicação', 'Gestores', 'Técnico']
    },
    {
      name: 'Cadastrar Demanda',
      icon: null,
      href: '/cadastrar-demanda',
      role: ['Admin', 'Subprefeito', 'Time de Comunicação', 'Gestores', 'Técnico']
    },
    {
      name: 'Minhas Demandas',
      icon: null,
      href: '/demandas',
      role: ['Admin', 'Subprefeito', 'Time de Comunicação', 'Gestores', 'Técnico']
    },
    {
      name: 'Gerenciar Usuários',
      icon: null,
      href: '/gerenciar-usuarios',
      role: ['Admin', 'Subprefeito']
    },
    {
      name: 'Relatórios',
      icon: <FileText className="h-5 w-5" />,
      href: '/relatorios',
      role: ['Admin', 'Subprefeito', 'Time de Comunicação', 'Gestores']
    },
    {
      name: 'Ranking das Subs',
      icon: <BarChart2 className="h-5 w-5" />,
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
        className={`hidden lg:flex flex-col w-64 bg-gray-50 border-r border-gray-200 transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        <div className="flex items-center justify-center h-16 border-b border-gray-200">
          <span className="text-lg font-semibold text-[#003570]">Menu</span>
        </div>
        <nav className="flex-1 p-4">
          <ul>
            {filteredSidebarItems.map((item) => (
              <li key={item.name} className="mb-2">
                <NavLink
                  to={item.href}
                  className={({ isActive }) =>
                    `flex items-center p-2 rounded-md hover:bg-gray-100 ${isActive ? 'bg-gray-100 font-semibold' : ''}`
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
          <Avatar className="h-8 w-8">
            <AvatarImage src={user?.user_metadata?.avatar_url} />
            <AvatarFallback>{user?.email?.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <p className="mt-2 text-sm text-gray-500">{user?.email}</p>
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
          <nav className="flex-1 p-4">
            <ul>
              {filteredSidebarItems.map((item) => (
                <li key={item.name} className="mb-2">
                  <NavLink
                    to={item.href}
                    className={({ isActive }) =>
                      `flex items-center p-2 rounded-md hover:bg-gray-100 ${isActive ? 'bg-gray-100 font-semibold' : ''}`
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
            <Avatar className="h-8 w-8">
              <AvatarImage src={user?.user_metadata?.avatar_url} />
              <AvatarFallback>{user?.email?.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <p className="mt-2 text-sm text-gray-500">{user?.email}</p>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default DashboardSidebar;
