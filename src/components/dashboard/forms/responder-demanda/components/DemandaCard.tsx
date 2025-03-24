
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Demanda } from '../types';
import { formatPrioridade, calcularTempoRestante, formatarData } from '../utils/formatters';

interface DemandaCardProps {
  demanda: Demanda;
  selected: boolean;
  onClick: () => void;
  className?: string;
}

const DemandaCard: React.FC<DemandaCardProps> = ({ demanda, selected, onClick, className }) => {
  return (
    <Card 
      className={`cursor-pointer transition-all hover:shadow-md ${
        selected ? 'border-2 border-[#003570]' : 'border border-gray-200'
      } ${className}`}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-medium">{demanda.titulo}</h3>
          <div className="flex space-x-2">
            {formatPrioridade(demanda.prioridade)}
          </div>
        </div>
        
        <div className="text-sm text-gray-500 mb-2">
          <span className="font-medium">Área:</span>{' '}
          {demanda.areas_coordenacao?.descricao || 'Não informada'}
        </div>
        
        <div className="text-sm text-gray-500 mb-2">
          <span className="font-medium">Origem:</span>{' '}
          {demanda.origens_demandas?.descricao || 'Não informada'}
        </div>
        
        <div className="flex justify-between items-center text-xs text-gray-500 mt-3">
          <div>
            {demanda.prazo_resposta && calcularTempoRestante(demanda.prazo_resposta)}
          </div>
          <div>
            {demanda.prazo_resposta && formatarData(demanda.prazo_resposta)}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DemandaCard;
