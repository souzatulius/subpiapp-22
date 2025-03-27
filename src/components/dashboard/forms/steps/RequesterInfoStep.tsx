
import React from 'react';
import { ValidationError } from '@/lib/formValidationUtils';
import { 
  MediaTypeSelector, 
  MediaVehicleField, 
  RequesterFields,
  useRequesterInfoLogic
} from './requester-info';

interface RequesterInfoStepProps {
  formData: {
    origem_id: string;
    tipo_midia_id: string;
    veiculo_imprensa: string;
    nome_solicitante: string;
    telefone_solicitante: string;
    email_solicitante: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
  errors: ValidationError[];
  tiposMidia: any[];
  origens: any[];
}

const RequesterInfoStep: React.FC<RequesterInfoStepProps> = ({
  formData,
  handleChange,
  handleSelectChange,
  errors,
  tiposMidia,
  origens
}) => {
  const selectedOrigin = origens.find(o => o.id === formData.origem_id);
  const requiresMediaType = selectedOrigin && ["Imprensa", "SMSUB", "SECOM"].includes(selectedOrigin.descricao);
  
  const { showNomeSolicitante, showTelefone, showEmail } = useRequesterInfoLogic(formData);

  return (
    <div className="space-y-6">
      {requiresMediaType && (
        <MediaTypeSelector 
          tiposMidia={tiposMidia}
          formData={formData}
          handleSelectChange={handleSelectChange}
          errors={errors}
        />
      )}

      {requiresMediaType && formData.tipo_midia_id && (
        <MediaVehicleField
          value={formData.veiculo_imprensa}
          handleChange={handleChange}
          errors={errors}
        />
      )}

      {showNomeSolicitante && requiresMediaType && (
        <RequesterFields
          formData={formData}
          handleChange={handleChange}
          errors={errors}
          inlineDisplay={true}
        />
      )}

      {!requiresMediaType && (
        <RequesterFields
          formData={formData}
          handleChange={handleChange}
          errors={errors}
          inlineDisplay={true}
        />
      )}
    </div>
  );
};

export default RequesterInfoStep;

