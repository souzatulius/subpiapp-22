
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import DemandasList from './DemandasList';
import DetalhesDemanda from './DetalhesDemanda';
import { Loader2 } from 'lucide-react';

const NotasOficiaisContent = () => {
  const [selectedDemandaId, setSelectedDemandaId] = useState<string | null>(null);
  
  // Buscar demandas que já possuem respostas
  const { data: demandas, isLoading, error } = useQuery({
    queryKey: ['demandas-com-respostas'],
    queryFn: async () => {
      // Buscar demandas que possuem resposta
      const { data: respostasDemandas, error: respostasError } = await supabase
        .from('respostas_demandas')
        .select('demanda_id')
        .not('texto', 'is', null);
      
      if (respostasError) throw respostasError;
      
      if (!respostasDemandas || respostasDemandas.length === 0) {
        return [];
      }
      
      // Obter os IDs únicos de demandas que possuem respostas
      const demandaIds = [...new Set(respostasDemandas.map(r => r.demanda_id))];
      
      // Buscar detalhes dessas demandas
      const { data: demandasData, error: demandasError } = await supabase
        .from('demandas')
        .select(`
          id,
          titulo,
          status,
          horario_publicacao,
          prazo_resposta,
          areas_coordenacao:area_coordenacao_id (descricao),
          autor:autor_id (nome_completo)
        `)
        .in('id', demandaIds)
        .order('horario_publicacao', { ascending: false });
      
      if (demandasError) throw demandasError;
      
      return demandasData || [];
    }
  });
  
  const handleDemandaSelect = (demandaId: string) => {
    setSelectedDemandaId(demandaId);
  };
  
  const handleClose = () => {
    setSelectedDemandaId(null);
  };
  
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-4" />
        <p className="text-lg text-gray-600">Carregando demandas...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <p className="text-lg text-red-600 mb-2">Erro ao carregar as demandas</p>
        <p className="text-gray-600">{(error as Error).message}</p>
      </div>
    );
  }
  
  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#003570]">Notas Oficiais</h1>
        <p className="text-gray-600">
          Gerencie notas oficiais a partir de demandas com respostas
        </p>
      </div>
      
      {selectedDemandaId ? (
        <DetalhesDemanda demandaId={selectedDemandaId} onClose={handleClose} />
      ) : (
        <DemandasList 
          demandas={demandas || []} 
          onSelectDemanda={handleDemandaSelect} 
        />
      )}
    </div>
  );
};

export default NotasOficiaisContent;
