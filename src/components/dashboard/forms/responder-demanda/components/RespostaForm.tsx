
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Upload } from 'lucide-react';
import { formatarData } from '../utils/formatters';
import { Demanda } from '../types';

interface RespostaFormProps {
  selectedDemanda: Demanda;
  resposta: string;
  setResposta: (resposta: string) => void;
  onBack: () => void;
  isLoading: boolean;
  onSubmit: () => void;
}

const RespostaForm: React.FC<RespostaFormProps> = ({
  selectedDemanda,
  resposta,
  setResposta,
  onBack,
  isLoading,
  onSubmit
}) => {
  // Helper function to render perguntas safely
  const renderPerguntas = () => {
    const { perguntas } = selectedDemanda;
    
    // If perguntas is null or undefined, return nothing
    if (!perguntas) return null;
    
    // If perguntas is an array of strings
    if (Array.isArray(perguntas)) {
      return (
        <ul className="list-disc pl-5 space-y-1">
          {perguntas.map((pergunta, index) => (
            <li key={index} className="text-sm">{String(pergunta)}</li>
          ))}
        </ul>
      );
    }
    
    // If perguntas is an object (Record<string, string>)
    if (typeof perguntas === 'object') {
      return (
        <ul className="list-disc pl-5 space-y-1">
          {Object.entries(perguntas).map(([key, value], index) => (
            <li key={index} className="text-sm">{String(value)}</li>
          ))}
        </ul>
      );
    }
    
    // If perguntas is a string or any other primitive, convert to string
    return <p className="text-sm">{String(perguntas)}</p>;
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <Button variant="ghost" onClick={onBack} className="p-1.5">
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </Button>
        <h3 className="text-xl font-medium mt-4">{selectedDemanda.titulo}</h3>
        
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-500">Área de Coordenação</p>
            <p>{selectedDemanda.areas_coordenacao?.descricao || 'Não informada'}</p>
          </div>
          
          <div>
            <p className="text-sm font-medium text-gray-500">Origem</p>
            <p>{selectedDemanda.origens_demandas?.descricao || 'Não informada'}</p>
          </div>
          
          <div>
            <p className="text-sm font-medium text-gray-500">Tipo de Mídia</p>
            <p>{selectedDemanda.tipos_midia?.descricao || 'Não informado'}</p>
          </div>
          
          <div>
            <p className="text-sm font-medium text-gray-500">Prazo</p>
            <p>{selectedDemanda.prazo_resposta ? formatarData(selectedDemanda.prazo_resposta) : 'Não informado'}</p>
          </div>
          
          <div>
            <p className="text-sm font-medium text-gray-500">Prioridade</p>
            <p className="capitalize">{selectedDemanda.prioridade}</p>
          </div>
        </div>
        
        {selectedDemanda.perguntas && (
          <div className="mt-6">
            <p className="text-sm font-medium text-gray-500 mb-2">Perguntas</p>
            {renderPerguntas()}
          </div>
        )}
        
        {selectedDemanda.detalhes_solicitacao && (
          <div className="mt-6">
            <p className="text-sm font-medium text-gray-500 mb-2">Detalhes da Solicitação</p>
            <p className="text-sm whitespace-pre-line">{selectedDemanda.detalhes_solicitacao}</p>
          </div>
        )}
        
        <div className="mt-8">
          <p className="text-sm font-medium text-gray-500 mb-2">Resposta</p>
          <Textarea 
            value={resposta} 
            onChange={e => setResposta(e.target.value)} 
            placeholder="Digite sua resposta aqui..." 
            rows={6} 
            className="w-full" 
          />
        </div>
        
        <div className="mt-4">
          <div className="flex items-center justify-center border-2 border-dashed border-gray-300 p-4 rounded-md">
            <div className="space-y-1 text-center">
              <Upload className="mx-auto h-8 w-8 text-gray-400" />
              <div className="text-sm text-gray-500">
                <label htmlFor="file-upload" className="relative cursor-pointer rounded-md bg-white font-medium text-blue-600 hover:text-blue-500">
                  <span>Anexar arquivo</span>
                  <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                </label>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-8 flex justify-end">
          <Button 
            onClick={onSubmit} 
            disabled={isLoading || !resposta.trim()} 
            className="bg-[#003570] hover:bg-[#002855]"
          >
            {isLoading ? "Enviando..." : "Enviar Resposta"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RespostaForm;
