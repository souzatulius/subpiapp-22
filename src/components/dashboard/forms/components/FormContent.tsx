
import React from 'react';
import RequestInfoStep from '../steps/RequestInfoStep';
import ProblemStep from '../steps/ProblemStep';
import LocationStep from '../steps/LocationStep';
import QuestionsDetailsStep from '../steps/QuestionsDetailsStep';
import ReviewStep from '../steps/ReviewStep';
import ProtocolStep from '../steps/ProtocolStep';
import { ValidationError } from '@/lib/formValidationUtils';

export const FORM_STEPS = [
  {
    title: 'Protocolo e Origem',
    description: 'Informe o protocolo 156 e a origem da demanda.',
  },
  {
    title: 'Informações do Solicitante',
    description: 'Dados do solicitante e prioridade da demanda.',
  },
  {
    title: 'Tema/Problema',
    description: 'Selecione o tema e serviço relacionado à demanda.',
  },
  {
    title: 'Localização',
    description: 'Endereço e bairro relacionados à demanda.',
  },
  {
    title: 'Perguntas e Anexos',
    description: 'Adicione perguntas específicas e anexos se necessário.',
  },
  {
    title: 'Revisão',
    description: 'Revise e confirme as informações antes de finalizar.',
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
  handleServiceSearch
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
        />
      );
    case 1:
      return (
        <RequestInfoStep
          formData={formData}
          handleChange={handleChange}
          handleSelectChange={handleSelectChange}
          errors={errors}
        />
      );
    case 2:
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
          errors={errors}
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
          errors={errors}
        />
      );
    case 5:
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
        />
      );
    default:
      return <div>Step not found</div>;
  }
};

export default FormContent;
