
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
    nextStep,
    prevStep,
    setSelectedDistrito
  } = useDemandFormState(servicos, bairros);

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
    handleSubmit,
    nextStep,
    prevStep,
    setSelectedDistrito
  };
};
