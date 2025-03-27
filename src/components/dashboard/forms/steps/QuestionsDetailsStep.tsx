
import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ValidationError } from '@/lib/formValidationUtils';
import { Plus, Trash2, Upload, FileText } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import { toast } from '@/components/ui/use-toast';

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
  
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{[key: string]: number}>({});
  
  const hasError = (field: string) => errors.some(err => err.field === field);
  const getErrorMessage = (field: string) => {
    const error = errors.find(err => err.field === field);
    return error ? error.message : '';
  };

  // Observe typing to automatically add a new question
  useEffect(() => {
    const nonEmptyQuestions = formData.perguntas.filter(p => p.trim() !== '');
    
    // If the last question isn't empty and we can add more questions
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
    // Update active questions
    const newActiveQuestions = activeQuestions.filter(i => i !== index).map((val, idx) => idx);
    setActiveQuestions(newActiveQuestions);
    
    // Update formData
    const newPerguntas = [...formData.perguntas];
    newPerguntas.splice(index, 1);
    newPerguntas.push(''); // Keep array with 5 positions
    
    // Update using the existing method
    for (let i = 0; i < newPerguntas.length; i++) {
      if (i < newActiveQuestions.length) {
        handlePerguntaChange(i, newPerguntas[i]);
      } else {
        handlePerguntaChange(i, '');
      }
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const newFiles = Array.from(e.target.files);
    setUploading(true);
    
    try {
      // Upload each file to Supabase and get public URLs
      const publicUrls: string[] = [];
      
      for (const file of newFiles) {
        const fileId = uuidv4();
        const fileExt = file.name.split('.').pop();
        const fileName = `${fileId}.${fileExt}`;
        const filePath = `uploads/${fileName}`;
        
        // Set initial progress
        setUploadProgress(prev => ({ ...prev, [fileId]: 0 }));
        
        // Upload file
        const { error: uploadError } = await supabase.storage
          .from('demandas')
          .upload(filePath, file, {
            onUploadProgress: (progress) => {
              const percent = Math.round((progress.loaded / progress.total) * 100);
              setUploadProgress(prev => ({ ...prev, [fileId]: percent }));
            }
          });
          
        if (uploadError) throw uploadError;
        
        // Get public URL
        const { data } = supabase.storage
          .from('demandas')
          .getPublicUrl(filePath);
          
        publicUrls.push(data.publicUrl);
      }
      
      // Update form data with public URLs
      if (handleAnexosChange) {
        handleAnexosChange([...(formData.anexos || []), ...publicUrls]);
      }
      
      toast({
        title: 'Arquivos anexados',
        description: `${newFiles.length} arquivos foram anexados com sucesso.`,
      });
    } catch (error: any) {
      console.error('Erro ao fazer upload:', error);
      toast({
        title: 'Erro ao anexar arquivos',
        description: error.message || 'Não foi possível anexar um ou mais arquivos.',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
      setUploadProgress({});
    }
  };

  const removeFile = (index: number) => {
    if (handleAnexosChange && formData.anexos) {
      const newAnexosUrls = [...formData.anexos];
      newAnexosUrls.splice(index, 1);
      handleAnexosChange(newAnexosUrls);
      
      toast({
        title: 'Arquivo removido',
        description: 'O arquivo foi removido da lista de anexos.',
      });
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
        <Label className="block mb-2">Anexos</Label>
        <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center">
          <input
            type="file"
            id="file-upload"
            multiple
            className="hidden"
            onChange={handleFileChange}
            disabled={uploading}
          />
          <label htmlFor="file-upload" className="cursor-pointer">
            <div className="flex flex-col items-center">
              <Upload className="h-10 w-10 text-gray-400 mb-2" />
              <p className="text-sm text-gray-600 mb-1">
                {uploading ? 'Enviando arquivos...' : 'Arraste arquivos ou clique para fazer upload'}
              </p>
              <p className="text-xs text-gray-500">Suporta imagens, PDFs e documentos (máximo 5MB)</p>
            </div>
          </label>
        </div>

        {formData.anexos && formData.anexos.length > 0 && (
          <div className="mt-4 space-y-2">
            <Label>Arquivos anexados</Label>
            <div className="flex flex-col gap-2">
              {formData.anexos.map((fileUrl, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded-lg">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-blue-500" />
                    <span className="text-sm">{fileUrl.split('/').pop()}</span>
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
