
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Demand, ResponseQA } from './types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Separator } from '@/components/ui/separator';
import { DemandaStatusBadge, PrioridadeBadge } from '@/components/ui/status-badge';
import { CalendarIcon, ClockIcon, User, MapPin } from 'lucide-react';

interface DemandaInfoProps {
  selectedDemanda: Demand;
  formattedResponses: ResponseQA[];
}

const DemandaInfo: React.FC<DemandaInfoProps> = ({
  selectedDemanda,
  formattedResponses
}) => {
  return (
    <Card className="border border-gray-200 rounded-xl">
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800">{selectedDemanda.titulo}</h2>
            <div className="flex flex-wrap gap-2 mt-2">
              <DemandaStatusBadge status={selectedDemanda.status} size="sm" />
              <PrioridadeBadge prioridade={selectedDemanda.prioridade} size="sm" />
            </div>
          </div>
          
          <Separator />
          
          {/* Metadata */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4 text-gray-500" />
              <span className="text-gray-600">Data de criação: </span>
              <span className="font-medium">
                {format(
                  new Date(selectedDemanda.horario_publicacao || selectedDemanda.created_at || new Date()), 
                  'dd/MM/yyyy', 
                  { locale: ptBR }
                )}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-gray-500" />
              <span className="text-gray-600">Criado por: </span>
              <span className="font-medium">{selectedDemanda.autor?.nome_completo || 'Não informado'}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <ClockIcon className="h-4 w-4 text-gray-500" />
              <span className="text-gray-600">Prazo para resposta: </span>
              <span className="font-medium">
                {selectedDemanda.prazo_resposta 
                  ? format(new Date(selectedDemanda.prazo_resposta), 'dd/MM/yyyy', { locale: ptBR })
                  : 'Data não informada'}
              </span>
            </div>
            
            {selectedDemanda.bairro && (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-500" />
                <span className="text-gray-600">Bairro: </span>
                <span className="font-medium">{selectedDemanda.bairro?.nome || 'Não informado'}</span>
              </div>
            )}
          </div>
          
          {/* Display the resumo_situacao field instead of detalhes_solicitacao */}
          {selectedDemanda.resumo_situacao ? (
            <>
              <Separator />
              <div>
                <h3 className="text-md font-semibold text-gray-800 mb-2">Resumo da situação</h3>
                <p className="text-gray-700 bg-gray-50 p-4 rounded-lg border border-gray-100">
                  {selectedDemanda.resumo_situacao}
                </p>
              </div>
            </>
          ) : selectedDemanda.detalhes_solicitacao && (
            <>
              <Separator />
              <div>
                <h3 className="text-md font-semibold text-gray-800 mb-2">Detalhes da solicitação</h3>
                <p className="text-gray-700 bg-gray-50 p-4 rounded-lg border border-gray-100">
                  {selectedDemanda.detalhes_solicitacao}
                </p>
              </div>
            </>
          )}
          
          {/* Responses display */}
          {formattedResponses && formattedResponses.length > 0 && (
            <>
              <Separator />
              <div>
                <h3 className="text-md font-semibold text-gray-800 mb-3">Respostas da área técnica</h3>
                <div className="space-y-4">
                  {formattedResponses.map((item, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg border border-gray-100 p-4">
                      <p className="font-medium text-gray-700 mb-1">{item.question}</p>
                      <p className="text-gray-600">{item.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DemandaInfo;
