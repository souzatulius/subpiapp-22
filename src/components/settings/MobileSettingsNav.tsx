
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Users, Building, Settings, 
  Map, Bell 
} from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const MobileSettingsNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  
  if (!isMobile) return null;

  const navItems = [
    { 
      id: 'dashboard', 
      label: 'Início', 
      path: '/settings',
      icon: <Settings className="h-5 w-5" />
    },
    { 
      id: 'usuarios', 
      label: 'Usuários', 
      path: '/settings?tab=usuarios',
      icon: <Users className="h-5 w-5" /> 
    },
    { 
      id: 'coordenacoes', 
      label: 'Coord.', 
      path: '/settings?tab=coordenacoes_lista',
      icon: <Building className="h-5 w-5" /> 
    },
    { 
      id: 'distritos', 
      label: 'Distritos', 
      path: '/settings?tab=distritos_bairros',
      icon: <Map className="h-5 w-5" /> 
    },
    { 
      id: 'comunicados', 
      label: 'Avisos', 
      path: '/settings?tab=comunicados',
      icon: <Bell className="h-5 w-5" /> 
    }
  ];
  
  // Find current active tab
  const query = new URLSearchParams(location.search);
  const activeTab = query.get('tab') || 'dashboard';
  
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
      <div className="flex justify-around">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => navigate(item.path)}
            className={`flex flex-col items-center justify-center py-2 px-1 flex-1 ${
              (activeTab === item.id || 
               (item.id === 'dashboard' && !activeTab)) ? 
               'text-blue-600' : 'text-gray-500'
            }`}
          >
            <div className="text-[#f57737]">
              {item.icon}
            </div>
            <span className="text-[11px] mt-1 truncate">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default MobileSettingsNav;
