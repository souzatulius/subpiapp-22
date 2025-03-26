
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Trash2, Plus } from 'lucide-react';
import { ValidationError } from '@/lib/formValidationUtils';
import { hasFieldError, getFieldErrorMessage } from './identification/ValidationUtils';

interface OrganizeStepProps {
  formData: {
    titulo: string;
    perguntas: string[];
    anexos: string[];
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handlePerguntaChange: (index: number, value: string) => void;
  handleSelectChange: (name: string, value: string | boolean) => void;
  handleAnexosChange: (files: string[]) => void;
  errors?: ValidationError[];
}

const OrganizeStep: React.FC<OrganizeStepProps> = ({
  formData,
  handleChange,
  handlePerguntaChange,
  handleSelectChange,
  handleAnexosChange,
  errors = []
}) => {
  const addPergunta = () => {
    const newPerguntas = [...formData.perguntas, ''];
    // Use handleAnexosChange for consistency, even though it's for questions
    handlePerguntaChange(formData.perguntas.length, '');
  };

  const removePergunta = (index: number) => {
    const newPerguntas = [...formData.perguntas];
    newPerguntas.splice(index, 1);
    // Update the entire perguntas array
    const updatedPerguntas = newPerguntas.filter(pergunta => pergunta !== '');
    for (let i = 0; i < 5; i++) {
      if (i < updatedPerguntas.length) {
        handlePerguntaChange(i, updatedPerguntas[i]);
      } else {
        handlePerguntaChange(i, '');
      }
    }
  };

  const onFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      
      // Here in a real implementation, you'd upload the files to storage
      // and then store their URLs. For this example, we'll just use the filenames
      const fileUrls = files.map(file => URL.createObjectURL(file));
      
      handleAnexosChange([...formData.anexos, ...fileUrls]);
    }
  };

  const removeAnexo = (index: number) => {
    const newAnexos = [...formData.anexos];
    newAnexos.splice(index, 1);
    handleAnexosChange(newAnexos);
  };

  return (
    <div className="space-y-6">
      <div>
        <Label 
          htmlFor="titulo" 
          className={`block mb-2 ${hasFieldError('titulo', errors) ? 'text-orange-500 font-semibold' : ''}`}
        >
          Título da Demanda
        </Label>
        <Input 
          id="titulo" 
          name="titulo" 
          value={formData.titulo} 
          onChange={handleChange} 
          className={`rounded-xl ${hasFieldError('titulo', errors) ? 'border-orange-500' : ''}`}
          placeholder="Digite um título claro e conciso"
        />
        {hasFieldError('titulo', errors) && (
          <p className="text-orange-500 text-sm mt-1">{getFieldErrorMessage('titulo', errors)}</p>
        )}
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <Label htmlFor="perguntas" className="block">
            Perguntas para a Área Técnica
          </Label>
          <Button 
            type="button" 
            size="sm" 
            variant="outline" 
            onClick={addPergunta}
            className="rounded-xl"
            disabled={formData.perguntas.filter(p => p !== '').length >= 5}
          >
            <Plus className="h-4 w-4 mr-1" /> Adicionar Pergunta
          </Button>
        </div>
        
        <div className="space-y-2">
          {formData.perguntas.map((pergunta, index) => (
            pergunta !== '' || index === 0 ? (
              <div key={index} className="flex gap-2">
                <Input 
                  value={pergunta} 
                  onChange={(e) => handlePerguntaChange(index, e.target.value)} 
                  placeholder="Digite sua pergunta aqui"
                  className="flex-1 rounded-xl"
                />
                <Button 
                  type="button" 
                  size="icon" 
                  variant="ghost" 
                  onClick={() => removePergunta(index)}
                  disabled={index === 0 && formData.perguntas.filter(p => p !== '').length === 1}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            ) : null
          ))}
          
          {formData.perguntas.filter(p => p !== '').length === 0 && (
            <p className="text-sm text-gray-500 italic">
              Adicione perguntas específicas para a área técnica responder
            </p>
          )}
        </div>
      </div>

      <div>
        <Label htmlFor="anexos" className="block mb-2">
          Anexos
        </Label>
        
        <div className="space-y-4">
          <div className="flex items-center justify-center w-full">
            <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V8m0 0-3 3m3-3 3 3"/>
                </svg>
                <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Clique para enviar</span> ou arraste e solte</p>
                <p className="text-xs text-gray-500">Formatos: PNG, JPG, PDF, DOCX, XLSX (MAX 10MB)</p>
              </div>
              <input 
                id="dropzone-file" 
                type="file" 
                className="hidden" 
                multiple 
                onChange={onFileUpload} 
              />
            </label>
          </div>
          
          {formData.anexos.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {formData.anexos.map((anexo, index) => (
                <div key={index} className="flex items-center justify-between p-2 border rounded-xl bg-gray-50">
                  <div className="truncate flex-1">
                    {typeof anexo === 'string' ? anexo.split('/').pop() : ''}
                  </div>
                  <Button 
                    type="button" 
                    size="icon" 
                    variant="ghost" 
                    onClick={() => removeAnexo(index)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrganizeStep;
