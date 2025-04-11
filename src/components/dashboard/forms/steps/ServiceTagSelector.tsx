
import React from 'react';
import { LabelBadge } from '@/components/ui/label-badge';

interface ServiceTagSelectorProps {
  services: { id: string; descricao: string }[];
  selectedServiceId: string;
  onServiceSelect: (id: string) => void;
  className?: string;
}

const ServiceTagSelector: React.FC<ServiceTagSelectorProps> = ({
  services,
  selectedServiceId,
  onServiceSelect,
  className = '',
}) => {
  if (!services.length) {
    return <p className="text-gray-500 italic">Nenhum serviço disponível para este tema</p>;
  }

  return (
    <div className={`flex flex-wrap gap-2 mt-3 ${className}`}>
      {services.map((service) => (
        <div 
          key={service.id}
          onClick={() => onServiceSelect(service.id)}
          className={`cursor-pointer transition-all duration-200 transform hover:scale-105 ${
            selectedServiceId === service.id ? 'ring-2 ring-blue-500 ring-offset-1' : ''
          }`}
        >
          <LabelBadge 
            label="Serviço"
            value={service.descricao}
            variant="theme"
            size="lg"
            className={`py-2 px-4 ${
              selectedServiceId === service.id ? 'bg-blue-100 border-blue-300' : ''
            }`}
          />
        </div>
      ))}
    </div>
  );
};

export default ServiceTagSelector;
