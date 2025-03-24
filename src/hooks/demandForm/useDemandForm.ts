
import { useDemandFormData } from './useDemandFormData';
import { useDemandFormState } from './useDemandFormState';
import { useDemandFormSubmit } from './useDemandFormSubmit';

export const useDemandForm = (userId: string | undefined, onClose: () => void) => {
  const {
    problemas,
    servicos,
    origens,
    tiposMidia,
    distritos,
    bairros,
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
    selectedFile,
    handleChange,
    handleSelectChange,
    handleServiceSelect,
    handlePerguntaChange,
    handleFileChange,
    nextStep,
    prevStep,
    setSelectedDistrito,
    resetForm,
    setActiveStep
  } = useDemandFormState(servicos, bairros);

  const { handleSubmit } = useDemandFormSubmit(
    userId,
    formData,
    selectedFile,
    setIsLoading,
    onClose
  );

  return {
    formData,
    problemas,
    servicos,
    origens,
    tiposMidia,
    distritos,
    isLoading,
    serviceSearch,
    filteredServicesBySearch,
    filteredBairros,
    selectedDistrito,
    activeStep,
    selectedFile,
    handleChange,
    handleSelectChange,
    handleServiceSelect,
    handlePerguntaChange,
    handleFileChange,
    handleSubmit,
    nextStep,
    prevStep,
    setSelectedDistrito,
    resetForm,
    setActiveStep
  };
};
