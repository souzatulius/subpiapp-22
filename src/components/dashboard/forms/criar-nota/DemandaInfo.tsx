
import React from 'react';
import { Info, FileText, Calendar, User, Mail, Phone, MapPin } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Demand, ResponseQA } from './types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface DemandaInfoProps {
  selectedDemanda: Demand;
  formattedResponses: ResponseQA[];
}

const DemandaInfo: React.FC<DemandaInfoProps> = ({ 
  selectedDemanda,
  formattedResponses
}) => {
  return (
    <div className="space-y-4 p-4 bg-slate-50 rounded-lg">
      <div className="flex items-start gap-2">
        <Info className="h-5 w-5 text-blue-500 mt-0.5" />
        <div>
          <h3 className="font-medium text-lg">Informações da Demanda</h3>
          <p className="text-sm text-gray-500">
            {selectedDemanda.problema?.descricao || 'Problema não especificado'}
          </p>
        </div>
      </div>

      <div>
        <h4 className="font-medium">Título da Demanda</h4>
        <p>{selectedDemanda.titulo}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex items-start gap-2">
          <Calendar className="h-4 w-4 mt-0.5 text-gray-500" />
          <div>
            <h4 className="text-sm font-medium">Data de Criação</h4>
            <p className="text-sm">
              {selectedDemanda.criado_em ? format(new Date(selectedDemanda.criado_em), 'dd/MM/yyyy', { locale: ptBR }) : 'Não informada'}
            </p>
          </div>
        </div>
        
        <div className="flex items-start gap-2">
          <FileText className="h-4 w-4 mt-0.5 text-gray-500" />
          <div>
            <h4 className="text-sm font-medium">Veículo de Imprensa</h4>
            <p className="text-sm">{selectedDemanda.veiculo_imprensa || 'Não informado'}</p>
          </div>
        </div>
      </div>

      <Separator />
      
      <div className="space-y-3">
        <h4 className="font-medium">Dados do Solicitante</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-start gap-2">
            <User className="h-4 w-4 mt-0.5 text-gray-500" />
            <div>
              <h4 className="text-sm font-medium">Nome</h4>
              <p className="text-sm">{selectedDemanda.nome_solicitante || 'Não informado'}</p>
            </div>
          </div>
          
          <div className="flex items-start gap-2">
            <Mail className="h-4 w-4 mt-0.5 text-gray-500" />
            <div>
              <h4 className="text-sm font-medium">Email</h4>
              <p className="text-sm">{selectedDemanda.email_solicitante || 'Não informado'}</p>
            </div>
          </div>
          
          <div className="flex items-start gap-2">
            <Phone className="h-4 w-4 mt-0.5 text-gray-500" />
            <div>
              <h4 className="text-sm font-medium">Telefone</h4>
              <p className="text-sm">{selectedDemanda.telefone_solicitante || 'Não informado'}</p>
            </div>
          </div>
        </div>
      </div>

      {selectedDemanda.endereco && (
        <div className="flex items-start gap-2">
          <MapPin className="h-4 w-4 mt-0.5 text-gray-500" />
          <div>
            <h4 className="text-sm font-medium">Endereço</h4>
            <p className="text-sm">{selectedDemanda.endereco}</p>
          </div>
        </div>
      )}

      {selectedDemanda.detalhes_solicitacao && (
        <div>
          <h4 className="font-medium">Detalhes da Solicitação</h4>
          <div className="bg-white p-3 rounded border mt-2">
            <p className="whitespace-pre-line text-sm">{selectedDemanda.detalhes_solicitacao}</p>
          </div>
        </div>
      )}
      
      {selectedDemanda.perguntas && Object.keys(selectedDemanda.perguntas).length > 0 && (
        <div>
          <h4 className="font-medium">Perguntas</h4>
          <div className="space-y-2 mt-2">
            {Object.entries(selectedDemanda.perguntas).map(([key, question]) => (
              <div key={key} className="bg-white p-3 rounded border">
                <p className="font-medium text-sm">{question}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {formattedResponses.length > 0 && (
        <div>
          <h4 className="font-medium">Respostas</h4>
          <div className="space-y-3 mt-2">
            {formattedResponses.map((resp, index) => (
              <div key={index} className="bg-white p-3 rounded border">
                <p className="font-medium text-sm">{resp.question}</p>
                <Separator className="my-2" />
                <p className="text-gray-700 text-sm">{resp.answer}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DemandaInfo;
