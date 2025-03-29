
import React from 'react';
import ChartCard from './ChartCard';
import { CheckCircle2, Clock, AlertTriangle } from 'lucide-react';

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
  const [oldestOrders, setOldestOrders] = React.useState<any[]>([]);
  
  React.useEffect(() => {
    if (sgzData && sgzData.length > 0) {
      // Filter to get only pending orders
      let pendingOrders = sgzData.filter(order => {
        const status = order.sgz_status?.toLowerCase();
        return !(status?.includes('fecha') || status?.includes('conclu') || status?.includes('cancel'));
      });
      
      // In simulation mode, reduce the list
      if (isSimulationActive) {
        // For simulation, randomly reduce the pending list by 40%
        const reduceBy = Math.floor(pendingOrders.length * 0.4);
        const indicesToRemove = new Set();
        
        while (indicesToRemove.size < reduceBy && indicesToRemove.size < pendingOrders.length) {
          const randomIndex = Math.floor(Math.random() * pendingOrders.length);
          indicesToRemove.add(randomIndex);
        }
        
        pendingOrders = pendingOrders.filter((_, index) => !indicesToRemove.has(index));
      }
      
      // Sort by days opened (descending)
      const sorted = pendingOrders
        .sort((a, b) => (b.sgz_dias_ate_status_atual || 0) - (a.sgz_dias_ate_status_atual || 0))
        .slice(0, 10); // Get top 10
      
      setOldestOrders(sorted);
    }
  }, [sgzData, isSimulationActive]);
  
  const getDaysClass = (days: number) => {
    if (days > 30) return 'text-red-600 font-semibold';
    if (days > 15) return 'text-orange-600 font-semibold';
    return 'text-gray-700';
  };
  
  const getStatusIcon = (days: number) => {
    if (days > 30) return <AlertTriangle className="h-4 w-4 text-red-600" />;
    if (days > 15) return <Clock className="h-4 w-4 text-orange-600" />;
    return <CheckCircle2 className="h-4 w-4 text-green-600" />;
  };
  
  const formatDate = (dateString: string) => {
    if (!dateString) return 'Data não disponível';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR').format(date);
  };
  
  return (
    <ChartCard
      title="Top 10 Pendências Mais Antigas"
      value={isSimulationActive ? "Simulação Ativa" : `Total Pendente: ${oldestOrders.length}`}
      isLoading={isLoading}
    >
      <div className="h-full overflow-y-auto custom-scrollbar" style={{ maxHeight: '220px' }}>
        {oldestOrders.length > 0 ? (
          <table className="w-full text-xs">
            <thead className="bg-gray-50 text-gray-700 sticky top-0">
              <tr className="border-b border-gray-200">
                <th className="p-2 text-left">OS</th>
                <th className="p-2 text-left">Serviço</th>
                <th className="p-2 text-left">Dias</th>
                <th className="p-2 text-left">Data</th>
              </tr>
            </thead>
            <tbody>
              {oldestOrders.map((order, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-orange-50">
                  <td className="p-2 font-medium">{order.ordem_servico}</td>
                  <td className="p-2 truncate" style={{ maxWidth: '180px' }} title={order.sgz_tipo_servico}>
                    {order.sgz_tipo_servico}
                  </td>
                  <td className="p-2">
                    <div className="flex items-center gap-1">
                      {getStatusIcon(order.sgz_dias_ate_status_atual || 0)}
                      <span className={getDaysClass(order.sgz_dias_ate_status_atual || 0)}>
                        {order.sgz_dias_ate_status_atual || 0}
                      </span>
                    </div>
                  </td>
                  <td className="p-2 text-gray-600">{formatDate(order.sgz_criado_em)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            {isSimulationActive 
              ? "Sem pendências na simulação" 
              : "Não há ordens pendentes"}
          </div>
        )}
      </div>
    </ChartCard>
  );
};

export default OldestPendingList;
