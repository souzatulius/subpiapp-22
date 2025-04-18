
import React from 'react';
import TemaSelector from './identification/TemaSelector';
import DetalhesInput from './identification/DetalhesInput';
import Protocolo156 from './identification/Protocolo156';
import { ValidationError } from '@/lib/formValidationUtils';

interface IdentificationStepProps {
  formData: {
    problema_id: string;
    detalhes_solicitacao: string;
    tem_protocolo_156?: boolean;
    numero_protocolo_156?: string;
    servico_id?: string;
    nao_sabe_servico?: boolean;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (name: string, value: string | boolean) => void;
  problemas: any[];
  errors?: ValidationError[];
  servicos?: any[];
  filteredServicos?: any[];
  serviceSearch?: string;
  handleServiceSearch?: (value: string) => void;
}

const IdentificationStep: React.FC<IdentificationStepProps> = ({
  formData,
  handleChange,
  handleSelectChange,
  problemas,
  errors = [],
  servicos = [],
  filteredServicos = [],
  serviceSearch = '',
  handleServiceSearch = () => {}
}) => {
  return (
    <div className="space-y-6">
      <TemaSelector
        problemas={problemas}
        servicos={servicos}
        filteredServicos={filteredServicos}
        formData={{
          problema_id: formData.problema_id,
          servico_id: formData.servico_id || '',
          nao_sabe_servico: formData.nao_sabe_servico || false
        }}
        handleSelectChange={handleSelectChange}
        handleServiceSearch={handleServiceSearch}
        serviceSearch={serviceSearch}
        errors={errors}
      />
      
      <DetalhesInput
        value={formData.detalhes_solicitacao}
        onChange={handleChange}
        errors={errors}
      />
      
      <Protocolo156
        temProtocolo156={formData.tem_protocolo_156 || false}
        numeroProtocolo156={formData.numero_protocolo_156 || ''}
        handleSelectChange={(checked) => handleSelectChange('tem_protocolo_156', checked)}
        handleChange={handleChange}
        errors={errors}
      />
    </div>
  );
};

export default IdentificationStep;
