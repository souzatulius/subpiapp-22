
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Demand } from './types';

export const useDemandasQuery = () => {
  return useQuery({
    queryKey: ['demandas'],
    queryFn: async () => {
      // Fetch only visible demandas (not 'oculta' status)
      const { data: visibleDemandas, error: fetchError } = await supabase
        .from('demandas')
        .select(`
          id, 
          titulo, 
          status, 
          prioridade,
          horario_publicacao,
          prazo_resposta,
          detalhes_solicitacao,
          endereco,
          email_solicitante,
          telefone_solicitante,
          nome_solicitante,
          veiculo_imprensa,
          perguntas,
          supervisao_tecnica_id,
          autor_id,
          problema_id,
          origem_id,
          bairro_id,
          tipo_midia_id
        `)
        .neq('status', 'oculta')
        .order('horario_publicacao', { ascending: false });
        
      if (fetchError) throw fetchError;
      if (!visibleDemandas) return [] as Demand[];

      // Now fetch all related data in parallel
      const [supervisoesTecnicasResult, problemasResult, origensResult, tiposMidiaResult, bairrosResult, autoresResult] = await Promise.all([
        // Fetch supervisoes_tecnicas data
        supabase
          .from('supervisoes_tecnicas')
          .select(`
            id, 
            descricao,
            coordenacao_id
          `),
          
        // Fetch problemas data  
        supabase
          .from('problemas')
          .select('id, descricao'),
          
        // Fetch origens data
        supabase
          .from('origens_demandas')
          .select('id, descricao'),
          
        // Fetch tipos_midia data
        supabase
          .from('tipos_midia')
          .select('id, descricao'),
          
        // Fetch bairros data
        supabase
          .from('bairros')
          .select('id, nome'),
          
        // Fetch user data
        supabase
          .from('usuarios')
          .select('id, nome_completo')
      ]);

      // Create lookup tables for faster data access
      const supervisoesTecnicas = supervisoesTecnicasResult.data?.reduce(
        (acc, st) => ({ ...acc, [st.id]: st }), {}
      ) || {};
      
      const problemas = problemasResult.data?.reduce(
        (acc, p) => ({ ...acc, [p.id]: p }), {}
      ) || {};
      
      const origens = origensResult.data?.reduce(
        (acc, o) => ({ ...acc, [o.id]: o }), {}
      ) || {};
      
      const tiposMidia = tiposMidiaResult.data?.reduce(
        (acc, tm) => ({ ...acc, [tm.id]: tm }), {}
      ) || {};
      
      const bairros = bairrosResult.data?.reduce(
        (acc, b) => ({ ...acc, [b.id]: b }), {}
      ) || {};
      
      const autores = autoresResult.data?.reduce(
        (acc, a) => ({ ...acc, [a.id]: a }), {}
      ) || {};

      // Map the data to the Demand type with all related information
      const mappedDemandas = visibleDemandas.map(demanda => {
        const supervisaoTecnica = supervisoesTecnicas[demanda.supervisao_tecnica_id];
        
        return {
          ...demanda,
          supervisao_tecnica: supervisaoTecnica ? {
            id: supervisaoTecnica.id,
            descricao: supervisaoTecnica.descricao
          } : null,
          area_coordenacao: supervisaoTecnica ? {
            descricao: supervisaoTecnica.descricao
          } : null,
          servico: null, // No servico in current schema
          origem: demanda.origem_id ? {
            descricao: origens[demanda.origem_id]?.descricao || ''
          } : null,
          tipo_midia: demanda.tipo_midia_id ? {
            descricao: tiposMidia[demanda.tipo_midia_id]?.descricao || ''
          } : null,
          bairro: demanda.bairro_id ? {
            nome: bairros[demanda.bairro_id]?.nome || ''
          } : null,
          autor: demanda.autor_id ? {
            nome_completo: autores[demanda.autor_id]?.nome_completo || ''
          } : null
        } as Demand;
      });

      return mappedDemandas;
    },
    meta: {
      onError: (err: any) => {
        console.error('Error fetching demandas:', err);
      }
    }
  });
};
