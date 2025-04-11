
import React, { useState, useEffect } from 'react';
import TitleSection from './organize/TitleSection';
import { ValidationError, hasFieldError, getFieldErrorMessage } from '@/lib/formValidationUtils';
import QuestionsSection from './questions/QuestionsSection';
import FileUploadSection from './questions/FileUploadSection';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';

interface OrganizeStepProps {
  formData: {
    titulo: string;
    perguntas: string[];
    anexos: string[];
    servico_id: string;
    problema_id: string;
    bairro_id: string;
    detalhes_solicitacao: string;
    resumo_situacao?: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handlePerguntaChange: (index: number, value: string) => void;
  handleSelectChange: (name: string, value: string) => void;
  handleAnexosChange: (files: string[]) => void;
  problemas: any[];
  servicos: any[];
  filteredBairros: any[];
  errors: ValidationError[];
  onGenerateAIContent?: () => Promise<void>;
  isGenerating?: boolean; // Added this prop to match what's passed in FormContent.tsx
}

const OrganizeStep: React.FC<OrganizeStepProps> = ({
  formData,
  handleChange,
  handlePerguntaChange,
  handleAnexosChange,
  problemas,
  servicos,
  filteredBairros,
  errors,
  onGenerateAIContent,
  isGenerating = false // Added default value
}) => {
  // Find the problem and service descriptions
  const selectedProblem = problemas.find(p => p.id === formData.problema_id);
  const selectedService = servicos.find(s => s.id === formData.servico_id);
  const selectedBairro = filteredBairros.find(b => b.id === formData.bairro_id);
  
  // Auto-generate content when component mounts
  useEffect(() => {
    const generateContent = async () => {
      if (
        formData.problema_id && 
        formData.detalhes_solicitacao &&
        onGenerateAIContent &&
        (!formData.titulo || !formData.resumo_situacao)
      ) {
        try {
          await onGenerateAIContent();
        } catch (error) {
          console.error("Error generating AI content:", error);
        }
      }
    };
    
    if (!isGenerating) {
      generateContent();
    }
  }, [formData.problema_id, formData.detalhes_solicitacao, onGenerateAIContent, isGenerating]);

  return (
    <div className="space-y-6">
      {isGenerating && (
        <div className="flex flex-col items-center justify-center py-6 bg-blue-50 rounded-xl border border-blue-100">
          <Loader2 className="h-8 w-8 text-blue-500 animate-spin mb-4" />
          <p className="text-blue-700">Gerando sugestões com IA...</p>
        </div>
      )}

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

      {/* Resumo da situação */}
      <div>
        <label 
          htmlFor="resumo_situacao" 
          className={`form-question-title ${hasFieldError('resumo_situacao', errors) ? 'text-orange-500 font-semibold' : ''}`}
        >
          Resumo da situação {hasFieldError('resumo_situacao', errors) && <span className="text-orange-500">*</span>}
        </label>
        <Textarea 
          id="resumo_situacao" 
          name="resumo_situacao" 
          value={formData.resumo_situacao || ''}
          onChange={handleChange}
          placeholder="Um resumo claro da situação para facilitar o entendimento pela área técnica..."
          className={`min-h-[100px] rounded-xl ${hasFieldError('resumo_situacao', errors) ? 'border-orange-500' : ''}`}
        />
        {hasFieldError('resumo_situacao', errors) && (
          <p className="text-orange-500 text-sm mt-1">{getFieldErrorMessage('resumo_situacao', errors)}</p>
        )}
      </div>

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
