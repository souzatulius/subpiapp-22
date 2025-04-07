
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { NotaOficial } from '@/types/nota';
import { Eye, Edit, Check, X, Trash, FileText } from 'lucide-react';
import { NotaStatusBadge } from '@/components/ui/status-badge';
import { useAuth } from '@/hooks/useSupabaseAuth';

interface NotasTableProps {
  notas: NotaOficial[];
  loading?: boolean;
  formatDate?: (date: string) => string;
  onViewNota?: (nota: NotaOficial) => void;
  onEditNota?: (nota: NotaOficial) => void;
  onDeleteNota?: (nota: NotaOficial) => void;
  onApproveNota?: (nota: NotaOficial) => void;
  onRejectNota?: (nota: NotaOficial) => void;
}

const NotasTable: React.FC<NotasTableProps> = ({
  notas,
  loading = false,
  formatDate = (date) => date,
  onViewNota,
  onEditNota,
  onDeleteNota,
  onApproveNota,
  onRejectNota
}) => {
  const { user } = useAuth();
  
  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
        <p className="mt-2 text-gray-500">Carregando notas...</p>
      </div>
    );
  }

  if (!notas || notas.length === 0) {
    return (
      <div className="text-center py-8 border border-dashed rounded-lg">
        <FileText className="mx-auto h-10 w-10 text-gray-400" />
        <p className="mt-2 text-gray-500">Nenhuma nota encontrada</p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-x-auto">
      <Table>
        <TableHeader className="bg-gray-50">
          <TableRow>
            <TableHead>Título</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Autor</TableHead>
            <TableHead>Área</TableHead>
            <TableHead>Data</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {notas.map((nota) => (
            <TableRow key={nota.id} className="hover:bg-gray-50">
              <TableCell className="font-medium">{nota.titulo}</TableCell>
              <TableCell>
                <NotaStatusBadge status={nota.status} />
              </TableCell>
              <TableCell>
                {nota.autor ? nota.autor.nome_completo : 'Não informado'}
              </TableCell>
              <TableCell>
                {nota.area_coordenacao?.descricao || nota.problema?.descricao || 'Não informada'}
              </TableCell>
              <TableCell>{formatDate(nota.criado_em)}</TableCell>
              <TableCell>
                <div className="flex justify-end items-center space-x-2">
                  {onViewNota && (
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => onViewNota(nota)}
                      title="Visualizar"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  )}
                  
                  {onEditNota && (
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => onEditNota(nota)}
                      title="Editar"
                      className="text-amber-600"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  )}
                  
                  {onApproveNota && nota.status === 'pendente' && (
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => onApproveNota(nota)}
                      title="Aprovar"
                      className="text-green-600"
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                  )}
                  
                  {onRejectNota && nota.status === 'pendente' && (
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => onRejectNota(nota)}
                      title="Recusar"
                      className="text-red-600"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                  
                  {onDeleteNota && (
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => onDeleteNota(nota)}
                      title="Excluir"
                      className="text-red-600"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default NotasTable;
