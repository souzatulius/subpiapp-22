
import React from 'react';
import { CardColor } from '@/types/dashboard';
import { getIconComponentFromId } from '@/hooks/dashboard/defaultCards';

interface CardPreviewProps {
  title: string;
  subtitle?: string;
  color: CardColor;
  iconId: string;
  width?: string;
  height?: string;
}

const getColorClasses = (color: CardColor): string => {
  switch (color) {
    case 'blue': return 'bg-blue-500 text-white';
    case 'green': return 'bg-green-500 text-white';
    case 'orange': return 'bg-orange-500 text-white';
    case 'gray-light': return 'bg-gray-200 text-gray-800';
    case 'gray-dark': return 'bg-gray-700 text-white';
    case 'blue-dark': return 'bg-blue-700 text-white';
    case 'orange-light': return 'bg-orange-300 text-gray-800';
    case 'gray-ultra-light': return 'bg-gray-100 text-gray-800';
    case 'lime': return 'bg-lime-500 text-white';
    case 'orange-600': return 'bg-orange-600 text-white';
    case 'blue-light': return 'bg-blue-300 text-gray-800';
    case 'green-light': return 'bg-green-300 text-gray-800';
    case 'purple-light': return 'bg-purple-300 text-gray-800';
    default: return 'bg-blue-500 text-white';
  }
};

const getWidthClass = (width?: string): string => {
  switch (width) {
    case '25': return 'w-1/4';
    case '33': return 'w-1/3';
    case '50': return 'w-1/2';
    case '75': return 'w-3/4';
    case '100': return 'w-full';
    default: return 'w-full';
  }
};

const getHeightClass = (height?: string): string => {
  switch (height) {
    case '1': return 'h-[160px]'; // Ajustado para 160px
    case '2': return 'h-[320px]';
    default: return 'h-[160px]';
  }
};

const CardPreview: React.FC<CardPreviewProps> = ({ title, subtitle, color, iconId, width, height }) => {
  const colorClasses = getColorClasses(color);
  const IconComponent = getIconComponentFromId(iconId);
  const widthClass = getWidthClass(width);
  const heightClass = getHeightClass(height);

  return (
    <div className="mt-4">
      <h3 className="text-sm font-medium mb-2">Pré-visualização</h3>
      <div className={`${widthClass} mx-auto`}>
        <div className={`rounded-lg p-4 ${colorClasses} flex flex-col items-center justify-center text-center ${heightClass}`}>
          <div className="mb-2">
            {IconComponent && <IconComponent className="h-6 w-6" />}
          </div>
          <h3 className="text-sm font-semibold">{title || 'Título do Card'}</h3>
          {subtitle && <p className="text-xs mt-1 opacity-90">{subtitle}</p>}
        </div>
      </div>
    </div>
  );
};

export default CardPreview;
