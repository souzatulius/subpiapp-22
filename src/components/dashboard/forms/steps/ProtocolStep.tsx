
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BellRing, Flame, Clock } from "lucide-react";
import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import { ptBR } from 'date-fns/locale';
import { DatePicker } from "@/components/ui/date-picker"
import { ValidationError } from '@/lib/formValidationUtils';
import { useOriginIcon } from '@/hooks/useOriginIcon';
import Protocolo156 from './identification/Protocolo156';

interface ProtocolStepProps {
  formData: {
    origem_id: string;
    tipo_midia_id: string;
    detalhes_solicitacao: string;
    prioridade: string;
    prazo_resposta: string;
    tem_protocolo_156?: boolean;
    numero_protocolo_156?: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (name: string, value: string | boolean) => void;
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

  // Allow deselection of origin
  const handleOriginClick = (originId: string) => {
    if (formData.origem_id === originId) {
      handleSelectChange('origem_id', ''); // Deselect if clicking the same origin
    } else {
      handleSelectChange('origem_id', originId);
    }
  };

  return (
    <div className="space-y-6">
      {/* Origem da demanda - Updated with icons */}
      <div>
        <label 
          htmlFor="origem_id" 
          className={`form-question-title ${hasError('origem_id') ? 'text-orange-500 font-semibold' : ''}`}
        >
          Qual a origem da demanda? {hasError('origem_id') && <span className="text-orange-500">*</span>}
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {origens.map(origem => (
            <Button 
              key={origem.id}
              type="button"
              variant={formData.origem_id === origem.id ? "default" : "outline"}
              className={`h-auto py-3 flex flex-col items-center justify-center gap-2 selection-button rounded-xl ${
                formData.origem_id === origem.id ? "bg-orange-500 hover:bg-orange-600 text-white" : ""
              } ${
                hasError('origem_id') ? 'border-orange-500' : ''
              }`}
              onClick={() => handleOriginClick(origem.id)}
            >
              {useOriginIcon(origem, "h-8 w-8")}
              <span className="text-sm font-semibold">{origem.descricao}</span>
            </Button>
          ))}
        </div>
        {hasError('origem_id') && (
          <p className="text-orange-500 text-sm mt-1">{getErrorMessage('origem_id')}</p>
        )}
      </div>

      {/* Protocol 156 Field */}
      <Protocolo156 
        temProtocolo156={formData.tem_protocolo_156}
        numeroProtocolo156={formData.numero_protocolo_156}
        handleSelectChange={(value) => handleSelectChange('tem_protocolo_156', value)}
        handleChange={handleChange}
        errors={errors}
      />

      {/* Prioridade - Updated as buttons with icons */}
      <div>
        <Label 
          htmlFor="prioridade" 
          className={`form-question-title ${hasError('prioridade') ? 'text-orange-500 font-semibold' : ''}`}
        >
          Qual o nível de prioridade? {hasError('prioridade') && <span className="text-orange-500">*</span>}
        </Label>
        <div className="flex flex-wrap gap-3">
          <Button 
            type="button" 
            variant="outline" 
            className={`h-auto py-3 flex flex-col items-center justify-center gap-2 border-gray-300
              ${formData.prioridade === 'alta' ? 
                "bg-orange-500 text-white border-transparent hover:bg-orange-600" : 
                "hover:bg-gray-100 hover:text-gray-800"}
              ${hasError('prioridade') ? 'border-orange-500' : ''}
              transition-all duration-300`}
            onClick={() => handleSelectChange('prioridade', 'alta')}
          >
            <div className={formData.prioridade === 'alta' ? "text-white" : "text-red-500"}>
              <Flame className="h-5 w-5" />
            </div>
            <span className="text-sm font-semibold">
              Urgente
            </span>
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            className={`h-auto py-3 flex flex-col items-center justify-center gap-2 border-gray-300
              ${formData.prioridade === 'media' ? 
                "bg-orange-500 text-white border-transparent hover:bg-orange-600" : 
                "hover:bg-gray-100 hover:text-gray-800"}
              ${hasError('prioridade') ? 'border-orange-500' : ''}
              transition-all duration-300`}
            onClick={() => handleSelectChange('prioridade', 'media')}
          >
            <div className={formData.prioridade === 'media' ? "text-white" : "text-blue-500"}>
              <BellRing className="h-5 w-5" />
            </div>
            <span className="text-sm font-semibold">
              Normal
            </span>
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            className={`h-auto py-3 flex flex-col items-center justify-center gap-2 border-gray-300
              ${formData.prioridade === 'baixa' ? 
                "bg-orange-500 text-white border-transparent hover:bg-orange-600" : 
                "hover:bg-gray-100 hover:text-gray-800"}
              ${hasError('prioridade') ? 'border-orange-500' : ''}
              transition-all duration-300`}
            onClick={() => handleSelectChange('prioridade', 'baixa')}
          >
            <div className={formData.prioridade === 'baixa' ? "text-white" : "text-green-500"}>
              <Clock className="h-5 w-5" />
            </div>
            <span className="text-sm font-semibold">
              Baixa
            </span>
          </Button>
        </div>
        {hasError('prioridade') && (
          <p className="text-orange-500 text-sm mt-1">{getErrorMessage('prioridade')}</p>
        )}
      </div>

      {/* Prazo para resposta - with enhanced DatePicker */}
      <div>
        <Label 
          htmlFor="prazo_resposta" 
          className={`form-question-title ${hasError('prazo_resposta') ? 'text-orange-500 font-semibold' : ''}`}
        >
          Qual o prazo para resposta? {hasError('prazo_resposta') && <span className="text-orange-500">*</span>}
        </Label>
        <div className="w-full">
          <input
            type="text"
            id="prazo_resposta"
            name="prazo_resposta"
            placeholder="DD/MM/AAAA HH:MM"
            value={formData.prazo_resposta ? formatDateTime(formData.prazo_resposta) : ''}
            onChange={(e) => {
              handleChange(e);
              
              // Try to parse the input to an ISO date string
              try {
                // Convert DD/MM/YYYY HH:MM to ISO
                const value = e.target.value;
                const dateTimeParts = value.split(' ');
                if (dateTimeParts.length !== 2) return;
                
                const dateParts = dateTimeParts[0].split('/');
                const timeParts = dateTimeParts[1].split(':');
                
                if (dateParts.length !== 3 || timeParts.length !== 2) return;
                
                const day = parseInt(dateParts[0], 10);
                const month = parseInt(dateParts[1], 10) - 1; // Month is 0-indexed in JS Date
                const year = parseInt(dateParts[2], 10);
                const hours = parseInt(timeParts[0], 10);
                const minutes = parseInt(timeParts[1], 10);
                
                if (isNaN(day) || isNaN(month) || isNaN(year) || 
                    isNaN(hours) || isNaN(minutes)) return;
                
                const date = new Date(year, month, day, hours, minutes);
                const isoString = date.toISOString();
                
                handleSelectChange('prazo_resposta', isoString);
              } catch (error) {
                console.error('Error parsing date input:', error);
              }
            }}
            className={`w-full h-12 rounded-xl border ${hasError('prazo_resposta') ? 'border-orange-500' : 'border-gray-300'} bg-white px-4 py-3`}
          />
        </div>
        <p className="text-gray-500 text-sm mt-1">Digite a data no formato DD/MM/AAAA HH:MM (Ex: 31/12/2023 14:30)</p>
        {hasError('prazo_resposta') && (
          <p className="text-orange-500 text-sm mt-1">{getErrorMessage('prazo_resposta')}</p>
        )}
      </div>
      
      {/* Detalhes solicitação */}
      <div className="space-y-2">
        <label 
          htmlFor="detalhes_solicitacao" 
          className={`form-question-title ${hasError('detalhes_solicitacao') ? 'text-orange-500 font-semibold' : ''}`}
        >
          Descreva a demanda com detalhes... {hasError('detalhes_solicitacao') && <span className="text-orange-500">*</span>}
        </label>
        <textarea 
          id="detalhes_solicitacao" 
          name="detalhes_solicitacao" 
          rows={5} 
          className={`w-full border p-3 rounded-xl ${hasError('detalhes_solicitacao') ? 'border-orange-500' : 'border-gray-300'}`}
          placeholder="Digite aqui os detalhes ou cole o email recebido" 
          value={formData.detalhes_solicitacao || ''}
          onChange={handleChange}
        />
        {hasError('detalhes_solicitacao') && (
          <p className="text-orange-500 text-sm mt-1">{getErrorMessage('detalhes_solicitacao')}</p>
        )}
      </div>
    </div>
  );
};

export default ProtocolStep;
