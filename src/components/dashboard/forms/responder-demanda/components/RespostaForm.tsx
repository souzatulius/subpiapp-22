
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Upload, ExternalLink } from 'lucide-react';
import { formatarData } from '../utils/formatters';
import { Demanda } from '../types';
import { Separator } from '@/components/ui/separator';

interface RespostaFormProps {
  selectedDemanda: Demanda;
  resposta: string;
  setResposta: (resposta: string) => void;
  respostasPerguntas: Record<string, string>;
  handleRespostaPerguntaChange: (perguntaIndex: string, value: string) => void;
  onBack: () => void;
  isLoading: boolean;
  onSubmit: () => void;
}

const RespostaForm: React.FC<RespostaFormProps> = ({
  selectedDemanda,
  resposta,
  setResposta,
  respostasPerguntas,
  handleRespostaPerguntaChange,
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
        <div className="space-y-4">
          {perguntas.map((pergunta, index) => (
            <div key={index} className="bg-white p-4 rounded-md border border-gray-200 shadow-sm">
              <p className="font-medium text-gray-700 mb-2">{pergunta}</p>
              <Textarea 
                value={respostasPerguntas[index.toString()] || ''} 
                onChange={e => handleRespostaPerguntaChange(index.toString(), e.target.value)} 
                placeholder="Digite sua resposta para esta pergunta..." 
                rows={3} 
                className="w-full" 
              />
            </div>
          ))}
        </div>
      );
    }
    
    // If perguntas is an object (Record<string, string>)
    if (typeof perguntas === 'object') {
      return (
        <div className="space-y-4">
          {Object.entries(perguntas).map(([key, value], index) => (
            <div key={key} className="bg-white p-4 rounded-md border border-gray-200 shadow-sm">
              <p className="font-medium text-gray-700 mb-2">{value}</p>
              <Textarea 
                value={respostasPerguntas[key] || ''} 
                onChange={e => handleRespostaPerguntaChange(key, e.target.value)} 
                placeholder="Digite sua resposta para esta pergunta..." 
                rows={3} 
                className="w-full" 
              />
            </div>
          ))}
        </div>
      );
    }
    
    // If perguntas is a string, just display it without calling toString()
    return (
      <div className="bg-white p-4 rounded-md border border-gray-200 shadow-sm">
        <p className="font-medium text-gray-700 mb-2">{String(perguntas)}</p>
        <Textarea 
          value={respostasPerguntas['0'] || ''} 
          onChange={e => handleRespostaPerguntaChange('0', e.target.value)} 
          placeholder="Digite sua resposta para esta pergunta..." 
          rows={3} 
          className="w-full" 
        />
      </div>
    );
  };

  const renderAttachment = () => {
    if (!selectedDemanda.arquivo_url) return null;
    
    return (
      <div className="mt-6">
        <p className="text-sm font-medium text-gray-500 mb-2">Arquivo Anexado</p>
        <div className="flex items-center gap-2 p-3 bg-gray-50 border border-gray-200 rounded-md">
          <Upload className="h-5 w-5 text-blue-500" />
          <div className="flex-1 min-w-0">
            <p className="truncate text-sm font-medium">{selectedDemanda.arquivo_nome || 'Arquivo anexado'}</p>
          </div>
          <a 
            href={selectedDemanda.arquivo_url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            <span className="text-sm">Visualizar</span>
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </div>
    );
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
            <p>{selectedDemanda.problema?.descricao || 'Não informada'}</p>
          </div>
          
          <div>
            <p className="text-sm font-medium text-gray-500">Serviço</p>
            <p>{selectedDemanda.servicos?.descricao || 'Não informado'}</p>
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
        
        {renderAttachment()}
        
        {selectedDemanda.detalhes_solicitacao && (
          <div className="mt-6">
            <p className="text-sm font-medium text-gray-500 mb-2">Detalhes da Solicitação</p>
            <p className="text-sm whitespace-pre-line bg-gray-50 p-4 rounded-md border border-gray-200">
              {selectedDemanda.detalhes_solicitacao}
            </p>
          </div>
        )}
        
        {selectedDemanda.perguntas && (
          <div className="mt-6">
            <p className="text-sm font-medium text-gray-500 mb-2">Perguntas e Respostas</p>
            {renderPerguntas()}
          </div>
        )}
        
        <Separator className="my-6" />
        
        <div className="mt-6">
          <p className="text-sm font-medium text-gray-500 mb-2">Observações Adicionais</p>
          <Textarea 
            value={resposta} 
            onChange={e => setResposta(e.target.value)} 
            placeholder="Digite observações adicionais aqui..." 
            rows={4} 
            className="w-full" 
          />
        </div>
        
        <div className="mt-8 flex justify-end">
          <Button 
            onClick={onSubmit} 
            disabled={isLoading} 
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
