
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Input } from '@/components/ui/input';
import { Search, ListFilter } from 'lucide-react';
import NotasTable from './NotasTable';
import NotasCards from './NotasCards';
import NotasFilter from './NotasFilter';
import NotaDetailDialog from './NotaDetailDialog';
import DeleteNotaDialog from './DeleteNotaDialog';
import { NotaOficial } from '@/types/nota';
import { ensureNotaCompat, prepareNotas } from './NotaCompat';

interface NotasContentProps {
  onViewNote?: (notaId: string) => void;
  onEditNote?: (notaId: string) => void;
}

const NotasContent: React.FC<NotasContentProps> = ({ onViewNote, onEditNote }) => {
  const [activeTab, setActiveTab] = useState<string>('tabela');
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedNotaId, setSelectedNotaId] = useState<string | null>(null);
  const [selectedNota, setSelectedNota] = useState<NotaOficial | null>(null);
  
  // Helper to format date
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('pt-BR');
    } catch (e) {
      return 'Data inválida';
    }
  };
  
  // Fetch notas oficiais
  const { data: notasRaw = [], isLoading } = useQuery({
    queryKey: ['notas_oficiais'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('notas_oficiais')
        .select(`
          id,
          titulo,
          texto,
          status,
          criado_em,
          atualizado_em,
          autor_id,
          autor:autor_id(id, nome_completo),
          problema_id,
          problema:problema_id(descricao),
          demanda_id,
          demanda:demanda_id(titulo, status)
        `)
        .order('criado_em', { ascending: false });
        
      if (error) throw error;
      
      // Transform data to match NotaOficial type
      const transformed = (data || []).map(nota => {
        // Handle possible SelectQueryError in autor
        const autor = typeof nota.autor === 'object' && nota.autor !== null
          ? { 
              id: nota.autor.id || nota.autor_id,
              nome_completo: nota.autor.nome_completo || 'Autor desconhecido'
            }
          : { id: nota.autor_id, nome_completo: 'Autor desconhecido' };
          
        return {
          id: nota.id,
          titulo: nota.titulo,
          texto: nota.texto,
          conteudo: nota.texto, // Map texto to conteudo for compatibility
          status: nota.status,
          criado_em: nota.criado_em,
          atualizado_em: nota.atualizado_em,
          autor_id: nota.autor_id,
          autor: autor,
          problema_id: nota.problema_id,
          problema: nota.problema,
          demanda_id: nota.demanda_id,
          demanda: nota.demanda
        } as NotaOficial;
      });
      
      return transformed;
    }
  });
  
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };
  
  const filteredNotas = notasRaw.filter(nota => {
    // Apply status filter if any are selected
    if (selectedStatus.length > 0 && !selectedStatus.includes(nota.status)) {
      return false;
    }
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        nota.titulo?.toLowerCase().includes(query) ||
        nota.texto?.toLowerCase().includes(query) ||
        nota.problema?.descricao?.toLowerCase().includes(query) ||
        nota.autor?.nome_completo?.toLowerCase().includes(query)
      );
    }
    
    return true;
  });
  
  const handleViewNota = (nota: NotaOficial) => {
    if (onViewNote) {
      onViewNote(nota.id);
    } else {
      setSelectedNota(nota);
      setSelectedNotaId(nota.id);
      setIsDetailOpen(true);
    }
  };
  
  const handleEditNota = (nota: NotaOficial) => {
    if (onEditNote) {
      onEditNote(nota.id);
    } else {
      // Implement default edit behavior if needed
      console.log("Edit nota", nota.id);
    }
  };
  
  const handleDeleteNota = (nota: NotaOficial) => {
    setSelectedNota(nota);
    setSelectedNotaId(nota.id);
    setIsDeleteOpen(true);
  };
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Buscar notas..."
            className="pl-9 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={toggleFilters}
            className="flex items-center gap-2"
          >
            <ListFilter className="h-4 w-4" />
            Filtros
          </Button>
          
          <Tabs 
            value={activeTab} 
            onValueChange={setActiveTab}
            className="hidden sm:flex"
          >
            <TabsList>
              <TabsTrigger value="tabela">Tabela</TabsTrigger>
              <TabsTrigger value="cards">Cards</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>
      
      {showFilters && (
        <NotasFilter
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
        />
      )}
      
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      ) : (
        <>
          <div className="hidden sm:block">
            <TabsContent value="tabela" className="m-0">
              <NotasTable 
                notas={filteredNotas}
                loading={isLoading}
                formatDate={formatDate}
                onViewNota={handleViewNota}
                onEditNota={handleEditNota}
                onDeleteNota={handleDeleteNota}
              />
            </TabsContent>
            
            <TabsContent value="cards" className="m-0">
              <NotasCards 
                notas={filteredNotas}
                loading={isLoading}
                formatDate={formatDate}
                onView={handleViewNota}
                onEdit={handleEditNota}
                onDelete={handleDeleteNota}
              />
            </TabsContent>
          </div>
          
          <div className="sm:hidden">
            <NotasCards 
              notas={filteredNotas}
              loading={isLoading}
              formatDate={formatDate}
              onView={handleViewNota}
              onEdit={handleEditNota}
              onDelete={handleDeleteNota}
            />
          </div>
        </>
      )}
      
      {selectedNota && (
        <>
          <NotaDetailDialog
            nota={selectedNota}
            open={isDetailOpen}
            onOpenChange={setIsDetailOpen}
            formatDate={formatDate}
          />
          
          <DeleteNotaDialog
            nota={selectedNota}
            open={isDeleteOpen}
            onOpenChange={setIsDeleteOpen}
          />
        </>
      )}
    </div>
  );
};

export default NotasContent;
