
import React from 'react';
import IdentificationStep from '../steps/IdentificationStep';
import OriginClassificationStep from '../steps/OriginClassificationStep';
import RequesterInfoStep from '../steps/RequesterInfoStep';
import LocationStep from '../steps/LocationStep';
import QuestionsDetailsStep from '../steps/QuestionsDetailsStep';
import PriorityDeadlineStep from '../steps/PriorityDeadlineStep';
import ReviewStep from '../steps/ReviewStep';
import { ValidationError } from '@/lib/formValidationUtils';
import { FORM_STEPS, FormContentProps } from './FormStepConfig';

const FormContent: React.FC<FormContentProps> = ({
  activeStep,
  formData,
  handleChange,
  handleSelectChange,
  handleServiceSelect,
  handlePerguntaChange,
  handleAnexosChange,
  areasCoord,
  problemas,
  filteredServicesBySearch,
  serviceSearch,
  servicos,
  origens,
  tiposMidia,
  selectedDistrito,
  setSelectedDistrito,
  distritos,
  filteredBairros,
  errors
}) => {
  const getStepErrors = (step: number) => {
    return errors.filter(err => FORM_STEPS[step].fields.includes(err.field));
  };

  switch (activeStep) {
    case 0:
      return (
        <IdentificationStep
          formData={formData}
          handleChange={handleChange}
          handleSelectChange={handleSelectChange}
          handleServiceSelect={handleServiceSelect}
          problemas={problemas}
          filteredServicesBySearch={filteredServicesBySearch}
          serviceSearch={serviceSearch}
          servicos={servicos}
          errors={getStepErrors(0)}
        />
      );
    case 1:
      return (
        <OriginClassificationStep
          formData={formData}
          handleChange={handleChange}
          handleSelectChange={handleSelectChange}
          origens={origens}
          tiposMidia={tiposMidia}
          errors={getStepErrors(1)}
        />
      );
    case 2:
      return (
        <RequesterInfoStep
          formData={formData}
          handleChange={handleChange}
          errors={getStepErrors(2)}
        />
      );
    case 3:
      return (
        <LocationStep
          formData={formData}
          handleChange={handleChange}
          handleSelectChange={handleSelectChange}
          distritos={distritos}
          selectedDistrito={selectedDistrito}
          setSelectedDistrito={setSelectedDistrito}
          filteredBairros={filteredBairros}
          errors={getStepErrors(3)}
        />
      );
    case 4:
      return (
        <QuestionsDetailsStep
          formData={formData}
          handleChange={handleChange}
          handlePerguntaChange={handlePerguntaChange}
          handleSelectChange={handleSelectChange}
          handleAnexosChange={handleAnexosChange}
          errors={getStepErrors(4)}
        />
      );
    case 5:
      return (
        <PriorityDeadlineStep
          formData={formData}
          handleSelectChange={handleSelectChange}
          errors={getStepErrors(5)}
        />
      );
    case 6:
      return (
        <ReviewStep
          formData={formData}
          handleChange={handleChange}
          errors={getStepErrors(6)}
          problemas={problemas}
          servicos={servicos}
          origens={origens}
          tiposMidia={tiposMidia}
          filteredBairros={filteredBairros}
        />
      );
    default:
      return <div>Passo não encontrado</div>;
  }
};

export { FORM_STEPS };
export default FormContent;
