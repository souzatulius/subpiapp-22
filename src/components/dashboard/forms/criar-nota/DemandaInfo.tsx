
import React from 'react';
import { Demand, ResponseQA } from '@/types/demand';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface DemandaInfoProps {
  selectedDemanda: Demand;
  formattedResponses: ResponseQA[];
}

const DemandaInfo: React.FC<DemandaInfoProps> = ({
  selectedDemanda,
  formattedResponses
}) => {
  // Format the date
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy', { locale: ptBR });
    } catch (error) {
      return 'Data inválida';
    }
  };

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pendente':
        return 'bg-yellow-100 text-yellow-800';
      case 'em_andamento':
        return 'bg-blue-100 text-blue-800';
      case 'respondida':
        return 'bg-green-100 text-green-800';
      case 'aguardando_aprovacao':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="border border-gray-200">
      <CardContent className="p-4">
        <h2 className="text-lg font-semibold mb-4">Informações da Demanda</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Título</h3>
            <p className="mt-1">{selectedDemanda.titulo}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500">Status</h3>
            <div className="mt-1">
              <Badge variant="outline" className={getStatusColor(selectedDemanda.status)}>
                {selectedDemanda.status === 'em_andamento' ? 'Em andamento' : 
                  selectedDemanda.status.charAt(0).toUpperCase() + selectedDemanda.status.slice(1)}
              </Badge>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500">Área</h3>
            <p className="mt-1">{selectedDemanda.area_coordenacao?.descricao || 'Não informada'}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500">Data de Publicação</h3>
            <p className="mt-1">{selectedDemanda.horario_publicacao ? formatDate(selectedDemanda.horario_publicacao) : 'Não informada'}</p>
          </div>

          {selectedDemanda.detalhes_solicitacao && (
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-sm font-medium text-gray-500">Detalhes da Solicitação</h3>
              <p className="mt-1 text-sm whitespace-pre-line">{selectedDemanda.detalhes_solicitacao}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DemandaInfo;
