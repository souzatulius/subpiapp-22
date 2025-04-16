import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Calendar as CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from 'date-fns/locale';
import { DatePicker } from "@/components/ui/date-picker"
import { ValidationError } from '@/lib/formValidationUtils';

interface ProtocolStepProps {
  formData: {
    origem_id: string;
    tipo_midia_id: string;
    detalhes_solicitacao: string;
    prioridade: string;
    prazo_resposta: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
  origens: any[];
  tiposMidia: any[];
  errors: ValidationError[];
  nextStep: () => void;
}

const ProtocolStep: React.FC<ProtocolStepProps> = ({
  formData,
  handleChange,
  handleSelectChange,
  origens,
  tiposMidia,
  errors,
  nextStep
}) => {
  const hasError = (field: string) => errors.some(err => err.field === field);
  const getErrorMessage = (field: string) => {
    const error = errors.find(err => err.field === field);
    return error ? error.message : '';
  };

  const formatDate = (date: Date | undefined): string => {
    return date ? format(date, 'yyyy-MM-dd', { locale: ptBR }) : '';
  };

  return (
    <div className="space-y-6">
      {/* Origem da demanda */}
      <div>
        <label 
          htmlFor="origem_id" 
          className={`form-question-title ${hasError('origem_id') ? 'text-orange-500 font-semibold' : ''}`}
        >
          Qual a origem da demanda? {hasError('origem_id') && <span className="text-orange-500">*</span>}
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {origens.map(origem => (
            <button 
              key={origem.id}
              type="button"
              className={`h-auto py-4 px-2 flex flex-col items-center justify-center text-center border rounded-xl ${formData.origem_id === origem.id ? 'bg-orange-500 text-white border-orange-500' : 'bg-white text-gray-700 border-gray-200 hover:bg-orange-50'} ${hasError('origem_id') ? 'border-orange-500' : ''}`}
              onClick={() => handleSelectChange('origem_id', origem.id)}
            >
              <span className="text-sm font-medium">{origem.descricao}</span>
            </button>
          ))}
        </div>
        {hasError('origem_id') && (
          <p className="text-orange-500 text-sm mt-1">{getErrorMessage('origem_id')}</p>
        )}
      </div>

      {/* Prioridade */}
      <div>
        <Label 
          htmlFor="prioridade" 
          className={`form-question-title ${hasError('prioridade') ? 'text-orange-500 font-semibold' : ''}`}
        >
          Qual o nível de prioridade? {hasError('prioridade') && <span className="text-orange-500">*</span>}
        </Label>
        <Select onValueChange={(value) => handleSelectChange('prioridade', value)}>
          <SelectTrigger className={`rounded-xl ${hasError('prioridade') ? 'border-orange-500' : ''}`}>
            <SelectValue placeholder="Selecione a prioridade" defaultValue={formData.prioridade} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="baixa">Baixa</SelectItem>
            <SelectItem value="media">Média</SelectItem>
            <SelectItem value="alta">Alta</SelectItem>
          </SelectContent>
        </Select>
        {hasError('prioridade') && (
          <p className="text-orange-500 text-sm mt-1">{getErrorMessage('prioridade')}</p>
        )}
      </div>

      {/* Prazo para resposta */}
      <div>
        <Label 
          htmlFor="prazo_resposta" 
          className={`form-question-title ${hasError('prazo_resposta') ? 'text-orange-500 font-semibold' : ''}`}
        >
          Qual o prazo para resposta? {hasError('prazo_resposta') && <span className="text-orange-500">*</span>}
        </Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={
                `w-full justify-start text-left font-normal rounded-xl
                ${hasError('prazo_resposta') ? 'border-orange-500 text-orange-500' : ''}
                ${!formData.prazo_resposta ? 'text-muted-foreground' : ''}`
              }
            >
              <Calendar className="mr-2 h-4 w-4" />
              {formData.prazo_resposta ? (
                format(new Date(formData.prazo_resposta), "dd/MM/yyyy", { locale: ptBR })
              ) : (
                <span>Selecione a data</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start" side="bottom">
            <DatePicker
              mode="single"
              locale={ptBR}
              selected={formData.prazo_resposta ? new Date(formData.prazo_resposta) : undefined}
              onSelect={(date) => {
                const formattedDate = formatDate(date);
                handleSelectChange('prazo_resposta', formattedDate);
              }}
              disabled={false}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        {hasError('prazo_resposta') && (
          <p className="text-orange-500 text-sm mt-1">{getErrorMessage('prazo_resposta')}</p>
        )}
      </div>
      
      {/* Detalhes solicitação - update this section with rounded borders */}
      <div className="space-y-2">
        <label 
          htmlFor="detalhes_solicitacao" 
          className={`form-question-title ${hasError('detalhes_solicitacao') ? 'text-orange-500 font-semibold' : ''}`}
        >
          Descreva a demanda com detalhes: {hasError('detalhes_solicitacao') && <span className="text-orange-500">*</span>}
        </label>
        <textarea 
          id="detalhes_solicitacao" 
          name="detalhes_solicitacao" 
          rows={5} 
          className={`w-full border p-3 rounded-xl ${hasError('detalhes_solicitacao') ? 'border-orange-500' : 'border-gray-300'}`}
          placeholder="Descreva a demanda com detalhes para facilitar o entendimento da área técnica..." 
          value={formData.detalhes_solicitacao || ''}
          onChange={handleChange}
        />
        {hasError('detalhes_solicitacao') && (
          <p className="text-orange-500 text-sm mt-1">{getErrorMessage('detalhes_solicitacao')}</p>
        )}
      </div>
      
      {/* Next Step Button */}
      <div className="flex justify-end">
        <Button onClick={nextStep}>Próximo</Button>
      </div>
    </div>
  );
};

export default ProtocolStep;
