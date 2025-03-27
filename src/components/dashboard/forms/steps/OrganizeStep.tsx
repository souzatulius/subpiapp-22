
import React, { useEffect } from 'react';
import { ValidationError } from '@/lib/formValidationUtils';
import TitleSection from './organize/TitleSection';
import QuestionsSection from './organize/QuestionsSection';
import AttachmentsSection from './organize/AttachmentsSection';
import { generateTitleSuggestion } from './organize/utils';

interface OrganizeStepProps {
  formData: {
    titulo: string;
    perguntas: string[];
    anexos: string[];
    problema_id: string;
    servico_id: string;
    bairro_id: string;
    endereco: string;
  };
  problemas: any[];
  servicos: any[];
  filteredBairros: any[];
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handlePerguntaChange: (index: number, value: string) => void;
  handleSelectChange: (name: string, value: string | boolean) => void;
  handleAnexosChange: (files: string[]) => void;
  errors?: ValidationError[];
}

const OrganizeStep: React.FC<OrganizeStepProps> = ({
  formData,
  problemas,
  servicos,
  filteredBairros,
  handleChange,
  handlePerguntaChange,
  handleSelectChange,
  handleAnexosChange,
  errors = []
}) => {
  // Gerar título sugerido com base nos campos já preenchidos
  useEffect(() => {
    if (!formData.titulo || formData.titulo.trim() === '') {
      const suggestedTitle = generateTitleSuggestion(formData, problemas, servicos, filteredBairros);
      
      if (suggestedTitle) {
        // Usar handleSelectChange para evitar perder a referência no handleChange
        handleSelectChange('titulo', suggestedTitle);
      }
    }
  }, [
    formData.problema_id, 
    formData.servico_id, 
    formData.bairro_id, 
    formData.endereco,
    problemas,
    servicos,
    filteredBairros
  ]);

  const onFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      
      // Here in a real implementation, you'd upload the files to storage
      // and then store their URLs. For this example, we'll just use the filenames
      const fileUrls = files.map(file => URL.createObjectURL(file));
      
      handleAnexosChange([...formData.anexos, ...fileUrls]);
    }
  };

  return (
    <div className="space-y-6">
      <TitleSection 
        title={formData.titulo}
        onChange={handleChange}
        errors={errors}
      />

      <QuestionsSection 
        perguntas={formData.perguntas}
        onPerguntaChange={handlePerguntaChange}
      />

      <AttachmentsSection 
        anexos={formData.anexos}
        onAnexosChange={handleAnexosChange}
        onFileUpload={onFileUpload}
      />
    </div>
  );
};

export default OrganizeStep;
