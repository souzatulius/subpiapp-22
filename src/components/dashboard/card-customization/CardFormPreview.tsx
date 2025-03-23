
import React from 'react';
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
  
  // Get the icon component as a React element
  const IconComponent = getIconComponentById(iconId);
  
  // Generate text color based on background
  const getTextColor = (bgColor: string) => {
    const darkColors = ['blue-dark', 'gray-dark', 'orange-light', 'gray-ultra-light'];
    return darkColors.includes(color) ? 'text-white' : 'text-gray-800';
  };

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-gray-700 mb-3">Preview do Card</h3>
      <div className="flex items-center justify-center">
        <div 
          className={`transition-all duration-300 border rounded-xl shadow-md p-4 flex flex-col items-center justify-center overflow-hidden h-[200px] w-[200px] ${getColorClass(color)}`}
        >
          <div className="mb-3">
            {React.isValidElement(IconComponent) ? (
              React.cloneElement(IconComponent as React.ReactElement<any>, { 
                className: `h-16 w-16 ${getTextColor(color)}`
              })
            ) : null}
          </div>
          <h3 className={`text-lg font-medium text-center line-clamp-2 ${getTextColor(color)}`}>
            {title || 'Título do Card'}
          </h3>
        </div>
      </div>
      
      <div className="text-xs text-gray-500 text-center mt-4">
        <p className="mt-1">
          Redirecionamento: {dashboardPages.find(page => page.value === form?.watch('path'))?.label || 'Dashboard'}
        </p>
      </div>
    </div>
  );
};

export default CardFormPreview;
