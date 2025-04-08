
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, MessageSquare } from 'lucide-react';
import { Demand } from '@/hooks/consultar-demandas/types';
import { format } from 'date-fns';

interface DemandaCardsProps {
  demandas: Demand[];
  isLoading: boolean;
  onSelectDemand: (demand: Demand) => void;
  onRespondDemand?: (demand: Demand) => void;
}

const DemandaCards: React.FC<DemandaCardsProps> = ({
  demandas,
  isLoading,
  onSelectDemand,
  onRespondDemand
}) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pendente':
      case 'pendente_resposta':
        return <Badge className="bg-yellow-400 hover:bg-yellow-500">Pendente</Badge>;
      case 'em_andamento':
        return <Badge className="bg-blue-500 hover:bg-blue-600">Em andamento</Badge>;
      case 'concluido':
        return <Badge className="bg-green-500 hover:bg-green-600">Concluído</Badge>;
      case 'cancelado':
        return <Badge className="bg-red-500 hover:bg-red-600">Cancelado</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    try {
      return format(new Date(dateString), 'dd/MM/yyyy');
    } catch (e) {
      return dateString;
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, index) => (
          <Card key={index} className="animate-pulse">
            <CardHeader>
              <div className="h-6 bg-gray-200 rounded w-3/4"></div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (demandas.length === 0) {
    return (
      <div className="text-center py-8">
        Nenhuma demanda encontrada.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {demandas.map((demanda) => (
        <Card key={demanda.id} className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg font-medium truncate">
                {demanda.titulo}
              </CardTitle>
              {getStatusBadge(demanda.status)}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-gray-500">Prioridade</p>
                  <p className="font-medium capitalize">{demanda.prioridade}</p>
                </div>
                <div>
                  <p className="text-gray-500">Data</p>
                  <p className="font-medium">{formatDate(demanda.horario_publicacao)}</p>
                </div>
                <div>
                  <p className="text-gray-500">Prazo</p>
                  <p className="font-medium">{formatDate(demanda.prazo_resposta)}</p>
                </div>
                <div>
                  <p className="text-gray-500">Área</p>
                  <p className="font-medium truncate">
                    {demanda.area_coordenacao?.descricao || 'Não informada'}
                  </p>
                </div>
              </div>
              
              <div className="flex justify-end gap-2 pt-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onSelectDemand(demanda)}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  Visualizar
                </Button>
                
                {onRespondDemand && demanda.status === 'pendente_resposta' && (
                  <Button 
                    variant="default" 
                    size="sm"
                    onClick={() => onRespondDemand(demanda)}
                  >
                    <MessageSquare className="h-4 w-4 mr-1" />
                    Responder
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DemandaCards;
