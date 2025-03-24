
import React from 'react';
import { DemandFormData } from '@/hooks/demandForm';
import IdentificationStep from '../steps/IdentificationStep';
import OriginClassificationStep from '../steps/OriginClassificationStep';
import RequesterInfoStep from '../steps/RequesterInfoStep';
import LocationStep from '../steps/LocationStep';
import PriorityDeadlineStep from '../steps/PriorityDeadlineStep';
import QuestionsDetailsStep from '../steps/QuestionsDetailsStep';
import FileUploadStep from '../steps/FileUploadStep';
import { ValidationError } from '@/lib/formValidationUtils';

export const FORM_STEPS = [
  {
    id: 'identification',
    title: 'Identificação',
    description: 'Identificação da demanda'
  },
  {
    id: 'origin-classification',
    title: 'Origem e Classificação',
    description: 'Origem e classificação da demanda'
  },
  {
    id: 'requester-info',
    title: 'Dados do Solicitante',
    description: 'Informações do solicitante'
  },
  {
    id: 'location',
    title: 'Localização',
    description: 'Local da demanda'
  },
  {
    id: 'priority-deadline',
    title: 'Prioridade e Prazo',
    description: 'Definição de prioridade e prazo'
  },
  {
    id: 'questions-details',
    title: 'Perguntas e Detalhes',
    description: 'Perguntas e detalhes da demanda'
  },
  {
    id: 'file-upload',
    title: 'Anexos',
    description: 'Anexar arquivos à demanda'
  }
];

interface FormContentProps {
  activeStep: number;
  formData: DemandFormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
  handleServiceSelect: (serviceId: string) => void;
  handlePerguntaChange: (index: number, value: string) => void;
  handleFileChange?: (file: File | null) => void;
  selectedFile?: File | null;
  areasCoord: any[];
  filteredServicesBySearch: any[];
  serviceSearch: string;
  servicos: any[];
  origens: any[];
  tiposMidia: any[];
  selectedDistrito: string;
  setSelectedDistrito: (distrito: string) => void;
  distritos: any[];
  filteredBairros: any[];
  errors: ValidationError[];
}

const FormContent: React.FC<FormContentProps> = ({
  activeStep,
  formData,
  handleChange,
  handleSelectChange,
  handleServiceSelect,
  handlePerguntaChange,
  handleFileChange,
  selectedFile,
  areasCoord,
  filteredServicesBySearch,
  serviceSearch,
  servicos,
  origens,
  tiposMidia,
  selectedDistrito,
  setSelectedDistrito,
  distritos,
  filteredBairros,
  errors
}) => {
  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return <IdentificationStep 
                  formData={formData} 
                  handleChange={handleChange}
                  handleSelectChange={handleSelectChange}
                  areasCoord={areasCoord}
                  filteredServicesBySearch={filteredServicesBySearch}
                  serviceSearch={serviceSearch}
                  handleServiceSelect={handleServiceSelect}
                  servicos={servicos}
                  errors={errors}
                />;
      case 1:
        return <OriginClassificationStep 
                  formData={formData} 
                  handleChange={handleChange}
                  handleSelectChange={handleSelectChange}
                  origens={origens}
                  tiposMidia={tiposMidia}
                  errors={errors}
                />;
      case 2:
        return <RequesterInfoStep 
                  formData={formData} 
                  handleChange={handleChange}
                  errors={errors}
                />;
      case 3:
        return <LocationStep 
                  formData={formData} 
                  handleChange={handleChange}
                  handleSelectChange={handleSelectChange}
                  selectedDistrito={selectedDistrito}
                  setSelectedDistrito={setSelectedDistrito}
                  distritos={distritos}
                  filteredBairros={filteredBairros}
                  errors={errors}
                />;
      case 4:
        return <PriorityDeadlineStep 
                  formData={formData} 
                  handleSelectChange={handleSelectChange}
                  errors={errors}
                />;
      case 5:
        return <QuestionsDetailsStep 
                  formData={formData}
                  handleChange={handleChange}
                  handlePerguntaChange={handlePerguntaChange}
                  handleSelectChange={handleSelectChange}
                  errors={errors}
                />;
      case 6:
        return <FileUploadStep 
                  selectedFile={selectedFile || null}
                  handleFileChange={handleFileChange || (() => {})}
                  errors={errors}
                />;
      default:
        return null;
    }
  };

  return (
    <div className="py-4">
      {renderStepContent()}
    </div>
  );
};

export default FormContent;
