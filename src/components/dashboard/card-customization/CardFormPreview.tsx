
import React, { useEffect, useState } from 'react';
import { CardFormPreviewProps } from './types';
import { getColorClass, getIconComponentById, dashboardPages } from './utils';
import { useFormContext } from 'react-hook-form';
import { FormSchema } from './types';
import { CardColor } from '@/types/dashboard';

const CardFormPreview: React.FC<CardFormPreviewProps> = ({
  title,
  iconId,
  color,
  width,
  height
}) => {
  const form = useFormContext<FormSchema>();
  const cardType = form.watch('type');
  const dataSourceKey = form.watch('dataSourceKey');
  const [dynamicColor, setDynamicColor] = useState<CardColor>(color as CardColor);
  
  // Watch for cardType changes to adjust color automatically for data cards
  useEffect(() => {
    if (cardType === 'data_dynamic') {
      // Use a blue shade for data cards by default
      setDynamicColor('blue-dark');
    } else {
      // Reset to selected color for standard cards
      setDynamicColor(color as CardColor);
    }
  }, [cardType, color]);
  
  // Get the icon component properly
  const IconComponent = getIconComponentById(iconId);
  
  // Generate text color based on background
  const getTextColor = (bgColor: string) => {
    const darkColors = ['blue-dark', 'gray-dark'];
    return darkColors.includes(bgColor) ? 'text-white' : 'text-gray-800';
  };

  // Preview for welcome card
  if (cardType === 'welcome_card') {
    const gradient = form.watch('customProperties.gradient') || 'bg-gradient-to-r from-blue-600 to-blue-800';
    const description = form.watch('customProperties.description') || 'Descrição do card de boas-vindas';
    
    return (
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Preview do Card</h3>
        <div className="flex items-center justify-center">
          <div 
            className={`w-[200px] h-[120px] rounded-xl shadow-md p-4 ${gradient} text-white`}
          >
            <div className="flex items-center mb-2">
              {IconComponent}
              <h3 className="ml-2 font-bold">{title || 'Título do Card'}</h3>
            </div>
            <p className="text-xs line-clamp-3">{description}</p>
          </div>
        </div>
      </div>
    );
  }

  // Find data source label
  const getDataSourceLabel = () => {
    const dataSources = [
      { value: 'pendencias_por_coordenacao', label: 'Pendências da Coordenação' },
      { value: 'notas_aguardando_aprovacao', label: 'Notas aguardando aprovação' },
      { value: 'respostas_atrasadas', label: 'Respostas atrasadas' },
      { value: 'demandas_aguardando_nota', label: 'Demandas aguardando nota' },
      { value: 'ultimas_acoes_coordenacao', label: 'Últimas ações da coordenação' },
      { value: 'comunicados_por_cargo', label: 'Comunicados por cargo' }
    ];
    
    const source = dataSources.find(ds => ds.value === dataSourceKey);
    return source ? source.label : 'Selecione uma fonte de dados';
  };

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-gray-700 mb-3">Preview do Card</h3>
      <div className="flex items-center justify-center">
        <div 
          className={`transition-all duration-300 border rounded-xl shadow-md p-4 flex flex-col items-center justify-center overflow-hidden h-[200px] w-[200px] ${getColorClass(dynamicColor)}`}
        >
          <div className="mb-3">
            {IconComponent}
          </div>
          <h3 className={`text-lg font-medium text-center line-clamp-2 ${getTextColor(color)}`}>
            {title || 'Título do Card'}
          </h3>
          
          {cardType === 'data_dynamic' && (
            <div className="mt-2 text-xs text-center opacity-75">
              {getDataSourceLabel()}
            </div>
          )}
        </div>
      </div>
      
      <div className="text-xs text-gray-500 text-center mt-4">
        {cardType === 'data_dynamic' ? (
          <p className="mt-1">
            Fonte de dados: {getDataSourceLabel()}
          </p>
        ) : (
          <p className="mt-1">
            Redirecionamento: {dashboardPages.find(page => page.value === form?.watch('path'))?.label || 'Dashboard'}
          </p>
        )}
      </div>
    </div>
  );
};

export default CardFormPreview;
