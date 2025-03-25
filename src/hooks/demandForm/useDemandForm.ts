
import { useDemandFormData } from './useDemandFormData';
import { useDemandFormState } from './useDemandFormState';
import { useDemandFormSubmit } from './useDemandFormSubmit';

export const useDemandForm = (userId: string | undefined, onClose: () => void) => {
  const {
    areasCoord,
    servicos,
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
    filteredServicos,
    filteredBairros,
    selectedDistrito,
    activeStep,
    filteredServicesBySearch,
    handleChange,
    handleSelectChange,
    handleServiceSelect,
    handlePerguntaChange,
    handleAnexosChange,
    nextStep,
    prevStep,
    setSelectedDistrito,
    resetForm,
    setActiveStep
  } = useDemandFormState(servicos, bairros, problemas); // Pass problemas here

  const { handleSubmit } = useDemandFormSubmit(
    userId,
    formData,
    setIsLoading,
    onClose
  );

  return {
    formData,
    areasCoord,
    servicos,
    origens,
    tiposMidia,
    distritos,
    bairros,
    problemas,
    isLoading,
    serviceSearch,
    filteredServicesBySearch,
    filteredBairros,
    selectedDistrito,
    activeStep,
    handleChange,
    handleSelectChange,
    handleServiceSelect,
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
