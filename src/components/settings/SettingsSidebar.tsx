
import React from 'react';
import { 
  Users, Shield, Briefcase, Building, Layers, 
  Globe, AlertTriangle, Image, FileText, MapPin,
  Settings, MessageSquare, Bell, Send, Map,
  FolderTree
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
  // Define the main categories
  const categories = [
    {
      id: 'usuarios',
      label: 'Gestão de Usuários e Permissões',
      icon: Users,
      color: 'text-amber-600',
      subcategories: [
        { id: 'usuarios', label: 'Usuários e Permissões', icon: Users },
        { id: 'cargos', label: 'Cargos', icon: Briefcase }
      ]
    },
    {
      id: 'organizacional',
      label: 'Gestão Organizacional',
      icon: Building,
      color: 'text-blue-600',
      subcategories: [
        { id: 'coordenacoes_lista', label: 'Coordenações', icon: Building },
        { id: 'areas', label: 'Supervisões Técnicas', icon: Layers },
        { id: 'servicos', label: 'Serviços', icon: FileText }
      ]
    },
    {
      id: 'operacional',
      label: 'Gestão Operacional',
      icon: Settings,
      color: 'text-green-600',
      subcategories: [
        { 
          id: 'demandas', 
          label: 'Demandas', 
          icon: FolderTree, 
          subItems: [
            { id: 'origens_demanda', label: 'Origens das Demandas', icon: Globe },
            { id: 'problemas', label: 'Problemas/Temas', icon: AlertTriangle },
            { id: 'tipos_midia', label: 'Tipos de Mídia', icon: Image },
            { id: 'distritos_bairros', label: 'Distritos e Bairros', icon: MapPin },
          ]
        },
        { 
          id: 'comunicacao', 
          label: 'Comunicação', 
          icon: MessageSquare,
          subItems: [
            { id: 'notificacoes', label: 'Notificações', icon: Bell },
            { id: 'comunicados', label: 'Avisos e Comunicados', icon: Send },
          ] 
        }
      ]
    }
  ];

  const handleItemClick = (sectionId: string) => {
    setActiveSection(sectionId);
    // If on mobile, hide the menu after selection
    if (isMobile) {
      document.getElementById('mobile-menu')?.classList.add('hidden');
    }
  };

  // Determine if a category or subcategory is active
  const isCategoryActive = (category: any) => {
    if (activeSection === category.id) return true;
    if (category.subcategories) {
      return category.subcategories.some((sub: any) => 
        activeSection === sub.id || 
        (sub.subItems && sub.subItems.some((item: any) => activeSection === item.id))
      );
    }
    return false;
  };

  const isSubcategoryActive = (subcategory: any) => {
    if (activeSection === subcategory.id) return true;
    if (subcategory.subItems) {
      return subcategory.subItems.some((item: any) => activeSection === item.id);
    }
    return false;
  };

  return (
    <div className="space-y-4">
      {categories.map(category => (
        <div key={category.id} className="space-y-1">
          {/* Main category */}
          <button 
            className={`w-full text-left px-4 py-2 rounded-md flex items-center gap-3 ${
              isCategoryActive(category) 
                ? `bg-[#003570] text-white font-medium` 
                : `hover:bg-gray-100 font-medium ${category.color}`
            }`}
            onClick={() => handleItemClick(category.id)}
          >
            <category.icon size={18} />
            <span className="text-sm">{category.label}</span>
          </button>
          
          {/* Subcategories */}
          {category.subcategories && isCategoryActive(category) && (
            <div className="ml-6 border-l border-gray-200 pl-2 space-y-1">
              {category.subcategories.map(subcategory => (
                <div key={subcategory.id}>
                  <button
                    className={`w-full text-left px-4 py-2 rounded-md flex items-center gap-3 ${
                      isSubcategoryActive(subcategory) 
                        ? 'bg-[#0035704d] text-[#003570] font-medium' 
                        : 'hover:bg-gray-100'
                    }`}
                    onClick={() => handleItemClick(subcategory.id)}
                  >
                    <subcategory.icon size={16} />
                    <span className="text-sm">{subcategory.label}</span>
                  </button>
                  
                  {/* Sub-items of subcategories */}
                  {subcategory.subItems && isSubcategoryActive(subcategory) && (
                    <div className="ml-6 border-l border-gray-200 pl-2 space-y-1">
                      {subcategory.subItems.map(item => (
                        <button
                          key={item.id}
                          className={`w-full text-left px-4 py-2 rounded-md flex items-center gap-3 ${
                            activeSection === item.id 
                              ? 'bg-[#0035701a] text-[#003570] font-medium' 
                              : 'hover:bg-gray-100'
                          }`}
                          onClick={() => handleItemClick(item.id)}
                        >
                          <item.icon size={14} />
                          <span className="text-sm">{item.label}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default SettingsSidebar;
