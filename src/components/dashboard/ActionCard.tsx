// src/components/dashboard/ActionCard.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getIconComponentFromId } from '@/hooks/dashboard/defaultCards';
import { CardColor, CardWidth, CardHeight } from '@/types/dashboard';
import { Badge } from '@/components/ui/badge';
import { Edit2, EyeOff } from 'lucide-react';

interface ActionCardProps {
  id: string;
  title: string;
  subtitle?: string;
  path: string;
  color: CardColor;
  iconId: string;
  isDraggable?: boolean;
  isEditing?: boolean; // novo: controla a exibição dos controles de edição
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onHide?: (id: string) => void;
  isCustom?: boolean;
  iconSize?: 'sm' | 'md' | 'lg' | 'xl';
  hasBadge?: boolean;
  badgeValue?: string;
  isMobileView?: boolean;
  width?: CardWidth;
  height?: CardHeight;
  type?: string;
}

const ActionCard: React.FC<ActionCardProps> = ({
  id,
  title,
  subtitle,
  path,
  color,
  iconId,
  isDraggable = false,
  isEditing = false,
  onEdit,
  onDelete,
  onHide,
  isCustom = false,
  iconSize = 'lg',
  hasBadge = false,
  badgeValue = '0',
  isMobileView = false,
  width,
  height,
  type,
}) => {
  const navigate = useNavigate();
  const IconComponent = getIconComponentFromId(iconId);

  // Função para determinar se a cor é “escura”
  const isDarkColor = (colorValue: CardColor): boolean => {
    const normalizedColor = colorValue.replace('grey-', 'gray-').replace('grey', 'gray') as CardColor;
    const darkColors = [
      'blue-dark', 'blue-700', 'blue-900', 'blue-960',
      'gray-dark', 'gray-800', 'gray-950',
      'orange-400', 'orange-500', 'orange-600',
      'gray-400', 'lime-500'
    ];
    return darkColors.includes(normalizedColor);
  };

  // Gera a classe CSS do card com base na cor
  const getCardClass = () => {
    const baseClasses = "relative h-full rounded-xl shadow transition-all duration-300 p-6 flex flex-col justify-between group";
    const normalizedColor = color.replace('grey-', 'gray-') as CardColor;
    switch (normalizedColor) {
      case 'blue': return `${baseClasses} bg-blue-50 border border-blue-100 hover:shadow-md hover:border-blue-300`;
      case 'blue-light': return `${baseClasses} bg-blue-50 border border-blue-100 hover:shadow-md hover:border-blue-300`;
      case 'blue-dark': return `${baseClasses} bg-blue-700 border border-blue-800 text-white hover:shadow-md hover:border-blue-600`;
      case 'blue-700': return `${baseClasses} bg-blue-700 border border-blue-800 text-white hover:shadow-md hover:border-blue-600`;
      case 'blue-900': return `${baseClasses} bg-blue-900 border border-blue-950 text-white hover:shadow-md hover:border-blue-800`;
      case 'blue-960': return `${baseClasses} bg-blue-900 border border-blue-950 text-white hover:shadow-md hover:border-blue-800`;
      case 'green': return `${baseClasses} bg-green-50 border border-green-100 hover:shadow-md hover:border-green-300`;
      case 'green-light': return `${baseClasses} bg-green-50 border border-green-100 hover:shadow-md hover:border-green-300`;
      case 'orange': return `${baseClasses} bg-orange-50 border border-orange-100 hover:shadow-md hover:border-orange-300`;
      case 'orange-light': return `${baseClasses} bg-orange-50 border border-orange-100 hover:shadow-md hover:border-orange-300`;
      case 'orange-400': return `${baseClasses} bg-orange-400 border border-orange-500 text-white hover:shadow-md hover:border-orange-300`;
      case 'orange-500': return `${baseClasses} bg-orange-500 border border-orange-600 text-white hover:shadow-md hover:border-orange-400`;
      case 'orange-600': return `${baseClasses} bg-orange-600 border border-orange-700 text-white hover:shadow-md hover:border-orange-500`;
      case 'gray-light': return `${baseClasses} bg-gray-50 border border-gray-100 hover:shadow-md hover:border-gray-300`;
      case 'gray-dark': return `${baseClasses} bg-gray-700 border border-gray-800 text-white hover:shadow-md hover:border-gray-600`;
      case 'gray-ultra-light': return `${baseClasses} bg-gray-50 border border-gray-100 hover:shadow-md hover:border-gray-300`;
      case 'gray-200': return `${baseClasses} bg-gray-200 border border-gray-300 hover:shadow-md hover:border-gray-400`;
      case 'gray-400': return `${baseClasses} bg-gray-400 border border-gray-500 text-white hover:shadow-md hover:border-gray-300`;
      case 'gray-800': return `${baseClasses} bg-gray-800 border border-gray-900 text-white hover:shadow-md hover:border-gray-700`;
      case 'gray-950': return `${baseClasses} bg-gray-900 border border-gray-950 text-white hover:shadow-md hover:border-gray-800`;
      case 'lime': return `${baseClasses} bg-lime-100 border border-lime-200 hover:shadow-md hover:border-lime-300`;
      case 'lime-400': return `${baseClasses} bg-lime-400 border border-lime-500 hover:shadow-md hover:border-lime-300`;
      case 'lime-500': return `${baseClasses} bg-lime-500 border border-lime-600 text-white hover:shadow-md hover:border-lime-400`;
      case 'neutral-200': return `${baseClasses} bg-neutral-200 border border-neutral-300 hover:shadow-md hover:border-neutral-400`;
      case 'purple-light': return `${baseClasses} bg-purple-50 border border-purple-100 hover:shadow-md hover:border-purple-300`;
      default: return `${baseClasses} bg-blue-50 border border-blue-100 hover:shadow-md hover:border-blue-300`;
    }
  };

  // Tamanho do ícone
  const getIconSize = () => {
    switch (iconSize) {
      case 'sm': return 'h-6 w-6';
      case 'md': return 'h-8 w-8';
      case 'lg': return 'h-10 w-10';
      case 'xl': return 'h-12 w-12';
      default: return 'h-10 w-10';
    }
  };

  // Tratamento de clique: navega se não estiver sendo arrastado
  const handleCardClick = (e: React.MouseEvent) => {
    if (!isDraggable && path) {
      e.stopPropagation();
      navigate(path);
    }
  };

  // Define a cor do ícone com base no fundo
  const getIconColor = () => {
    if (isDarkColor(color)) {
      return 'text-white/80 group-hover:text-white';
    }
    if (color.startsWith('blue')) return 'text-blue-600 group-hover:text-blue-700';
    if (color.startsWith('green')) return 'text-green-600 group-hover:text-green-700';
    if (color.startsWith('orange')) return 'text-orange-600 group-hover:text-orange-700';
    if (color.startsWith('gray') || color.startsWith('grey')) return 'text-gray-600 group-hover:text-gray-700';
    if (color.startsWith('lime')) return 'text-lime-600 group-hover:text-lime-700';
    if (color.startsWith('purple')) return 'text-purple-600 group-hover:text-purple-700';
    if (color.startsWith('neutral')) return 'text-neutral-600 group-hover:text-neutral-700';
    return 'text-gray-600 group-hover:text-gray-700';
  };

  return (
    <div 
      className={`${getCardClass()} cursor-pointer`} 
      onClick={handleCardClick}
      data-card-id={id}
    >
      {/* Controles de edição (apenas no modo edição) */}
      {isEditing && (
        <div className="absolute top-2 right-2 flex space-x-2 z-10">
          {onEdit && (
            <button 
              onClick={(e) => { e.stopPropagation(); onEdit(id); }}
              className="p-1 bg-white rounded shadow hover:bg-gray-100"
              title="Editar"
            >
              <Edit2 className="h-4 w-4 text-gray-700" />
            </button>
          )}
          {onHide && (
            <button 
              onClick={(e) => { e.stopPropagation(); onHide(id); }}
              className="p-1 bg-white rounded shadow hover:bg-gray-100"
              title="Ocultar"
            >
              <EyeOff className="h-4 w-4 text-gray-700" />
            </button>
          )}
        </div>
      )}
      <div className="flex justify-between items-start">
        <div className={`${getIconColor()} ${getIconSize()}`}>
          <IconComponent />
        </div>
        {hasBadge && badgeValue && badgeValue !== '0' && (
          <Badge variant="destructive" className="ml-2">
            {badgeValue}
          </Badge>
        )}
      </div>
      <div className="mt-3">
        <h3 className={`font-semibold text-md ${isDarkColor(color) ? 'text-white' : ''}`}>
          {title}
        </h3>
        {subtitle && (
          <p className={`text-sm mt-1 ${isDarkColor(color) ? 'text-white/80' : 'text-gray-600'}`}>
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
};

export default ActionCard;
