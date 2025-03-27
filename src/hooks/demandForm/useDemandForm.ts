
import { useDemandFormData } from './useDemandFormData';
import { useDemandFormState } from './useDemandFormState';
import { useDemandFormSubmit } from './useDemandFormSubmit';

export const useDemandForm = (userId: string | undefined, onClose: () => void) => {
  const {
    areasCoord,
    origens,
    tiposMidia,
    distritos,
    bairros,
    problemas,
    isLoading,
    setIsLoading
  } = useDemandFormData();

  const {
    formData,
    serviceSearch,
    filteredBairros,
    selectedDistrito,
    activeStep,
    handleChange,
    handleSelectChange,
    handlePerguntaChange,
    handleAnexosChange,
    nextStep,
    prevStep,
    setSelectedDistrito,
    resetForm,
    setActiveStep,
    servicos,
    filteredServicos,
    handleServiceSearch
  } = useDemandFormState(bairros, problemas);

  // Fixed by passing only the resetForm and onClose parameters
  const { isLoading: submitting, submitForm, handleSubmit } = useDemandFormSubmit(
    resetForm,
    onClose
  );

  return {
    formData,
    areasCoord,
    origens,
    tiposMidia,
    distritos,
    bairros,
    problemas,
    isLoading: isLoading || submitting, // Use either loading state
    serviceSearch,
    filteredBairros,
    selectedDistrito,
    activeStep,
    handleChange,
    handleSelectChange,
    handlePerguntaChange,
    handleAnexosChange,
    handleSubmit,
    nextStep,
    prevStep,
    setSelectedDistrito,
    resetForm,
    setActiveStep,
    servicos,
    filteredServicos,
    handleServiceSearch
  };
};
