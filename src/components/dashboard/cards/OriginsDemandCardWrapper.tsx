
import React from 'react';
import { ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { getColorClass } from '@/components/dashboard/card-customization/utils';
import DemandasChart from './DemandasChart';

interface OriginsDemandCardWrapperProps {
  className?: string;
  color?: string;
  title?: string;
  subtitle?: string;
}

const OriginsDemandCardWrapper: React.FC<OriginsDemandCardWrapperProps> = ({ 
  className = '',
  color = 'gray-light',
  title = 'Atividades em Andamento',
  subtitle = 'Demandas da semana por área técnica'
}) => {
  const navigate = useNavigate();

  const handleViewMoreClick = () => {
    navigate('/dashboard/comunicacao/relatorios');
  };

  const bgColorClass = getColorClass(color);

  return (
    <div className={`w-full h-full flex flex-col ${bgColorClass} rounded-xl border border-gray-200 shadow-md hover:shadow-lg transition-all ${className}`}>
      <div className="mb-2">
        <h3 className="font-semibold text-lg">{title}</h3>
        {subtitle && <p className="text-sm opacity-80">{subtitle}</p>}
      </div>
      
      <div className="flex-grow flex items-center justify-center">
        <div className="w-full h-full px-2">
          <DemandasChart />
        </div>
      </div>
      
      <div className="mt-3 flex justify-end">
        <Button 
          onClick={handleViewMoreClick}
          variant="outline" 
          size="sm"
          className="rounded-full text-sm flex items-center gap-1"
        >
          Ver outros gráficos
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default OriginsDemandCardWrapper;
