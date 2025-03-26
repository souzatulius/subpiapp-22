
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import ServiceSearch from '@/components/dashboard/forms/steps/identification/ServiceSearch';

interface ServicoSelectorProps {
  selectedServicoId: string;
  servicos: any[];
  servicosLoading: boolean;
  onServicoChange: (value: string) => void;
}

const ServicoSelector: React.FC<ServicoSelectorProps> = ({
  selectedServicoId,
  servicos,
  servicosLoading,
  onServicoChange
}) => {
  const [serviceSearch, setServiceSearch] = useState('');
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  
  // Find the selected service
  const selectedService = selectedServicoId 
    ? servicos.find(s => s.id === selectedServicoId) 
    : null;
  
  const handleServiceSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setServiceSearch(e.target.value);
  };
  
  const handleServiceSelect = (serviceId: string) => {
    onServicoChange(serviceId);
    setServiceSearch('');
    setIsPopoverOpen(false);
  };
  
  const handleServiceRemove = () => {
    onServicoChange('');
  };
  
  // Filter services based on search term
  const filteredServicesBySearch = serviceSearch
    ? servicos.filter(service => 
        service.descricao.toLowerCase().includes(serviceSearch.toLowerCase())
      )
    : servicos;

  return (
    <div>
      <ServiceSearch 
        serviceSearch={serviceSearch}
        handleChange={handleServiceSearch}
        filteredServicesBySearch={filteredServicesBySearch}
        handleServiceSelect={handleServiceSelect}
        selectedService={selectedService}
        handleServiceRemove={handleServiceRemove}
        isPopoverOpen={isPopoverOpen}
        setIsPopoverOpen={setIsPopoverOpen}
        className="w-full"
      />
      
      {servicosLoading && (
        <p className="text-sm text-gray-500 mt-2">Carregando serviços...</p>
      )}
    </div>
  );
};

export default ServicoSelector;
