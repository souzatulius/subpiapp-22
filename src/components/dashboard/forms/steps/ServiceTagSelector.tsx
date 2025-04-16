
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
          <Badge
            key={service.id}
            variant={isSelected ? 'default' : 'outline'}
            className={cn(
              'px-3 py-1 cursor-pointer hover:bg-orange-50 hover:text-orange-700 transition-colors rounded-xl',
              isSelected
                ? 'bg-orange-500 hover:bg-orange-600 text-white'
                : 'bg-white border-gray-200 text-gray-700',
              className
            )}
            onClick={() => onServiceSelect(service.id)}
          >
            {service.descricao}
          </Badge>
        );
      })}
    </div>
  );
};

export default ServiceTagSelector;
