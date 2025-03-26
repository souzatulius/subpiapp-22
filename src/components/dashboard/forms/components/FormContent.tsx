
import React from 'react';
import ProtocolStep from '../steps/ProtocolStep';
import DetailsStep from '../steps/DetailsStep';
import ProblemStep from '../steps/ProblemStep';
import PracticalInfoStep from '../steps/PracticalInfoStep';
import OrganizeStep from '../steps/OrganizeStep';
import ReviewStep from '../steps/ReviewStep';
import { ValidationError } from '@/lib/formValidationUtils';

export const FORM_STEPS = [
  {
    title: 'Vamos iniciar agora o cadastro da demanda',
    description: 'Selecione a origem da demanda e informe se há protocolo 156.',
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
    title: 'Agora precisamos de algumas informações práticas',
    description: 'Dados do solicitante e localização da demanda.',
  },
  {
    title: 'Vamos organizar e revisar essa demanda',
    description: 'Adicione título, perguntas específicas e anexos se necessário.',
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
        <DetailsStep
          formData={formData}
          handleChange={handleChange}
          handleSelectChange={handleSelectChange}
          origens={origens}
          tiposMidia={tiposMidia}
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
        <PracticalInfoStep
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
        <OrganizeStep
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
          showValidationErrors={true}
        />
      );
    default:
      return <div>Step not found</div>;
  }
};

export default FormContent;
