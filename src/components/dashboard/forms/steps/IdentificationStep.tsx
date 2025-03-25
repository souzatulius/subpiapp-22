
import React, { useState } from 'react';
import TemaSelector from './identification/TemaSelector';
import ServiceSearch from './identification/ServiceSearch';
import DetalhesInput from './identification/DetalhesInput';
import { ValidationError } from '@/lib/formValidationUtils';

interface IdentificationStepProps {
  formData: {
    problema_id: string;
    servico_id: string;
    detalhes_solicitacao: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
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
  const selectedService = servicos.find(s => s.id === formData.servico_id);

  const handleServiceRemove = () => {
    handleSelectChange('servico_id', '');
  };

  return (
    <div className="space-y-4">
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

      <DetalhesInput
        value={formData.detalhes_solicitacao}
        handleChange={handleChange}
        errors={errors}
      />
    </div>
  );
};

export default IdentificationStep;
