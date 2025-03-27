
import React from 'react';
import ProtocolStep from '../steps/ProtocolStep';
import DetailsStep from '../steps/DetailsStep';
import ProblemStep from '../steps/ProblemStep';
import PracticalInfoStep from '../steps/PracticalInfoStep';
import OrganizeStep from '../steps/OrganizeStep';
import ReviewStep from '../steps/ReviewStep';
import { ValidationError } from '@/lib/formValidationUtils';
import OriginStep from '../steps/OriginStep';
import RequesterInfoStep from '../steps/RequesterInfoStep';
import LocationStep from '../steps/LocationStep';

export const FORM_STEPS = [
  {
    title: 'Vamos iniciar agora o cadastro da demanda',
    description: 'Selecione a origem da demanda, informe se possui protocolo, prioridade e prazo para resposta.',
  },
  {
    title: 'Sobre a origem da demanda',
    description: 'Informe a origem da demanda.',
  },
  {
    title: 'Vamos entender melhor o que está acontecendo',
    description: 'Descreva a solicitação com detalhes.',
  },
  {
    title: 'Qual é o problema que precisa ser resolvido?',
    description: 'Selecione o tema e serviço relacionado à demanda.',
  },
  {
    title: 'Dados do solicitante e mídia',
    description: 'Informações sobre o solicitante e meio de comunicação.',
  },
  {
    title: 'Localização da demanda',
    description: 'Dados sobre a localização da demanda.',
  },
  {
    title: 'Perguntas e anexos',
    description: 'Adicione perguntas específicas e anexos se necessário.',
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
  nextStep
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
        <OriginStep
          formData={formData}
          handleSelectChange={handleSelectChange}
          handleChange={handleChange}
          origens={origens}
          tiposMidia={tiposMidia}
          errors={errors}
        />
      );
    case 2:
      return (
        <DetailsStep
          formData={formData}
          handleChange={handleChange}
          handleSelectChange={handleSelectChange}
          origens={origens}
          tiposMidia={tiposMidia}
          errors={errors}
        />
      );
    case 3:
      return (
        <ProblemStep
          formData={formData}
          problemas={problemas}
          servicos={servicos}
          filteredServicos={filteredServicos}
          handleChange={handleChange}
          handleSelectChange={handleSelectChange}
          handleServiceSearch={handleServiceSearch}
          errors={errors}
        />
      );
    case 4:
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
    case 5:
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
        />
      );
    case 6:
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
    case 7:
      return (
        <ReviewStep
          formData={formData}
          handleChange={handleChange}
          problemas={problemas}
          origens={origens}
          tiposMidia={tiposMidia}
          filteredBairros={filteredBairros}
          servicos={servicos}
          errors={errors}
          showValidationErrors={true}
        />
      );
    default:
      return <div>Step not found</div>;
  }
};

export default FormContent;
