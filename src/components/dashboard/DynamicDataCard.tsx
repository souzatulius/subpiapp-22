
import React from 'react';
import { useDashboardData } from '@/hooks/dashboard/useDashboardData';
import { Skeleton } from '@/components/ui/skeleton';
import { CardColor, DataSourceKey } from '@/types/dashboard';

interface DynamicDataCardProps {
  title: string;
  icon: React.ReactNode;
  color: CardColor;
  dataSourceKey: DataSourceKey;
  coordenacaoId: string;
  usuarioId: string;
  highlight?: boolean;
  valueFormatter?: (value: number) => string;
}

const DynamicDataCard: React.FC<DynamicDataCardProps> = ({
  title,
  icon,
  color,
  dataSourceKey,
  coordenacaoId,
  usuarioId,
  highlight = false,
  valueFormatter = (value) => `${value} itens`
}) => {
  const { data, loading } = useDashboardData(
    dataSourceKey,
    coordenacaoId,
    usuarioId
  );
  
  const borderClass = highlight ? 'border-2 border-orange-500' : 'border border-gray-200';
  const shadowClass = highlight ? 'shadow-lg' : 'shadow-md';

  // Get the background color based on the color prop
  const getBgColor = (): string => {
    switch (color) {
      case 'blue-vivid': return 'bg-[#0066FF]'; // Azul Vivo
      case 'blue-light': return 'bg-[#66B2FF]'; // Azul Claro
      case 'blue-dark': return 'bg-[#1D4ED8]'; // Azul Escuro
      case 'green-neon': return 'bg-[#66FF66]'; // Verde Neon
      case 'green-dark': return 'bg-[#00CC00]'; // Verde Escuro
      case 'gray-light': return 'bg-[#F5F5F5]'; // Cinza Claro
      case 'gray-lighter': return 'bg-[#FAFAFA]'; // Cinza Mais Claro
      case 'gray-medium': return 'bg-[#D4D4D4]'; // Cinza Médio
      case 'orange-dark': return 'bg-[#F25C05]'; // Laranja Escuro
      case 'orange-light': return 'bg-[#F89E66]'; // Laranja Claro
      default: return 'bg-[#0066FF]'; // Default to Azul Vivo
    }
  };

  // Get text color based on background color
  const getTextColor = (): string => {
    switch (color) {
      case 'gray-light':
      case 'gray-lighter':
      case 'gray-medium':
      case 'green-neon':
      case 'green-dark':
        return 'text-gray-800'; // Dark text for light backgrounds
      default:
        return 'text-white'; // White text for dark backgrounds
    }
  };

  const bgColorClass = getBgColor();
  const textColorClass = getTextColor();

  console.log(`DynamicDataCard: ${title} - dataSourceKey: ${dataSourceKey}, loading: ${loading}, data:`, data);

  return (
    <div 
      className={`w-full h-full rounded-md ${shadowClass} transition-all hover:shadow-lg ${borderClass} flex flex-col ${bgColorClass}`}
    >
      <div className="flex items-center gap-2 p-4 pb-2">
        <div className={textColorClass}>{icon}</div>
        <h4 className={`text-md font-semibold ${textColorClass}`}>{title}</h4>
      </div>
      
      <div className="flex-1 flex items-center p-4 pt-0">
        {loading ? (
          <Skeleton className="h-7 w-24 bg-white/30" />
        ) : (
          <p className={`text-2xl font-bold ${textColorClass}`}>
            {Array.isArray(data) ? valueFormatter(data?.length ?? 0) : valueFormatter(0)}
          </p>
        )}
      </div>
    </div>
  );
};

export default DynamicDataCard;
