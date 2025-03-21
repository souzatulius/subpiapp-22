
import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, Eye, MessageSquare, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { type Demand } from '@/hooks/consultar-demandas/useDemandasData';

interface DemandasTableProps {
  demandas: Demand[];
  isLoading: boolean;
  onViewDemand: (demand: Demand) => void;
  onRespondDemand: (demand: Demand) => void;
  onDeleteClick: (demand: Demand) => void;
}

const DemandasTable: React.FC<DemandasTableProps> = ({
  demandas,
  isLoading,
  onViewDemand,
  onRespondDemand,
  onDeleteClick
}) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pendente':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">Nova</Badge>;
      case 'em_andamento':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">Aguardando Respostas</Badge>;
      case 'respondida':
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">Respondida</Badge>;
      case 'nota_criada':
        return <Badge variant="outline" className="bg-indigo-100 text-indigo-800 border-indigo-300">Nota Criada</Badge>;
      case 'nota_aprovada':
        return <Badge variant="outline" className="bg-emerald-100 text-emerald-800 border-emerald-300">Nota Aprovada</Badge>;
      case 'nota_rejeitada':
        return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300">Nota Rejeitada</Badge>;
      case 'aguardando_nota':
        return <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-300">Aguardando Nota</Badge>;
      case 'pendente_aprovacao':
        return <Badge variant="outline" className="bg-orange-100 text-orange-800 border-orange-300">Pendente de Aprovação</Badge>;
      case 'aprovada':
        return <Badge variant="outline" className="bg-emerald-100 text-emerald-800 border-emerald-300">Aprovada</Badge>;
      case 'editada':
        return <Badge variant="outline" className="bg-cyan-100 text-cyan-800 border-cyan-300">Editada</Badge>;
      case 'recusada':
        return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300">Recusada</Badge>;
      case 'arquivada':
        return <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-300">Arquivada</Badge>;
      case 'cancelada':
        return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300">Cancelada</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (demandas.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Nenhuma demanda encontrada</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Título</TableHead>
            <TableHead>Área</TableHead>
            <TableHead>Serviço</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Data</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {demandas.map((demand) => (
            <TableRow key={demand.id}>
              <TableCell className="font-medium">{demand.titulo}</TableCell>
              <TableCell>{demand.area_coordenacao?.descricao || '-'}</TableCell>
              <TableCell>{demand.servico?.descricao || '-'}</TableCell>
              <TableCell>{getStatusBadge(demand.status)}</TableCell>
              <TableCell>
                {demand.horario_publicacao
                  ? format(new Date(demand.horario_publicacao), 'dd/MM/yyyy', { locale: ptBR })
                  : '-'}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onViewDemand(demand)}
                    title="Visualizar"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onRespondDemand(demand)}
                    title="Responder"
                  >
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDeleteClick(demand)}
                    title="Excluir"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default DemandasTable;
