
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, AlertCircle, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
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
  // Process SGZ data to find oldest pending demands
  const pendingDemands = React.useMemo(() => {
    if (!sgzData || sgzData.length === 0) return null;
    
    // Filter for pending/in-progress demands
    const pendingOrders = sgzData
      .filter(order => ['pendente', 'em-andamento'].includes(order.sgz_status))
      .map(order => ({
        id: order.sgz_ordem_servico || order.ordem_servico || order.id || 'N/A',
        title: order.sgz_descricao || order.sgz_tipo_servico || 'Sem descrição',
        type: order.sgz_tipo_servico || 'Não informado',
        district: order.sgz_distrito || 'Não informado',
        createdAt: order.sgz_criado_em ? new Date(order.sgz_criado_em) : new Date(),
        days: order.sgz_dias_ate_status_atual || 0
      }))
      .sort((a, b) => b.days - a.days);
    
    // Apply simulation if active
    if (isSimulationActive) {
      return pendingOrders
        .filter((_, index) => index % 2 !== 0) // Remove every other item to simulate fewer pending
        .map(order => ({
          ...order,
          days: Math.floor(order.days * 0.7) // Reduce age in simulation
        }));
    }
    
    return pendingOrders.slice(0, 5); // Top 5 oldest
  }, [sgzData, isSimulationActive]);
  
  // Format relative time
  const formatRelativeTime = (date: Date) => {
    try {
      return formatDistanceToNow(date, { addSuffix: true, locale: ptBR });
    } catch (e) {
      return 'Data inválida';
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 text-orange-500 animate-spin" />
      </div>
    );
  }
  
  if (!pendingDemands || pendingDemands.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-500">
        <AlertCircle className="h-8 w-8 mb-2" />
        <p>Sem demandas pendentes</p>
      </div>
    );
  }
  
  return (
    <div className="h-64 overflow-auto">
      <div className="space-y-2">
        {pendingDemands.map(demand => (
          <Card key={demand.id} className="border-l-4 border-l-amber-500">
            <CardContent className="p-3">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="text-sm font-medium truncate" title={demand.title}>
                    {demand.title}
                  </p>
                  <p className="text-xs text-gray-500">
                    {demand.district} - {demand.type}
                  </p>
                </div>
                <div className="flex items-center text-amber-500 text-xs font-medium">
                  <Clock className="h-3 w-3 mr-1" />
                  <span>{demand.days} dias</span>
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Criado {formatRelativeTime(demand.createdAt)}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default OldestPendingList;
