
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import NotaCard from './NotaCard';
import { LoadingState, EmptyState, NoAccessState, SearchEmptyState } from './NotasListStates';
import { NotaOficial } from '@/types/nota';

interface NotasListProps {
  notas: NotaOficial[];
  onSelectNota: (nota: NotaOficial) => void;
  emptyMessage?: string;
  isLoading: boolean;
  selectedNota?: NotaOficial | null;
  isAdmin?: boolean;
}

const NotasList: React.FC<NotasListProps> = ({ 
  notas, 
  selectedNota = null, 
  onSelectNota, 
  isAdmin = true, 
  isLoading,
  emptyMessage = "Nenhuma nota pendente de aprovação no momento."
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  if (!isAdmin) {
    return <NoAccessState />;
  }
  
  if (isLoading) {
    return <LoadingState />;
  }

  if (notas.length === 0) {
    return <EmptyState message={emptyMessage} />;
  }

  // Filtrar notas com base no termo de busca
  const filteredNotas = notas.filter(nota => 
    nota.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (nota.autor?.nome_completo?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (nota.supervisao_tecnica?.descricao?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
        <Input
          type="text"
          placeholder="Buscar notas por título, autor ou área..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-8"
        />
      </div>
      
      {filteredNotas.length === 0 ? (
        <SearchEmptyState />
      ) : (
        filteredNotas.map((nota) => (
          <NotaCard
            key={nota.id}
            nota={nota}
            isSelected={selectedNota?.id === nota.id}
            onClick={() => onSelectNota(nota)}
          />
        ))
      )}
    </div>
  );
};

export default NotasList;
