
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface ServiceTagSelectorProps {
  services: { id: string; descricao: string }[];
  selectedServiceId: string;
  onServiceSelect: (serviceId: string) => void;
  className?: string;
  variant?: 'default' | 'theme';
}

const ServiceTagSelector: React.FC<ServiceTagSelectorProps> = ({
  services,
  selectedServiceId,
  onServiceSelect,
  className,
  variant = 'default'
}) => {
  if (!services || services.length === 0) {
    return null;
  }

  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {services.map((service) => {
        const isSelected = service.id === selectedServiceId;
        
        return (
          <div
            key={service.id}
            className={cn(
              'px-3 py-2 cursor-pointer rounded-xl text-base font-medium transition-colors',
              isSelected
                ? 'bg-orange-500 hover:bg-orange-600 text-white border border-orange-500'
                : 'bg-white hover:bg-orange-50 hover:text-orange-700 text-gray-700 border border-gray-200',
              className
            )}
            onClick={() => onServiceSelect(service.id)}
          >
            {service.descricao}
          </div>
        );
      })}
    </div>
  );
};

export default ServiceTagSelector;
