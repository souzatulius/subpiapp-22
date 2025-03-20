
import { useState, useEffect } from "react"
import { supabase } from "@/integrations/supabase/client"
import { Demanda, Resposta } from '../types'

export interface NotaOficial {
  id: string;
  titulo: string;
  texto: string;
  status: string;
  demanda_id?: string;
}

export const useDemandaDetalhes = (demandaId: string) => {
  const [demanda, setDemanda] = useState<Demanda | null>(null)
  const [respostas, setRespostas] = useState<Resposta[]>([])
  const [notaExistente, setNotaExistente] = useState<NotaOficial | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchDemandaDetalhes = async () => {
      setIsLoading(true)
      try {
        // Fetch demanda details
        const { data: demandaData, error: demandaError } = await supabase
          .from('demandas')
          .select(`
            *,
            servicos:servico_id(*),
            tipos_midia:tipo_midia_id(*),
            origens_demandas:origem_demanda_id(*),
            areas_coordenacao:area_coordenacao_id(*)
          `)
          .eq('id', demandaId)
          .single()

        if (demandaError) throw demandaError

        // Fetch respostas for the demanda
        const { data: respostasData, error: respostasError } = await supabase
          .from('respostas_demandas')
          .select('*')
          .eq('demanda_id', demandaId)
          .order('created_at', { ascending: true })

        if (respostasError) throw respostasError

        // Check if there's already a nota oficial for this demanda
        const { data: notaData, error: notaError } = await supabase
          .from('notas_oficiais')
          .select('*')
          .eq('demanda_id', demandaId)
          .maybeSingle()

        if (notaError) throw notaError

        setDemanda(demandaData as Demanda)
        setRespostas(respostasData || [])
        setNotaExistente(notaData as NotaOficial | null)
      } catch (error) {
        console.error('Erro ao carregar detalhes da demanda:', error)
      } finally {
        setIsLoading(false)
      }
    }

    if (demandaId) {
      fetchDemandaDetalhes()
    }
  }, [demandaId])

  return { demanda, respostas, notaExistente, isLoading }
}
