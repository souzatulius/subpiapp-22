
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
  
  // Fetch notas oficiais
  const { data: notas = [], isLoading } = useQuery({
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
          autor:autor_id(nome_completo),
          problema_id,
          problema:problema_id(descricao),
          demanda_id,
          demanda:demanda_id(titulo, status)
        `)
        .order('criado_em', { ascending: false });
        
      if (error) throw error;
      return data;
    }
  });
  
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };
  
  const filteredNotas = notas.filter(nota => {
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
  
  const handleViewNota = (notaId: string) => {
    if (onViewNote) {
      onViewNote(notaId);
    } else {
      setSelectedNotaId(notaId);
      setIsDetailOpen(true);
    }
  };
  
  const handleEditNota = (notaId: string) => {
    if (onEditNote) {
      onEditNote(notaId);
    } else {
      // Implement default edit behavior if needed
      console.log("Edit nota", notaId);
    }
  };
  
  const handleDeleteNota = (notaId: string) => {
    setSelectedNotaId(notaId);
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
                onView={handleViewNota}
                onEdit={handleEditNota}
                onDelete={handleDeleteNota}
              />
            </TabsContent>
            
            <TabsContent value="cards" className="m-0">
              <NotasCards 
                notas={filteredNotas}
                onView={handleViewNota}
                onEdit={handleEditNota}
                onDelete={handleDeleteNota}
              />
            </TabsContent>
          </div>
          
          <div className="sm:hidden">
            <NotasCards 
              notas={filteredNotas}
              onView={handleViewNota}
              onEdit={handleEditNota}
              onDelete={handleDeleteNota}
            />
          </div>
        </>
      )}
      
      {selectedNotaId && (
        <>
          <NotaDetailDialog
            notaId={selectedNotaId}
            open={isDetailOpen}
            onOpenChange={setIsDetailOpen}
          />
          
          <DeleteNotaDialog
            notaId={selectedNotaId}
            open={isDeleteOpen}
            onOpenChange={setIsDeleteOpen}
          />
        </>
      )}
    </div>
  );
};

export default NotasContent;
