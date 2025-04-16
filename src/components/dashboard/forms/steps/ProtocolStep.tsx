
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BellRing, Flame, Clock } from "lucide-react";
import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import { ptBR } from 'date-fns/locale';
import { ValidationError } from '@/lib/formValidationUtils';
import { useOriginIcon } from '@/hooks/useOriginIcon';
import Protocolo156 from './identification/Protocolo156';
import { formatDateTime } from '@/lib/utils';
import { AnimatedDateTimePicker } from '@/components/ui/date-time-picker';

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

  // Handle date-time picker change
  const handleDateTimeChange = (isoDateString: string) => {
    handleSelectChange('prazo_resposta', isoDateString);
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

      {/* Prazo para resposta - with new AnimatedDateTimePicker */}
      <div>
        <AnimatedDateTimePicker
          value={formData.prazo_resposta || ''}
          onChange={handleDateTimeChange}
          label="Qual o prazo para resposta?"
          placeholder="DD/MM/AAAA HH:MM"
          error={hasError('prazo_resposta')}
          errorMessage={getErrorMessage('prazo_resposta')}
          className="w-full"
        />
        <p className="text-gray-500 text-sm mt-1">Clique no ícone de calendário para selecionar a data e horário</p>
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
