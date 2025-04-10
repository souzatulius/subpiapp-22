
import React from 'react';
import * as LucideIcons from 'lucide-react';
import { CardColor } from '@/types/dashboard';

interface CardPreviewProps {
  title: string;
  subtitle?: string;
  iconId: string;
  color: CardColor;
}

const CardPreview: React.FC<CardPreviewProps> = ({ title, subtitle, iconId, color }) => {
  const renderIconComponent = (iconId: string) => {
    const IconComponent = (LucideIcons as any)[iconId];
    if (!IconComponent) return null;
    return <IconComponent className="h-6 w-6" />;
  };

  return (
    <div className="mt-2 border p-4 rounded-md">
      <div className={`w-full h-40 rounded-xl shadow-md overflow-hidden ${color ? `bg-${color}` : 'bg-blue-700'}`}>
        <div className="relative h-full flex flex-col items-center justify-center text-center py-4">
          <div className="text-white mb-2">
            {renderIconComponent(iconId)}
          </div>
          <div>
            <h3 className="font-semibold text-white text-xl">{title || "Título do Card"}</h3>
            {subtitle && <p className="text-white text-sm mt-1 opacity-80">{subtitle}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardPreview;
