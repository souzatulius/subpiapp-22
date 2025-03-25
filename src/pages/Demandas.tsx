
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Layout, DemandFilter, DemandList, DemandCards } from '@/components/demandas';
import DemandDetail from '@/components/demandas/DemandDetail';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import Header from '@/components/layouts/Header';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Demand {
  id: string;
  titulo: string;
  status: string;
  prioridade: string;
  horario_publicacao: string;
  prazo_resposta: string;
  area_coordenacao: {
    descricao: string;
  } | null;
  servico: {
    descricao: string;
  } | null;
  origem: {
    descricao: string;
  } | null;
  tipo_midia: {
    descricao: string;
  } | null;
  bairro: {
    nome: string;
  } | null;
  autor: {
    nome_completo: string;
  } | null;
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
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Buscar demandas com filtro de status
  const {
    data: demandasData,
    isLoading,
    error
  } = useQuery({
    queryKey: ['demandas', filterStatus],
    queryFn: async () => {
      // Construir a consulta base
      let query = supabase.from('demandas')
        .select(`
          id,
          titulo,
          status,
          prioridade,
          horario_publicacao,
          prazo_resposta,
          area_coordenacao_id,
          servico_id,
          origem_id,
          tipo_midia_id,
          bairro_id,
          autor_id,
          endereco,
          nome_solicitante,
          email_solicitante,
          telefone_solicitante,
          veiculo_imprensa,
          detalhes_solicitacao,
          perguntas
        `);
        
      // Aplicar filtro de status se não for 'todos'
      if (filterStatus !== 'todos') {
        query = query.eq('status', filterStatus);
      }
      
      // Executar a consulta principal
      const { data, error } = await query.order('horario_publicacao', {
        ascending: false
      });
      
      if (error) throw error;
      
      // Agora vamos buscar as informações relacionadas em consultas separadas
      const enhancedData = await Promise.all(data.map(async (demanda) => {
        // Buscar área de coordenação
        let areaCoord = null;
        if (demanda.area_coordenacao_id) {
          const { data: areaData } = await supabase
            .from('areas_coordenacao')
            .select('descricao')
            .eq('id', demanda.area_coordenacao_id)
            .single();
            
          areaCoord = areaData;
        }
        
        // Buscar serviço
        let servico = null;
        if (demanda.servico_id) {
          const { data: servicoData } = await supabase
            .from('servicos')
            .select('descricao')
            .eq('id', demanda.servico_id)
            .single();
            
          servico = servicoData;
        }
        
        // Buscar origem
        let origem = null;
        if (demanda.origem_id) {
          const { data: origemData } = await supabase
            .from('origens_demandas')
            .select('descricao')
            .eq('id', demanda.origem_id)
            .single();
            
          origem = origemData;
        }
        
        // Buscar tipo de mídia
        let tipoMidia = null;
        if (demanda.tipo_midia_id) {
          const { data: midiaData } = await supabase
            .from('tipos_midia')
            .select('descricao')
            .eq('id', demanda.tipo_midia_id)
            .single();
            
          tipoMidia = midiaData;
        }
        
        // Buscar bairro
        let bairro = null;
        if (demanda.bairro_id) {
          const { data: bairroData } = await supabase
            .from('bairros')
            .select('nome')
            .eq('id', demanda.bairro_id)
            .single();
            
          bairro = bairroData;
        }
        
        // Buscar autor
        let autor = null;
        if (demanda.autor_id) {
          const { data: autorData } = await supabase
            .from('usuarios')
            .select('nome_completo')
            .eq('id', demanda.autor_id)
            .single();
            
          autor = autorData;
        }
        
        return {
          ...demanda,
          area_coordenacao: areaCoord,
          servico: servico,
          origem: origem,
          tipo_midia: tipoMidia,
          bairro: bairro,
          autor: autor
        };
      }));
      
      return enhancedData || [];
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

  // Transformar os dados para garantir que 'perguntas' está com o tipo correto
  const demandas: Demand[] = demandasData ? demandasData.map(item => ({
    ...item,
    perguntas: item.perguntas ? 
      (typeof item.perguntas === 'string' ? 
        JSON.parse(item.perguntas) : 
        item.perguntas as Record<string, string>) : 
      null
  })) : [];

  // Se houver erro, podemos tratar aqui
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
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-[#F9FAFB]">
      {/* Header */}
      <Header showControls={true} toggleSidebar={toggleSidebar} />

      <div className="flex flex-1 overflow-hidden px-0">
        {/* Sidebar */}
        <DashboardSidebar isOpen={sidebarOpen} />

        {/* Main content */}
        <Layout>
          <Card className="bg-white shadow-sm">
            <CardHeader className="pb-2 border-b">
              <CardTitle className="text-2xl font-bold text-[#003570]">
                Gerenciamento de Demandas
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <DemandFilter viewMode={viewMode} setViewMode={setViewMode} filterStatus={filterStatus} setFilterStatus={setFilterStatus} />
              
              {viewMode === 'cards' ? 
                <DemandCards demandas={demandas} isLoading={isLoading} onSelectDemand={handleSelectDemand} /> : 
                <DemandList demandas={demandas} isLoading={isLoading} onSelectDemand={handleSelectDemand} />
              }

              <DemandDetail demand={selectedDemand} isOpen={isDetailOpen} onClose={handleCloseDetail} />
            </CardContent>
          </Card>
        </Layout>
      </div>
    </div>
  );
};

export default Demandas;
