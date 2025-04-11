
import React from 'react';
import { Eye, Edit, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { NotaOficial } from '@/types/nota';
import UnifiedViewContainer from '@/components/shared/unified-view/UnifiedViewContainer';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

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
  const [searchTerm, setSearchTerm] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('todos');
  const [viewMode, setViewMode] = React.useState<'cards' | 'list'>('list');

  const statusOptions = [
    { id: 'todos', label: 'Todos os status' },
    { id: 'rascunho', label: 'Rascunho' },
    { id: 'pendente', label: 'Pendente' },
    { id: 'aprovada', label: 'Aprovada' },
    { id: 'publicada', label: 'Publicada' },
    { id: 'recusada', label: 'Recusada' }
  ];

  const filteredNotas = notas.filter(nota => {
    const matchesSearch = searchTerm === '' || 
      (nota.titulo?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (nota.conteudo?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (nota.autor?.nome_completo?.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'todos' || nota.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const renderNotaCard = (nota: NotaOficial) => {
    return (
      <div className="border border-gray-200 rounded-xl p-4 bg-white">
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <h3 className="font-medium text-lg mb-1">{nota.titulo}</h3>
            <Badge className={`
              rounded-xl
              ${nota.status === 'rascunho' ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' : 
                nota.status === 'aprovada' ? 'bg-green-100 text-green-800 hover:bg-green-200' : 
                nota.status === 'pendente' ? 'bg-blue-100 text-blue-800 hover:bg-blue-200' : 
                'bg-gray-100 text-gray-800 hover:bg-gray-200'}
            `}>
              {nota.status.charAt(0).toUpperCase() + nota.status.slice(1)}
            </Badge>
          </div>
        </div>
        
        <div className="text-sm text-gray-600 space-y-1">
          <p>
            <span className="font-medium mr-1">Data:</span>
            {formatDate(nota.criado_em || '')}
          </p>
          <p>
            <span className="font-medium mr-1">Área:</span>
            {nota.area_coordenacao?.descricao || 'Não definida'}
          </p>
          {nota.autor && (
            <p>
              <span className="font-medium mr-1">Autor:</span>
              {nota.autor.nome_completo}
            </p>
          )}
        </div>
        
        <div className="mt-4 flex justify-end space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={(e) => {
              e.stopPropagation();
              onViewNota(nota);
            }}
            className="rounded-xl"
          >
            <Eye className="h-4 w-4 mr-1" /> Ver
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={(e) => {
              e.stopPropagation();
              onEditNota(nota);
            }}
            className="rounded-xl"
          >
            <Edit className="h-4 w-4 mr-1" /> Editar
          </Button>
          
          <Button 
            variant="destructive" 
            size="sm" 
            onClick={(e) => {
              e.stopPropagation();
              onDeleteNota(nota);
            }}
            className="rounded-xl"
          >
            <Trash className="h-4 w-4 mr-1" /> Excluir
          </Button>
        </div>
      </div>
    );
  };

  return (
    <UnifiedViewContainer
      items={filteredNotas}
      isLoading={loading}
      renderListItem={renderNotaCard}
      renderGridItem={renderNotaCard}
      idExtractor={(nota) => nota.id || ''}
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      onItemClick={onViewNota}
      filterOptions={{
        primaryFilter: {
          value: statusFilter,
          onChange: setStatusFilter,
          options: statusOptions,
          placeholder: 'Status'
        }
      }}
      emptyStateMessage="Nenhuma nota encontrada"
      searchPlaceholder="Buscar notas..."
      defaultViewMode={viewMode}
      className="bg-white rounded-xl"
    />
  );
};

export default NotasTable;
