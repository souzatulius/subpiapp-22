
import React from 'react';
import IdentificationStep from '../steps/IdentificationStep';
import OriginClassificationStep from '../steps/OriginClassificationStep';
import PriorityDeadlineStep from '../steps/PriorityDeadlineStep';
import RequesterInfoStep from '../steps/RequesterInfoStep';
import LocationStep from '../steps/LocationStep';
import QuestionsDetailsStep from '../steps/QuestionsDetailsStep';
import { FormStep } from './FormSteps';
import { DemandFormData } from '@/hooks/demandForm';

interface FormContentProps {
  activeStep: number;
  formData: DemandFormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
  handleServiceSelect: (serviceId: string) => void;
  handlePerguntaChange: (index: number, value: string) => void;
  areasCoord: any[];
  filteredServicesBySearch: any[];
  serviceSearch: string;
  servicos: any[];
  origens: any[];
  tiposMidia: any[];
  selectedDistrito: string;
  setSelectedDistrito: (value: string) => void;
  distritos: any[];
  filteredBairros: any[];
}

export const FORM_STEPS: FormStep[] = [
  {
    title: "Identificação da Demanda",
    description: "Informe os detalhes básicos da solicitação"
  }, 
  {
    title: "Origem e Classificação",
    description: "Selecione a origem e tipo de mídia"
  }, 
  {
    title: "Prioridade e Prazo",
    description: "Defina a prioridade e prazo para resposta"
  }, 
  {
    title: "Dados do Solicitante",
    description: "Informe os dados de contato (opcional)"
  }, 
  {
    title: "Localização",
    description: "Informe o endereço e bairro relacionado"
  }, 
  {
    title: "Perguntas e Detalhes",
    description: "Adicione perguntas e detalhes adicionais"
  }
];

const FormContent: React.FC<FormContentProps> = ({
  activeStep,
  formData,
  handleChange,
  handleSelectChange,
  handleServiceSelect,
  handlePerguntaChange,
  areasCoord,
  filteredServicesBySearch,
  serviceSearch,
  servicos,
  origens,
  tiposMidia,
  selectedDistrito,
  setSelectedDistrito,
  distritos,
  filteredBairros
}) => {
  switch (activeStep) {
    case 0:
      return (
        <IdentificationStep 
          formData={formData}
          handleChange={handleChange}
          handleSelectChange={handleSelectChange}
          handleServiceSelect={handleServiceSelect}
          areasCoord={areasCoord}
          filteredServicesBySearch={filteredServicesBySearch}
          serviceSearch={serviceSearch}
          servicos={servicos}
        />
      );
    case 1:
      return (
        <OriginClassificationStep 
          formData={formData}
          handleSelectChange={handleSelectChange}
          origens={origens}
          tiposMidia={tiposMidia}
        />
      );
    case 2:
      return (
        <PriorityDeadlineStep 
          formData={formData}
          handleChange={handleChange}
          handleSelectChange={handleSelectChange}
        />
      );
    case 3:
      return (
        <RequesterInfoStep 
          formData={formData}
          handleChange={handleChange}
        />
      );
    case 4:
      return (
        <LocationStep 
          formData={formData}
          selectedDistrito={selectedDistrito}
          handleChange={handleChange}
          handleSelectChange={handleSelectChange}
          setSelectedDistrito={setSelectedDistrito}
          distritos={distritos}
          filteredBairros={filteredBairros}
        />
      );
    case 5:
      return (
        <QuestionsDetailsStep 
          formData={formData}
          handleChange={handleChange}
          handlePerguntaChange={handlePerguntaChange}
          handleSelectChange={handleSelectChange}
        />
      );
    default:
      return null;
  }
};

export default FormContent;
