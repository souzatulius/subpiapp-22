
import React, { useMemo } from 'react';
import ChartCard from './ChartCard';
import { formatDistanceToNowStrict, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface OldestPendingListProps {
  data: any;
  sgzData: any[] | null;
  isLoading: boolean;
  isSimulationActive: boolean;
}

const OldestPendingList: React.FC<OldestPendingListProps> = ({ 
  data, 
  sgzData,
  isLoading,
  isSimulationActive
}) => {
  const pendingOrders = useMemo(() => {
    if (!sgzData || sgzData.length === 0) return [];
    
    // Filtrar apenas ordens pendentes
    const pendingOS = sgzData.filter(order => {
      const status = (order.sgz_status || '').toUpperCase();
      return !(status.includes('CONC') || status.includes('FECHA') || status.includes('CANC'));
    });
    
    // Ordenar por data de criação
    const sortedOS = pendingOS.sort((a, b) => {
      const dateA = a.sgz_criado_em ? new Date(a.sgz_criado_em).getTime() : 0;
      const dateB = b.sgz_criado_em ? new Date(b.sgz_criado_em).getTime() : 0;
      return dateA - dateB;
    });
    
    // Aplicar simulação se ativa
    if (isSimulationActive) {
      // Na simulação, filtrar ordens de serviço externas (implementação simplificada)
      // Em um cenário real, a identificação de OS externas seria mais complexa
      return sortedOS
        .filter(order => {
          // Filtrar apenas ordens que não são externas na simulação
          // Esta é uma simplificação para demonstração
          const tipoServico = (order.sgz_tipo_servico || '').toUpperCase();
          return !(tipoServico.includes('SABESP') || 
                  tipoServico.includes('ENEL') || 
                  tipoServico.includes('EXTERNO') ||
                  tipoServico.includes('OUTROS'));
        })
        .slice(0, 10);
    }
    
    // Pegar as 10 mais antigas
    return sortedOS.slice(0, 10);
  }, [sgzData, isSimulationActive]);
  
  // Formatar tempo de espera
  const formatWaitingTime = (dateStr: string) => {
    try {
      if (!dateStr) return "Data desconhecida";
      const date = parseISO(dateStr);
      return formatDistanceToNowStrict(date, { locale: ptBR, addSuffix: true });
    } catch (e) {
      return "Data inválida";
    }
  };
  
  // Calcular estatística
  const stats = useMemo(() => {
    if (pendingOrders.length === 0) return '0 dias';
    
    // Pegar a OS mais antiga
    const oldestOS = pendingOrders[0];
    if (!oldestOS.sgz_criado_em) return '0 dias';
    
    try {
      const days = oldestOS.sgz_dias_ate_status_atual || 0;
      return `${Math.round(days)} dias`;
    } catch (e) {
      return '0 dias';
    }
  }, [pendingOrders]);

  return (
    <ChartCard
      title="Top 10 Pendências Mais Antigas"
      value={stats}
      isLoading={isLoading}
    >
      <div className="h-full overflow-auto px-2">
        {pendingOrders.length > 0 ? (
          <ul className="divide-y divide-orange-100">
            {pendingOrders.map((order, index) => (
              <li key={order.id || index} className="py-2 text-sm">
                <div className="flex justify-between items-start">
                  <div className="font-medium text-gray-700">OS: {order.ordem_servico}</div>
                  <span className="text-orange-500 text-xs">
                    {formatWaitingTime(order.sgz_criado_em)}
                  </span>
                </div>
                <div className="text-xs text-gray-500 mt-1 truncate" title={order.sgz_tipo_servico}>
                  {order.sgz_tipo_servico}
                </div>
                <div className="text-xs text-gray-400 mt-0.5 flex justify-between">
                  <span>{order.sgz_distrito}</span>
                  <span>{order.sgz_status}</span>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            Não há ordens pendentes
          </div>
        )}
      </div>
    </ChartCard>
  );
};

export default OldestPendingList;
