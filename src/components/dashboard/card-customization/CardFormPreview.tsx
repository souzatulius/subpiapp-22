
import React from 'react';
import { CardFormPreviewProps } from './types';
import { getColorClass, getIconComponentById, dashboardPages } from './utils';
import { useFormContext } from 'react-hook-form';
import { FormSchema } from './types';
import DynamicDataCard from '@/components/dashboard/DynamicDataCard';
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
  
  // Get the icon component as a React element
  const IconComponent = getIconComponentById(iconId);
  
  // Generate text color based on background
  const getTextColor = (bgColor: string) => {
    const darkColors = ['blue-dark', 'gray-dark', 'orange-light', 'gray-ultra-light'];
    return darkColors.includes(bgColor) ? 'text-white' : 'text-gray-800';
  };

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
        {cardType === 'data_dynamic' ? (
          <div className="w-[200px] h-[200px]">
            <DynamicDataCard 
              title={title || 'Título do Card'}
              icon={IconComponent}
              color={color as CardColor}
              dataSourceKey={dataSourceKey || 'no_data'}
              coordenacaoId="preview"
              usuarioId="preview"
              highlight={false}
            />
          </div>
        ) : (
          <div 
            className={`transition-all duration-300 border rounded-xl shadow-md p-4 flex flex-col items-center justify-center overflow-hidden h-[200px] w-[200px] ${getColorClass(color as CardColor)}`}
          >
            <div className="mb-3">
              {/* Make sure we're rendering the icon properly */}
              {IconComponent}
            </div>
            <h3 className={`text-lg font-medium text-center line-clamp-2 ${getTextColor(color)}`}>
              {title || 'Título do Card'}
            </h3>
          </div>
        )}
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
