
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface CardStats {
  totalDemandas: number;
  demandasVariacao: number;
  totalNotas: number;
  notasVariacao: number;
  tempoMedioResposta: number;
  tempoRespostaVariacao: number;
  taxaAprovacao: number;
  aprovacaoVariacao: number;
}

export const useReportsData = (filters: any) => {
  const [reportsData, setReportsData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [cardStats, setCardStats] = useState<CardStats>({
    totalDemandas: 0,
    demandasVariacao: 0,
    totalNotas: 0,
    notasVariacao: 0,
    tempoMedioResposta: 0,
    tempoRespostaVariacao: 0,
    taxaAprovacao: 0,
    aprovacaoVariacao: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Primeiro, buscamos os dados dos cards
        await fetchCardStats();
        
        // Em seguida, buscamos os dados para os gráficos
        // No futuro, aqui seriam chamadas reais ao supabase
        // Por enquanto, vamos manter os dados de exemplo
        
        // Simulação de tempo de carregamento
        setTimeout(() => {
          // Dados para os gráficos
          setReportsData({
            districts: [
              { name: 'Itaim Bibi', value: 78 },
              { name: 'Pinheiros', value: 65 },
              { name: 'Alto de Pinheiros', value: 42 },
              { name: 'Jardim Paulista', value: 35 }
            ],
            neighborhoods: [
              { name: 'Vila Olímpia', district: 'Itaim Bibi', value: 32 },
              { name: 'Vila Nova Conceição', district: 'Itaim Bibi', value: 28 },
              { name: 'Brooklin', district: 'Itaim Bibi', value: 18 },
              { name: 'Pinheiros Centro', district: 'Pinheiros', value: 30 },
              { name: 'Vila Madalena', district: 'Pinheiros', value: 35 }
            ],
            origins: [
              { name: 'Imprensa', value: 45 },
              { name: 'Vereadores', value: 20 },
              { name: 'Políticos', value: 15 },
              { name: 'Demandas Internas', value: 25 },
              { name: 'SECOM', value: 10 }
            ],
            // ... outros dados simulados
            mediaTypes: [
              { name: 'Jornal Impresso', value: 25 },
              { name: 'Portal de Notícias', value: 42 },
              { name: 'Jornal Online', value: 38 }
            ],
            responseTimes: [
              { name: 'Jan', value: 48 },
              { name: 'Fev', value: 42 },
              { name: 'Mar', value: 36 }
            ],
            services: [
              { name: 'Zeladoria', value: 65 },
              { name: 'Infraestrutura', value: 50 },
              { name: 'Saúde', value: 30 }
            ],
            coordinations: [
              { name: 'Zeladoria', value: 85 },
              { name: 'Comunicação', value: 60 },
              { name: 'Gabinete', value: 45 }
            ],
            statuses: [
              { name: 'Pendentes', value: 35 },
              { name: 'Em andamento', value: 45 },
              { name: 'Concluídas', value: 120 }
            ],
            responsibles: [
              { name: 'Ana Silva', value: 45 },
              { name: 'Carlos Santos', value: 38 },
              { name: 'Patrícia Lima', value: 52 }
            ],
            approvals: [
              { name: 'Aprovadas pelo Subprefeito', value: 68 },
              { name: 'Rejeitadas e reeditadas', value: 12 },
              { name: 'Aprovadas sem edição', value: 45 }
            ]
          });
          setIsLoading(false);
        }, 500);
      } catch (error) {
        console.error('Erro ao buscar dados de relatórios:', error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [filters]);

  // Função para buscar dados reais dos cards
  const fetchCardStats = async () => {
    try {
      // Buscar total de demandas
      const { data: demandas, error: demandasError } = await supabase
        .from('demandas')
        .select('count', { count: 'exact' });
      
      if (demandasError) throw demandasError;
      
      // Buscar total de notas oficiais
      const { data: notas, error: notasError } = await supabase
        .from('notas_oficiais')
        .select('count', { count: 'exact' });
      
      if (notasError) throw notasError;
      
      // Buscar tempo médio de resposta (em dias)
      const { data: tempoResposta, error: tempoError } = await supabase
        .from('demandas')
        .select('data_criacao, data_resposta')
        .not('data_resposta', 'is', null);
      
      if (tempoError) throw tempoError;
      
      // Calcular tempo médio em dias
      let tempoMedio = 0;
      if (tempoResposta && tempoResposta.length > 0) {
        const tempoTotal = tempoResposta.reduce((acc, item) => {
          const criacao = new Date(item.data_criacao);
          const resposta = new Date(item.data_resposta);
          const diffTime = Math.abs(resposta.getTime() - criacao.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          return acc + diffDays;
        }, 0);
        tempoMedio = Number((tempoTotal / tempoResposta.length).toFixed(1));
      }
      
      // Buscar taxa de aprovação (notas aprovadas / total de notas)
      const { data: notasAprovadas, error: aprovacaoError } = await supabase
        .from('notas_oficiais')
        .select('count', { count: 'exact' })
        .eq('status', 'aprovado');
      
      if (aprovacaoError) throw aprovacaoError;
      
      const totalNotas = notas?.count || 0;
      const aprovadas = notasAprovadas?.count || 0;
      const taxaAprovacao = totalNotas > 0 ? Math.round((aprovadas / totalNotas) * 100) : 0;

      // Atualizar os dados dos cards
      setCardStats({
        totalDemandas: demandas?.count || 0,
        demandasVariacao: 12, // Valor simulado
        totalNotas: totalNotas,
        notasVariacao: 4, // Valor simulado
        tempoMedioResposta: tempoMedio,
        tempoRespostaVariacao: -15, // Valor simulado (negativo pois melhorou)
        taxaAprovacao: taxaAprovacao,
        aprovacaoVariacao: 5 // Valor simulado
      });
    } catch (error) {
      console.error('Erro ao buscar dados para os cards:', error);
    }
  };

  return {
    reportsData,
    isLoading,
    cardStats
  };
};
