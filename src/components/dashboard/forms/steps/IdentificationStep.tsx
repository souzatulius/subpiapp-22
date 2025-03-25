
import React, { useState } from 'react';
import TemaSelector from './identification/TemaSelector';
import ServiceSearch from './identification/ServiceSearch';
import Protocolo156 from './identification/Protocolo156';
import { ValidationError } from '@/lib/formValidationUtils';

export interface IdentificationStepProps {
  formData: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (name: string, value: string | boolean) => void;
  handleServiceSelect: (serviceId: string) => void;
  problemas: any[];
  filteredServicesBySearch: any[];
  serviceSearch: string;
  servicos: any[];
  errors?: ValidationError[];
}

const IdentificationStep: React.FC<IdentificationStepProps> = ({
  formData,
  handleChange,
  handleSelectChange,
  handleServiceSelect,
  problemas,
  filteredServicesBySearch,
  serviceSearch,
  servicos,
  errors = []
}) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  
  const selectedService = formData.servico_id 
    ? servicos.find(s => s.id === formData.servico_id) 
    : null;
  
  const handleServiceRemove = () => {
    handleSelectChange('servico_id', '');
  };

  return (
    <div className="space-y-6">
      <Protocolo156
        temProtocolo156={formData.tem_protocolo_156}
        numeroProtocolo156={formData.numero_protocolo_156}
        handleChange={handleChange}
        handleSelectChange={handleSelectChange}
        errors={errors}
      />
      
      <TemaSelector
        problemas={problemas}
        selectedTemaId={formData.problema_id}
        handleSelectChange={handleSelectChange}
        errors={errors}
      />
      
      {formData.problema_id && (
        <ServiceSearch
          serviceSearch={serviceSearch}
          handleChange={handleChange}
          filteredServicesBySearch={filteredServicesBySearch}
          handleServiceSelect={handleServiceSelect}
          selectedService={selectedService}
          handleServiceRemove={handleServiceRemove}
          errors={errors}
          isPopoverOpen={isPopoverOpen}
          setIsPopoverOpen={setIsPopoverOpen}
        />
      )}
    </div>
  );
};

export default IdentificationStep;
