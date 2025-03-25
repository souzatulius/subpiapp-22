
import React from 'react';
import { 
  Users, Layers, Briefcase, AlertTriangle, 
  Image, Globe, MapPin, MessageSquare, Shield, 
  LayoutDashboard, Bell, FileText
} from 'lucide-react';

interface SettingsSidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  isMobile?: boolean;
}

const SettingsSidebar: React.FC<SettingsSidebarProps> = ({ 
  activeSection, 
  setActiveSection,
  isMobile = false
}) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'usuarios', label: 'Usuários', icon: Users },
    { id: 'areas', label: 'Supervisões Técnicas', icon: Layers },
    { id: 'cargos', label: 'Cargos', icon: Briefcase },
    { id: 'problemas', label: 'Problemas', icon: AlertTriangle },
    { id: 'servicos', label: 'Serviços', icon: FileText },
    { id: 'tipos_midia', label: 'Tipos de Mídia', icon: Image },
    { id: 'origens_demanda', label: 'Origem das Demandas', icon: Globe },
    { id: 'distritos_bairros', label: 'Distritos e Bairros', icon: MapPin },
    { id: 'comunicados', label: 'Comunicados', icon: MessageSquare },
    { id: 'notificacoes', label: 'Notificações', icon: Bell },
    { id: 'permissoes', label: 'Permissões', icon: Shield }
  ];

  const handleItemClick = (sectionId: string) => {
    setActiveSection(sectionId);
    // If on mobile, hide the menu after selection
    if (isMobile) {
      document.getElementById('mobile-menu')?.classList.add('hidden');
    }
  };

  return (
    <ul className="space-y-1">
      {menuItems.map(item => (
        <li key={item.id}>
          <button 
            className={`w-full text-left px-4 py-2 rounded-md flex items-center gap-3 ${
              activeSection === item.id ? 'bg-[#003570] text-white' : 'hover:bg-gray-100'
            }`}
            onClick={() => handleItemClick(item.id)}
          >
            <item.icon size={18} />
            <span className="text-sm font-medium">{item.label}</span>
          </button>
        </li>
      ))}
    </ul>
  );
};

export default SettingsSidebar;
