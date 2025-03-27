
import React from 'react';
import TitleSection from './organize/TitleSection';
import { ValidationError } from '@/lib/formValidationUtils';
import QuestionsSection from './questions/QuestionsSection';
import FileUploadSection from './questions/FileUploadSection';

interface OrganizeStepProps {
  formData: {
    titulo: string;
    perguntas: string[];
    anexos: string[];
    servico_id: string;
    problema_id: string;
    bairro_id: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handlePerguntaChange: (index: number, value: string) => void;
  handleSelectChange: (name: string, value: string) => void;
  handleAnexosChange: (files: string[]) => void;
  problemas: any[];
  servicos: any[];
  filteredBairros: any[];
  errors: ValidationError[];
}

const OrganizeStep: React.FC<OrganizeStepProps> = ({
  formData,
  handleChange,
  handlePerguntaChange,
  handleAnexosChange,
  problemas,
  servicos,
  filteredBairros,
  errors
}) => {
  // Find the problem and service descriptions
  const selectedProblem = problemas.find(p => p.id === formData.problema_id);
  const selectedService = servicos.find(s => s.id === formData.servico_id);
  const selectedBairro = filteredBairros.find(b => b.id === formData.bairro_id);

  return (
    <div className="space-y-6">
      {/* Título da Demanda */}
      <TitleSection 
        titulo={formData.titulo} 
        handleChange={handleChange}
        selectedProblem={selectedProblem}
        selectedService={selectedService}
        selectedBairro={selectedBairro}
        errors={errors}
        formData={formData}
        problemas={problemas}
        servicos={servicos}
        filteredBairros={filteredBairros}
      />

      {/* Perguntas para Área Técnica */}
      <QuestionsSection 
        perguntas={formData.perguntas}
        onPerguntaChange={handlePerguntaChange}
        errors={errors}
      />

      {/* Anexos */}
      <FileUploadSection 
        anexos={formData.anexos}
        onAnexosChange={handleAnexosChange}
      />
    </div>
  );
};

export default OrganizeStep;
