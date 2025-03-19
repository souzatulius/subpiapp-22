
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { AlertCircle, Clock, CheckCircle2, Archive, XCircle } from 'lucide-react';

interface Demand {
  id: string;
  titulo: string;
  status: string;
  prioridade: string;
  horario_publicacao: string;
  prazo_resposta: string;
  area_coordenacao: { descricao: string } | null;
  origem: { descricao: string } | null;
  autor: { nome_completo: string } | null;
}

interface DemandCardsProps {
  demandas: Demand[];
  isLoading: boolean;
}

const DemandCards: React.FC<DemandCardsProps> = ({ demandas, isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i} className="bg-white border shadow-sm animate-pulse">
            <CardContent className="p-6">
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
              <div className="flex gap-2 mb-4">
                <div className="h-6 bg-gray-200 rounded w-16"></div>
                <div className="h-6 bg-gray-200 rounded w-20"></div>
              </div>
            </CardContent>
            <CardFooter className="bg-gray-50 px-6 py-3 border-t">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  if (demandas.length === 0) {
    return (
      <div className="text-center p-12 border border-dashed rounded-lg">
        <h3 className="text-lg font-medium mb-2">Nenhuma demanda encontrada</h3>
        <p className="text-gray-500">Não há demandas com os filtros selecionados.</p>
      </div>
    );
  }

  // Helper function to get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pendente':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'em_andamento':
        return <AlertCircle className="h-4 w-4 text-blue-500" />;
      case 'concluida':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'arquivada':
        return <Archive className="h-4 w-4 text-gray-500" />;
      case 'cancelada':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  // Helper function to get status text
  const formatStatus = (status: string) => {
    switch (status) {
      case 'pendente': return 'Pendente';
      case 'em_andamento': return 'Em Andamento';
      case 'concluida': return 'Concluída';
      case 'arquivada': return 'Arquivada';
      case 'cancelada': return 'Cancelada';
      default: return status;
    }
  };

  // Helper function to get priority badge color
  const getPriorityColor = (prioridade: string) => {
    switch (prioridade) {
      case 'alta':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'media':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'baixa':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Helper function to format priority text
  const formatPriority = (prioridade: string) => {
    switch (prioridade) {
      case 'alta': return 'Alta';
      case 'media': return 'Média';
      case 'baixa': return 'Baixa';
      default: return prioridade;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {demandas.map((demanda) => (
        <Card key={demanda.id} className="bg-white border shadow-sm hover:shadow-md transition-all cursor-pointer">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-semibold text-lg line-clamp-2">{demanda.titulo}</h3>
            </div>
            
            <div className="text-sm text-gray-600 mb-2">
              {demanda.area_coordenacao?.descricao}
            </div>
            
            <div className="flex flex-wrap gap-2 mb-3">
              <Badge variant="outline" className={`${getPriorityColor(demanda.prioridade)}`}>
                {formatPriority(demanda.prioridade)}
              </Badge>
              
              <Badge variant="outline" className="flex items-center gap-1">
                {getStatusIcon(demanda.status)}
                {formatStatus(demanda.status)}
              </Badge>
            </div>
            
            <div className="text-xs text-gray-500 flex flex-col gap-1">
              <div>
                <span className="font-medium">Origem:</span> {demanda.origem?.descricao || 'Não especificado'}
              </div>
              <div>
                <span className="font-medium">Criada em:</span> {demanda.horario_publicacao ? 
                  format(new Date(demanda.horario_publicacao), 'dd/MM/yyyy', { locale: ptBR }) : 
                  'Data não disponível'
                }
              </div>
              <div>
                <span className="font-medium">Prazo:</span> {demanda.prazo_resposta ? 
                  format(new Date(demanda.prazo_resposta), 'dd/MM/yyyy', { locale: ptBR }) : 
                  'Sem prazo definido'
                }
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="bg-gray-50 px-6 py-3 border-t">
            <div className="text-xs text-gray-500 w-full">
              <span className="font-medium">Responsável:</span> {demanda.autor?.nome_completo || 'Não atribuído'}
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default DemandCards;
