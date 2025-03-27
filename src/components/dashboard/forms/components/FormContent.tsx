
import React from 'react';
import ProtocolStep from '../steps/ProtocolStep';
import DetailsStep from '../steps/DetailsStep';
import ProblemStep from '../steps/ProblemStep';
import OrganizeStep from '../steps/OrganizeStep';
import ReviewStep from '../steps/ReviewStep';
import { ValidationError } from '@/lib/formValidationUtils';
import RequesterInfoStep from '../steps/RequesterInfoStep';
import LocationStep from '../steps/LocationStep';

export const FORM_STEPS = [
  {
    title: 'Origem e prazo da demanda',
    description: 'Informe a origem da demanda, se possui protocolo e prazo para resposta.',
  },
  {
    title: 'Dados do solicitante e mídia',
    description: 'Informações sobre o solicitante e meio de comunicação.',
  },
  {
    title: 'Tema, serviço e localização',
    description: 'Selecione o tema, serviço relacionado e localização da demanda.',
  },
  {
    title: 'Título, perguntas e anexos',
    description: 'Defina o título, adicione perguntas específicas e anexos se necessário.',
  },
  {
    title: 'Revise tudo antes de enviar',
    description: 'Verifique todas as informações antes de finalizar.',
  },
];

interface FormContentProps {
  activeStep: number;
  formData: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (name: string, value: string | boolean) => void;
  handlePerguntaChange: (index: number, value: string) => void;
  handleAnexosChange: (files: string[]) => void;
  areasCoord: any[];
  problemas: any[];
  serviceSearch: string;
  origens: any[];
  tiposMidia: any[];
  selectedDistrito: string;
  setSelectedDistrito: (value: string) => void;
  distritos: any[];
  filteredBairros: any[];
  errors: ValidationError[];
  servicos?: any[];
  filteredServicos?: any[];
  handleServiceSearch?: (value: string) => void;
  nextStep?: () => void;
  onNavigateToStep?: (step: number) => void; // Added to navigate between steps
}

const FormContent: React.FC<FormContentProps> = ({
  activeStep,
  formData,
  handleChange,
  handleSelectChange,
  handlePerguntaChange,
  handleAnexosChange,
  areasCoord,
  problemas,
  serviceSearch,
  origens,
  tiposMidia,
  selectedDistrito,
  setSelectedDistrito,
  distritos,
  filteredBairros,
  errors,
  servicos = [],
  filteredServicos = [],
  handleServiceSearch,
  nextStep,
  onNavigateToStep
}) => {
  switch (activeStep) {
    case 0:
      return (
        <ProtocolStep
          formData={formData}
          handleChange={handleChange}
          handleSelectChange={handleSelectChange}
          origens={origens}
          tiposMidia={tiposMidia}
          errors={errors}
          nextStep={nextStep}
        />
      );
    case 1:
      return (
        <RequesterInfoStep
          formData={formData}
          handleChange={handleChange}
          handleSelectChange={handleSelectChange}
          errors={errors}
          tiposMidia={tiposMidia}
          origens={origens}
        />
      );
    case 2:
      return (
        <LocationStep
          formData={formData}
          handleChange={handleChange}
          handleSelectChange={handleSelectChange}
          distritos={distritos}
          selectedDistrito={selectedDistrito}
          setSelectedDistrito={setSelectedDistrito}
          filteredBairros={filteredBairros}
          errors={errors}
          problemas={problemas}
          servicos={servicos}
          filteredServicos={filteredServicos}
          serviceSearch={serviceSearch}
          handleServiceSearch={handleServiceSearch}
        />
      );
    case 3:
      return (
        <OrganizeStep
          formData={formData}
          handleChange={handleChange}
          handlePerguntaChange={handlePerguntaChange}
          handleSelectChange={handleSelectChange}
          handleAnexosChange={handleAnexosChange}
          problemas={problemas}
          servicos={servicos}
          filteredBairros={filteredBairros}
          errors={errors}
        />
      );
    case 4:
      return (
        <ReviewStep
          formData={formData}
          handleChange={handleChange}
          problemas={problemas}
          origens={origens}
          tiposMidia={tiposMidia}
          filteredBairros={filteredBairros}
          distritos={distritos}
          servicos={servicos}
          errors={errors}
          showValidationErrors={true}
          onNavigateToStep={onNavigateToStep}
        />
      );
    default:
      return <div>Step not found</div>;
  }
};

export default FormContent;
