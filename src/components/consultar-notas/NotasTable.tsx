
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Eye, Edit, Trash } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { NotaOficial } from '@/types/nota';

export interface NotasTableProps {
  notas: NotaOficial[];
  loading: boolean;
  formatDate: (dateString: string) => string;
  onViewNota: (nota: NotaOficial) => void;
  onEditNota: (nota: NotaOficial) => void;
  onDeleteNota: (nota: NotaOficial) => void;
}

const NotasTable: React.FC<NotasTableProps> = ({ 
  notas, 
  loading, 
  formatDate,
  onViewNota,
  onEditNota,
  onDeleteNota
}) => {
  if (loading) {
    return (
      <div className="bg-white rounded-md shadow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Título</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Data de Criação</TableHead>
              <TableHead>Área</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={index}>
                <TableCell><Skeleton className="h-4 w-3/4" /></TableCell>
                <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Skeleton className="h-8 w-8" />
                    <Skeleton className="h-8 w-8" />
                    <Skeleton className="h-8 w-8" />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (notas.length === 0) {
    return (
      <div className="bg-white rounded-md shadow p-6 text-center">
        <p className="text-gray-500">Nenhuma nota encontrada.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-md shadow overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Título</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Data de Criação</TableHead>
            <TableHead>Área</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {notas.map((nota) => (
            <TableRow key={nota.id}>
              <TableCell className="font-medium">{nota.titulo}</TableCell>
              <TableCell>
                <Badge className={`
                  ${nota.status === 'rascunho' ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' : 
                    nota.status === 'aprovada' ? 'bg-green-100 text-green-800 hover:bg-green-200' : 
                    nota.status === 'pendente' ? 'bg-blue-100 text-blue-800 hover:bg-blue-200' : 
                    'bg-gray-100 text-gray-800 hover:bg-gray-200'}
                `}>
                  {nota.status.charAt(0).toUpperCase() + nota.status.slice(1)}
                </Badge>
              </TableCell>
              <TableCell>{formatDate(nota.criado_em || '')}</TableCell>
              <TableCell>{nota.area_coordenacao?.descricao || 'Não definida'}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end space-x-2">
                  <Button variant="ghost" size="sm" onClick={() => onViewNota(nota)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => onEditNota(nota)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => onDeleteNota(nota)}>
                    <Trash className="h-4 w-4" />
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

export default NotasTable;
