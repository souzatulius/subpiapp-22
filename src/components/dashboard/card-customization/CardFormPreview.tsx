
import React from 'react';
import { Label } from '@/components/ui/label';
import { CardFormPreviewProps } from './types';
import { getColorClass, getIconComponentById } from './utils';

const CardFormPreview: React.FC<CardFormPreviewProps> = ({
  title,
  iconId,
  color,
  width,
  height
}) => {
  return (
    <div className="border-t pt-4">
      <Label>Preview</Label>
      <div className="mt-2 flex justify-center">
        <div 
          className={`cursor-pointer transition-all duration-300 border rounded-xl shadow-md p-6 flex flex-col items-center justify-center overflow-hidden
            ${height === '2' ? 'h-[220px]' : 'h-[140px]'} 
            ${width === '100' ? 'w-[280px]' : 
              width === '75' ? 'w-[240px]' : 
              width === '50' ? 'w-[180px]' : 'w-[120px]'} 
            ${getColorClass(color)}`}
        >
          <div className="mb-4">
            {getIconComponentById(iconId)}
          </div>
          <h3 className="text-lg font-medium text-center">{title || 'Título do Card'}</h3>
        </div>
      </div>
    </div>
  );
};

export default CardFormPreview;
