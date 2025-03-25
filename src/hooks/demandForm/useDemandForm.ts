
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
    setActiveStep
  } = useDemandFormState(bairros, problemas);

  const { handleSubmit } = useDemandFormSubmit(
    userId,
    formData,
    setIsLoading,
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
    isLoading,
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
    setActiveStep
  };
};
