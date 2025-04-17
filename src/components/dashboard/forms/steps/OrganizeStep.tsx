
import React from 'react';
import TitleSection from './organize/TitleSection';
import QuestionsSection from './organize/QuestionsSection';
import AttachmentsSection from './organize/AttachmentsSection';
import { ValidationError } from '@/lib/formValidationUtils';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Sparkles } from 'lucide-react';

interface OrganizeStepProps {
  formData: {
    titulo: string;
    perguntas: string[];
    anexos: string[];
    problema_id: string;
    servico_id: string;
    detalhes_solicitacao: string;
    resumo_situacao?: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handlePerguntaChange: (index: number, value: string) => void;
  handleSelectChange: (name: string, value: string | boolean) => void;
  handleAnexosChange: (files: string[]) => void;
  problemas: any[];
  servicos: any[];
  filteredBairros: any[];
  errors: ValidationError[];
  onGenerateAIContent?: () => Promise<void>;
  isGenerating?: boolean;
}

const OrganizeStep: React.FC<OrganizeStepProps> = ({
  formData,
  handleChange,
  handlePerguntaChange,
  handleSelectChange,
  handleAnexosChange,
  problemas,
  servicos,
  filteredBairros,
  errors,
  onGenerateAIContent,
  isGenerating = false
}) => {
  const hasError = (field: string) => errors.some(err => err.field === field);
  const getErrorMessage = (field: string) => {
    const error = errors.find(err => err.field === field);
    return error ? error.message : '';
  };

  const selectedProblem = problemas.find(problema => problema.id === formData.problema_id);
  const selectedService = servicos.find(servico => servico.id === formData.servico_id);

  return (
    <div className="space-y-6">
      {onGenerateAIContent && (
        <div className="rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 p-4 border border-blue-100">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-blue-700 text-sm font-medium">Gerador de conteúdo</h3>
              <p className="text-sm text-blue-600">
                Utilize IA para sugerir título, resumo e perguntas para esta demanda
              </p>
            </div>
            <Button
              onClick={onGenerateAIContent}
              disabled={isGenerating || !formData.problema_id || !formData.detalhes_solicitacao}
              className="bg-blue-600 hover:bg-blue-700"
              size="sm"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Gerando...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Gerar com IA
                </>
              )}
            </Button>
          </div>
        </div>
      )}

      <TitleSection
        titulo={formData.titulo}
        handleChange={handleChange}
        hasError={hasError('titulo')}
        errorMessage={getErrorMessage('titulo')}
      />

      {/* Seção de resumo (novo campo) */}
      <div className="space-y-2">
        <Label 
          htmlFor="resumo_situacao" 
          className={`block text-sm font-medium ${hasError('resumo_situacao') ? 'text-orange-500' : 'text-gray-700'}`}
        >
          Resumo da situação
        </Label>
        <Textarea
          id="resumo_situacao"
          name="resumo_situacao"
          rows={4}
          placeholder="Digite um resumo da situação para facilitar o entendimento"
          className={`w-full ${hasError('resumo_situacao') ? 'border-orange-500 ring-1 ring-orange-500' : 'border-gray-300'}`}
          value={formData.resumo_situacao || ''}
          onChange={handleChange}
        />
        {hasError('resumo_situacao') && (
          <p className="text-orange-500 text-sm mt-1">{getErrorMessage('resumo_situacao')}</p>
        )}
      </div>

      <QuestionsSection
        perguntas={formData.perguntas}
        handlePerguntaChange={handlePerguntaChange}
        hasError={hasError('perguntas')}
        errorMessage={getErrorMessage('perguntas')}
      />

      <AttachmentsSection
        anexos={formData.anexos}
        handleAnexosChange={handleAnexosChange}
        hasError={hasError('anexos')}
        errorMessage={getErrorMessage('anexos')}
      />
    </div>
  );
};

export default OrganizeStep;
