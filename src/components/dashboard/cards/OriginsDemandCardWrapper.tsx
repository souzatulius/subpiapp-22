
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
    <div className={`${className} ${bgColorClass} rounded-xl p-3 flex flex-col h-full`}>
      <div className="flex justify-between items-center mb-2">
        <div>
          <h3 className="font-semibold text-lg">{title}</h3>
          <p className="text-sm text-gray-600">{subtitle}</p>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          className="flex items-center text-xs"
          onClick={handleViewMoreClick}
        >
          Ver mais <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
      <div className="flex-grow">
        <DemandasChart />
      </div>
    </div>
  );
};

export default OriginsDemandCardWrapper;
