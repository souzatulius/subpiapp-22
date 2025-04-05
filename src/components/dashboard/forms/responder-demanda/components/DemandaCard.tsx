
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Demanda } from '../types';
import { formatarData } from '../utils/formatters';
import { DemandaStatusBadge } from '@/components/ui/status-badge';
import { formatPriority, getPriorityColor } from '@/utils/priorityUtils';
import { AlertCircle, Clock } from 'lucide-react';

interface DemandaCardProps {
  demanda: Demanda;
  selected: boolean;
  onClick: () => void;
  className?: string;
}

const DemandaCard: React.FC<DemandaCardProps> = ({ demanda, selected, onClick, className }) => {
  const renderTempoRestante = () => {
    if (!demanda.prazo_resposta) return null;
    
    const diffTime = new Date(demanda.prazo_resposta).getTime() - new Date().getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    let iconName, iconClassName, label, className;
    
    if (diffDays < 0) {
      iconName = 'AlertCircle';
      iconClassName = 'text-orange-500';
      label = `Atrasada há ${Math.abs(diffDays)} dia(s)`;
      className = 'text-orange-600 font-medium flex items-center gap-1';
    } else if (diffDays === 0) {
      iconName = 'AlertCircle';
      iconClassName = 'text-orange-500';
      label = 'Vence hoje';
      className = 'text-orange-600 font-medium flex items-center gap-1';
    } else if (diffDays <= 2) {
      iconName = 'Clock';
      iconClassName = 'text-orange-500';
      label = `Vence em ${diffDays} dia(s)`;
      className = 'text-orange-600 font-medium flex items-center gap-1';
    } else {
      iconName = 'Clock';
      iconClassName = 'text-green-500';
      label = `Vence em ${diffDays} dia(s)`;
      className = 'text-green-600 font-medium flex items-center gap-1';
    }
    
    const Icon = iconName === 'AlertCircle' ? AlertCircle : Clock;
    
    return (
      <span className={className}>
        <Icon className={`h-3.5 w-3.5 ${iconClassName}`} />
        <span>{label}</span>
      </span>
    );
  };

  // Updated to use orange for "alta" priority
  const getPriorityColorCustom = (priority: string) => {
    switch (priority) {
      case 'alta':
        return {
          bg: 'bg-orange-100',
          text: 'text-orange-800',
          border: 'border-orange-200'
        };
      case 'media':
        return {
          bg: 'bg-yellow-100',
          text: 'text-yellow-800',
          border: 'border-yellow-200'
        };
      case 'baixa':
      default:
        return {
          bg: 'bg-green-100',
          text: 'text-green-800',
          border: 'border-green-200'
        };
    }
  };

  const priorityColors = getPriorityColorCustom(demanda.prioridade);

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
            <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${priorityColors.bg} ${priorityColors.text} border ${priorityColors.border}`}>
              {formatPriority(demanda.prioridade)}
            </span>
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
            {demanda.prazo_resposta && renderTempoRestante()}
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
