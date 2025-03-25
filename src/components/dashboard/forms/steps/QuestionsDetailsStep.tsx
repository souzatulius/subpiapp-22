
import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { ValidationError } from '@/lib/formValidationUtils';
import { Plus, Trash2, Upload, File, FileText } from 'lucide-react';

interface QuestionsDetailsStepProps {
  formData: {
    perguntas: string[];
    detalhes_solicitacao: string;
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
  handleChange,
  handlePerguntaChange,
  handleSelectChange,
  handleAnexosChange,
  errors = []
}) => {
  const [activeQuestions, setActiveQuestions] = useState<number[]>(
    formData.perguntas.filter(p => p.trim() !== '').length > 0 
      ? formData.perguntas.filter(p => p.trim() !== '').map((_, i) => i) 
      : [0]
  );
  
  const [anexos, setAnexos] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  
  const hasError = (field: string) => errors.some(err => err.field === field);
  const getErrorMessage = (field: string) => {
    const error = errors.find(err => err.field === field);
    return error ? error.message : '';
  };

  // Observa digitação para adicionar nova pergunta automaticamente
  useEffect(() => {
    const nonEmptyQuestions = formData.perguntas.filter(p => p.trim() !== '');
    
    // Se a última pergunta não está vazia e podemos adicionar mais perguntas
    if (nonEmptyQuestions.length > 0 && 
        nonEmptyQuestions.length === activeQuestions.length && 
        activeQuestions.length < 5) {
      addQuestion();
    }
  }, [formData.perguntas]);

  const addQuestion = () => {
    if (activeQuestions.length < 5) {
      const nextIndex = activeQuestions.length;
      setActiveQuestions([...activeQuestions, nextIndex]);
    }
  };

  const removeQuestion = (index: number) => {
    // Atualizar perguntas ativas
    const newActiveQuestions = activeQuestions.filter(i => i !== index).map((val, idx) => idx);
    setActiveQuestions(newActiveQuestions);
    
    // Atualizar formData
    const newPerguntas = [...formData.perguntas];
    newPerguntas.splice(index, 1);
    newPerguntas.push(''); // Manter array com 5 posições
    
    // Atualizar usando o método existente
    for (let i = 0; i < newPerguntas.length; i++) {
      if (i < newActiveQuestions.length) {
        handlePerguntaChange(i, newPerguntas[i]);
      } else {
        handlePerguntaChange(i, '');
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setAnexos([...anexos, ...newFiles]);
      
      // Simular upload e adicionar URLs (numa aplicação real, isto seria substituído pelo upload real)
      if (handleAnexosChange) {
        const fakeUrls = newFiles.map(file => URL.createObjectURL(file));
        handleAnexosChange([...(formData.anexos || []), ...fakeUrls]);
      }
    }
  };

  const removeFile = (index: number) => {
    const newAnexos = [...anexos];
    newAnexos.splice(index, 1);
    setAnexos(newAnexos);
    
    if (handleAnexosChange && formData.anexos) {
      const newAnexosUrls = [...formData.anexos];
      newAnexosUrls.splice(index, 1);
      handleAnexosChange(newAnexosUrls);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex justify-between items-center mb-2">
          <Label className={`block ${hasError('perguntas') ? 'text-orange-500 font-semibold' : ''}`}>
            Perguntas para a Área Técnica
          </Label>
        </div>
        
        <div className="space-y-3">
          {activeQuestions.map(index => (
            <div key={index} className="flex gap-2">
              <div className="w-full bg-white border border-gray-300 rounded-xl shadow-sm flex items-center px-4 transition-all hover:shadow-md">
                <input
                  value={formData.perguntas[index] || ''}
                  onChange={(e) => handlePerguntaChange(index, e.target.value)}
                  className="border-0 shadow-none focus:outline-none focus:ring-0 focus:ring-offset-0 w-full py-3 bg-transparent"
                  placeholder={`Pergunta ${index + 1}`}
                />
              </div>
              {activeQuestions.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeQuestion(index)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
        
        {hasError('perguntas') && (
          <p className="text-orange-500 text-sm mt-1">{getErrorMessage('perguntas')}</p>
        )}
      </div>

      <div>
        <Label htmlFor="detalhes_solicitacao" className={`block mb-2 ${hasError('detalhes_solicitacao') ? 'text-orange-500 font-semibold' : ''}`}>
          Detalhes da Solicitação
        </Label>
        <Textarea
          id="detalhes_solicitacao"
          name="detalhes_solicitacao"
          value={formData.detalhes_solicitacao}
          onChange={handleChange}
          rows={5}
          className={hasError('detalhes_solicitacao') ? 'border-orange-500' : ''}
        />
        {hasError('detalhes_solicitacao') && (
          <p className="text-orange-500 text-sm mt-1">{getErrorMessage('detalhes_solicitacao')}</p>
        )}
      </div>

      <div>
        <Label className="block mb-2">Anexos</Label>
        <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center">
          <input
            type="file"
            id="file-upload"
            multiple
            className="hidden"
            onChange={handleFileChange}
          />
          <label htmlFor="file-upload" className="cursor-pointer">
            <div className="flex flex-col items-center">
              <Upload className="h-10 w-10 text-gray-400 mb-2" />
              <p className="text-sm text-gray-600 mb-1">Arraste arquivos ou clique para fazer upload</p>
              <p className="text-xs text-gray-500">Suporta imagens, PDFs e documentos (máximo 5MB)</p>
            </div>
          </label>
        </div>

        {anexos.length > 0 && (
          <div className="mt-4 space-y-2">
            <Label>Arquivos anexados</Label>
            <div className="flex flex-col gap-2">
              {anexos.map((file, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded-lg">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-blue-500" />
                    <span className="text-sm">{file.name}</span>
                    <span className="text-xs text-gray-500">
                      ({(file.size / 1024).toFixed(1)} KB)
                    </span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(index)}
                    className="text-red-500 hover:text-red-700 p-1"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionsDetailsStep;
