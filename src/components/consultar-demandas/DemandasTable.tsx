
import React from 'react';
import {
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Eye, Edit, FileText, Trash2, Plus } from 'lucide-react';
import { Demand } from '@/hooks/consultar-demandas/types';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { NotaOficial } from '@/types/nota';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface DemandasTableProps {
  demandas: Demand[];
  isLoading: boolean;
  onViewDemand: (demand: Demand) => void;
  onCreateNote: (demand: Demand) => void;
  onViewNote: (nota: NotaOficial) => void;
  onEditNote: (nota: NotaOficial) => void;
}

const DemandasTable: React.FC<DemandasTableProps> = ({
  demandas,
  isLoading,
  onViewDemand,
  onCreateNote,
  onViewNote,
  onEditNote
}) => {
  const formatDate = (dateString: string) => {
    try {
      if (!dateString) return 'Não informado';
      return format(new Date(dateString), 'dd/MM/yyyy', { locale: ptBR });
    } catch (e) {
      return 'Data inválida';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pendente':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Pendente</Badge>;
      case 'em_andamento':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800">Em andamento</Badge>;
      case 'respondida':
        return <Badge variant="outline" className="bg-green-100 text-green-800">Respondida</Badge>;
      case 'aguardando_aprovacao':
        return <Badge variant="outline" className="bg-purple-100 text-purple-800">Aguardando aprovação</Badge>;
      case 'concluida':
        return <Badge variant="outline" className="bg-green-700 text-white">Concluída</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <Card className="overflow-hidden border border-gray-200">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Área</TableHead>
                <TableHead>Data de Publicação</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array(5).fill(0).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-6 w-full" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-28" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-36" /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    );
  }

  if (demandas.length === 0) {
    return (
      <Card className="p-6 text-center border border-gray-200">
        <p className="text-gray-500">Nenhuma demanda encontrada.</p>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden border border-gray-200">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Título</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Área</TableHead>
              <TableHead>Data de Publicação</TableHead>
              <TableHead>Nota</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {demandas.map((demanda) => (
              <TableRow key={demanda.id}>
                <TableCell className="font-medium max-w-xs truncate">
                  {demanda.titulo}
                </TableCell>
                <TableCell>{getStatusBadge(demanda.status)}</TableCell>
                <TableCell>{demanda.area_coordenacao?.descricao || 'Não informada'}</TableCell>
                <TableCell>{formatDate(demanda.horario_publicacao)}</TableCell>
                <TableCell>
                  {/* Show note status or create button */}
                  {demanda.notas && demanda.notas.length > 0 ? (
                    <Badge className="bg-blue-100 text-blue-800">Nota criada</Badge>
                  ) : demanda.resposta ? (
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => onCreateNote(demanda)}
                      className="flex items-center gap-1"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>Criar Nota</span>
                    </Button>
                  ) : (
                    <Badge variant="outline" className="bg-gray-100 text-gray-600">Sem resposta</Badge>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onViewDemand(demanda)}
                      className="h-8 w-8 p-0"
                      title="Ver detalhes"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    
                    {/* Note actions if available */}
                    {demanda.notas && demanda.notas.length > 0 && demanda.notas.map((nota) => (
                      <React.Fragment key={nota.id}>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onViewNote({ ...nota, texto: '', conteudo: '' } as NotaOficial)}
                          className="h-8 w-8 p-0"
                          title="Ver nota"
                        >
                          <FileText className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onEditNote({ ...nota, texto: '', conteudo: '' } as NotaOficial)}
                          className="h-8 w-8 p-0"
                          title="Editar nota"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </React.Fragment>
                    ))}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};

export default DemandasTable;
