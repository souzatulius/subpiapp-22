
import React from 'react';
import { ValidationError } from '@/lib/formValidationUtils';
import QuestionsSection from './questions/QuestionsSection';
import FileUploadSection from './questions/FileUploadSection';

interface QuestionsDetailsStepProps {
  formData: {
    perguntas: string[];
    anexos: string[];
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handlePerguntaChange: (index: number, value: string) => void;
  handleSelectChange: (name: string, value: string) => void;
  handleAnexosChange?: (files: string[]) => void;
  errors?: ValidationError[];
}

const QuestionsDetailsStep: React.FC<QuestionsDetailsStepProps> = ({
  formData,
  handlePerguntaChange,
  handleAnexosChange,
  errors = []
}) => {
  return (
    <div className="space-y-6">
      <QuestionsSection 
        perguntas={formData.perguntas}
        onPerguntaChange={handlePerguntaChange}
        errors={errors}
      />

      <FileUploadSection 
        anexos={formData.anexos}
        onAnexosChange={handleAnexosChange || (() => {})}
      />
    </div>
  );
};

export default QuestionsDetailsStep;
