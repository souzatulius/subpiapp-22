
import React from 'react';
import { Label } from '@/components/ui/label';
import { CardFormPreviewProps } from './types';
import { getColorClass, getIconComponentById, dashboardPages } from './utils';
import { useFormContext } from 'react-hook-form';
import { FormSchema } from './types';

const CardFormPreview: React.FC<CardFormPreviewProps> = ({
  title,
  iconId,
  color,
  width,
  height
}) => {
  const form = useFormContext<FormSchema>();
  
  // Create a larger version of the icon for the preview
  const iconComponent = React.cloneElement(
    getIconComponentById(iconId) as React.ReactElement,
    { className: 'h-12 w-12' }
  );

  return (
    <div className="space-y-2">
      <Label>Preview</Label>
      <div className="flex justify-center items-center">
        <div 
          className={`transition-all duration-300 border rounded-xl shadow-md p-4 flex flex-col items-center justify-center overflow-hidden
            ${height === '2' ? 'h-[180px]' : 'h-[120px]'} 
            ${width === '100' ? 'w-full' : 
              width === '75' ? 'w-[75%]' : 
              width === '50' ? 'w-[180px]' : 'w-[120px]'} 
            ${getColorClass(color)}`}
        >
          <div className="mb-3">
            {iconComponent}
          </div>
          <h3 className="text-lg font-medium text-center line-clamp-2">{title || 'Título do Card'}</h3>
        </div>
      </div>
      
      <div className="text-xs text-gray-500 text-center mt-2">
        <p>Tamanho: {width}% {height === '2' ? '(altura dupla)' : ''}</p>
        <p className="mt-1">Redirecionamento: {dashboardPages.find(page => page.value === form?.watch('path'))?.label || 'Dashboard'}</p>
      </div>
    </div>
  );
};

export default CardFormPreview;
