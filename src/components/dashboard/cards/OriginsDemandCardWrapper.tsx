
import React from 'react';
import { ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import OriginsDemandChartCompact from './OriginsDemandChartCompact';

interface OriginsDemandCardWrapperProps {
  className?: string;
}

const OriginsDemandCardWrapper: React.FC<OriginsDemandCardWrapperProps> = ({ 
  className = '' 
}) => {
  const navigate = useNavigate();

  const handleViewMoreClick = () => {
    navigate('/dashboard/comunicacao/relatorios');
  };

  return (
    <div className={`w-full h-full flex flex-col bg-gray-50 rounded-xl p-4 ${className}`}>
      <div className="mb-2">
        <h3 className="font-semibold text-lg text-gray-800">Atividades em Andamento</h3>
        <p className="text-sm text-gray-600">Demandas da semana por área técnica</p>
      </div>
      
      <div className="flex-grow flex items-center justify-center">
        <OriginsDemandChartCompact className="w-full max-h-full" />
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
