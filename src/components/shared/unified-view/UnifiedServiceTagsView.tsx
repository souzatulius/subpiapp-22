
import React from 'react';
import { LabelBadge } from '@/components/ui/label-badge';

interface UnifiedServiceTagsViewProps {
  services: { id: string; descricao: string }[];
  selectedServiceId?: string;
  onServiceSelect?: (id: string) => void;
  className?: string;
  readOnly?: boolean;
  variant?: 'theme' | 'priority' | 'status' | 'area' | 'default';
}

const UnifiedServiceTagsView: React.FC<UnifiedServiceTagsViewProps> = ({
  services,
  selectedServiceId,
  onServiceSelect,
  className = '',
  readOnly = false,
  variant = 'theme'
}) => {
  if (!services.length) {
    return <p className="text-gray-500 italic">Nenhum serviço disponível</p>;
  }

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {services.map((service) => (
        <div 
          key={service.id}
          onClick={() => !readOnly && onServiceSelect && onServiceSelect(service.id)}
          className={`transition-all duration-200 transform ${!readOnly && onServiceSelect ? 'cursor-pointer hover:scale-105' : ''} ${
            selectedServiceId === service.id ? 'ring-2 ring-blue-500 ring-offset-1' : ''
          }`}
        >
          <LabelBadge 
            label="Serviço"
            value={service.descricao}
            variant={variant}
            size="md"
            className={`${
              selectedServiceId === service.id ? 'bg-blue-100 border-blue-300' : ''
            }`}
          />
        </div>
      ))}
    </div>
  );
};

export default UnifiedServiceTagsView;
