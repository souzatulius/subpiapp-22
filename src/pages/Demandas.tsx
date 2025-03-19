
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Layout, DemandFilter, DemandList, DemandCards } from '@/components/demandas';
import DemandDetail from '@/components/demandas/DemandDetail';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

interface Demand {
  id: string;
  titulo: string;
  status: string;
  prioridade: string;
  horario_publicacao: string;
  prazo_resposta: string;
  area_coordenacao: { descricao: string } | null;
  servico: { descricao: string } | null;
  origem: { descricao: string } | null;
  tipo_midia: { descricao: string } | null;
  bairro: { nome: string } | null;
  autor: { nome_completo: string } | null;
  endereco: string | null;
  nome_solicitante: string | null;
  email_solicitante: string | null;
  telefone_solicitante: string | null;
  veiculo_imprensa: string | null;
  detalhes_solicitacao: string | null;
  perguntas: Record<string, string> | null;
}

const Demandas = () => {
  const [viewMode, setViewMode] = useState<'cards' | 'list'>('cards');
  const [filterStatus, setFilterStatus] = useState<string>('pendente');
  const [selectedDemand, setSelectedDemand] = useState<Demand | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Fetch demandas data with status filter
  const { data: demandasData, isLoading, error } = useQuery({
    queryKey: ['demandas', filterStatus],
    queryFn: async () => {
      let query = supabase
        .from('demandas')
        .select(`
          *,
          area_coordenacao:area_coordenacao_id(descricao),
          servico:servico_id(descricao),
          origem:origem_id(descricao),
          tipo_midia:tipo_midia_id(descricao),
          bairro:bairro_id(nome),
          autor:autor_id(nome_completo)
        `);
      
      if (filterStatus !== 'todos') {
        query = query.eq('status', filterStatus);
      }
      
      const { data, error } = await query.order('horario_publicacao', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      return data || [];
    },
    meta: {
      onError: (err: any) => {
        toast({
          title: "Erro ao carregar demandas",
          description: err.message || "Ocorreu um erro ao carregar as demandas.",
          variant: "destructive"
        });
      }
    }
  });

  // Transform the data to ensure 'perguntas' is correctly typed
  const demandas: Demand[] = demandasData ? demandasData.map(item => ({
    ...item,
    perguntas: item.perguntas ? (typeof item.perguntas === 'string' 
      ? JSON.parse(item.perguntas) 
      : item.perguntas as Record<string, string>)
    : null
  })) : [];

  // If there's an error, we can handle it here as well to provide a backup UI
  if (error) {
    console.error("Error loading demands:", error);
  }

  const handleSelectDemand = (demand: Demand) => {
    setSelectedDemand(demand);
    setIsDetailOpen(true);
  };

  const handleCloseDetail = () => {
    setIsDetailOpen(false);
    setSelectedDemand(null);
  };

  return (
    <Layout>
      <DemandFilter 
        viewMode={viewMode} 
        setViewMode={setViewMode} 
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
      />
      
      {viewMode === 'cards' ? (
        <DemandCards 
          demandas={demandas} 
          isLoading={isLoading} 
          onSelectDemand={handleSelectDemand}
        />
      ) : (
        <DemandList 
          demandas={demandas} 
          isLoading={isLoading} 
          onSelectDemand={handleSelectDemand}
        />
      )}

      <DemandDetail 
        demand={selectedDemand}
        isOpen={isDetailOpen}
        onClose={handleCloseDetail}
      />
    </Layout>
  );
};

export default Demandas;
