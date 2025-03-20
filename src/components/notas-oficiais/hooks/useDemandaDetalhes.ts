
import { useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { Demanda, NotaExistente, Resposta, PerguntaResposta } from '../types';

export const useDemandaDetalhes = (demandaId: string) => {
  // Use explicit types to prevent deep inference
  const [demanda, setDemanda] = useState<Demanda | null>(null);
  const [respostas, setRespostas] = useState<Resposta[]>([]);
  const [notaExistente, setNotaExistente] = useState<NotaExistente | null>(null);
  const [loading, setLoading] = useState(true);
  const [isCheckingNota, setIsCheckingNota] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchDemandaDetalhes = async () => {
      setLoading(true);
      try {
        // Fetch demanda data
        const { data: demandaData, error: demandaError } = await supabase
          .from('demandas')
          .select(`
            *,
            areas_coordenacao (id, descricao),
            autor: usuario_id (nome_completo)
          `)
          .eq('id', demandaId)
          .single();

        if (demandaError) throw demandaError;
        
        // Fetch respostas
        const { data: respostasData, error: respostasError } = await supabase
          .from('respostas_demandas')
          .select(`
            *,
            usuario:usuario_id (nome_completo)
          `)
          .eq('demanda_id', demandaId)
          .order('criado_em', { ascending: false });

        if (respostasError) throw respostasError;
        
        // Check if nota already exists for this demanda
        // Break the inference chain by using any
        const notaResult: {data: any, error: any} = await supabase
          .from('notas_oficiais')
          .select('*')
          .eq('demanda_id', demandaId)
          .maybeSingle();
          
        const { data: notaData, error: notaError } = notaResult;
          
        if (notaError) {
          console.error('Erro ao buscar nota oficial:', notaError);
        }
        
        // Extract perguntas safely with explicit type assertion
        let perguntasObj: Record<string, string> = {};
        
        if (demandaData.perguntas && typeof demandaData.perguntas === 'object') {
          // Force the type to avoid deep inference
          perguntasObj = demandaData.perguntas as Record<string, string>;
        }
          
        // Explicitly construct the processed demanda with all properties typed
        const processedDemanda: Demanda = {
          id: demandaData.id,
          titulo: demandaData.titulo,
          status: demandaData.status,
          horario_publicacao: demandaData.horario_publicacao,
          prazo_resposta: demandaData.prazo_resposta,
          detalhes_solicitacao: demandaData.detalhes_solicitacao || undefined,
          protocolo: demandaData.protocolo || undefined,
          prioridade: demandaData.prioridade,
          arquivo_url: demandaData.arquivo_url || undefined,
          perguntas: perguntasObj,
          areas_coordenacao: demandaData.areas_coordenacao,
          autor: {
            nome_completo: demandaData.autor && typeof demandaData.autor === 'object' 
              ? (demandaData.autor as {nome_completo?: string}).nome_completo || 'Não especificado'
              : 'Não especificado'
          }
        };
        
        // Process respostas with simple types and explicit loop
        const processedRespostas: Resposta[] = [];
        
        if (Array.isArray(respostasData)) {
          for (let i = 0; i < respostasData.length; i++) {
            const resposta = respostasData[i];
            processedRespostas.push({
              id: resposta.id,
              texto: resposta.texto,
              arquivo_url: resposta.arquivo_url,
              criado_em: resposta.criado_em,
              usuario: resposta.usuario ? { nome_completo: resposta.usuario.nome_completo } : null
            });
          }
        }
        
        // Process nota with explicit type
        let processedNota: NotaExistente | null = null;
        
        if (notaData) {
          processedNota = {
            id: notaData.id,
            titulo: notaData.titulo,
            texto: notaData.texto,
            status: notaData.status,
            demanda_id: demandaId
          };
        }

        setDemanda(processedDemanda);
        setRespostas(processedRespostas);
        setNotaExistente(processedNota);
      } catch (error: any) {
        console.error('Erro ao buscar detalhes da demanda:', error);
        setError(error.message || "Não foi possível carregar os detalhes da demanda.");
        toast({
          title: "Erro ao carregar detalhes",
          description: error.message || "Não foi possível carregar os detalhes da demanda.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
        setIsCheckingNota(false);
      }
    };

    if (demandaId) {
      fetchDemandaDetalhes();
    }
  }, [demandaId, toast]);

  // Implementation to avoid recursive type issues
  const formatarPerguntasRespostas = (): PerguntaResposta[] => {
    if (!demanda || !demanda.perguntas) return [];
    
    const result: PerguntaResposta[] = [];
    
    // Use Object.entries with explicit typing to prevent deep inference
    Object.entries(demanda.perguntas as Record<string, string>).forEach(([_, value]) => {
      if (typeof value === 'string') {
        // Get resposta text from the first resposta if available
        const resposta = respostas.length > 0 ? respostas[0].texto || '' : '';
        
        result.push({
          pergunta: value,
          resposta
        });
      }
    });
    
    return result;
  };

  const perguntasRespostas = formatarPerguntasRespostas();

  return {
    demanda,
    respostas,
    perguntasRespostas,
    notaExistente,
    loading,
    isCheckingNota,
    error
  };
};
