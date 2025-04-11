
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, Clock } from 'lucide-react';
import InsufficientDataMessage from './InsufficientDataMessage';

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
  // Process data to get oldest pending orders
  const pendingOrders = React.useMemo(() => {
    if (!sgzData || sgzData.length === 0) return null;
    
    // Filter for pending orders with valid creation date
    const pendingList = sgzData.filter(order => {
      const status = order.sgz_status?.toLowerCase() || '';
      const isPending = !status.includes('conclu') && !status.includes('finaliz') && 
                        !status.includes('cancel');
      
      return isPending && order.sgz_criado_em;
    });
    
    if (pendingList.length < 3) return null; // Not enough data
    
    // Calculate the age of each pending order
    const today = new Date();
    const ordersWithAge = pendingList.map(order => {
      const createdDate = new Date(order.sgz_criado_em);
      const timeDiff = today.getTime() - createdDate.getTime();
      const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
      
      return {
        ...order,
        age: daysDiff,
        formattedDate: createdDate.toLocaleDateString('pt-BR')
      };
    });
    
    // Sort by age (descending) and get top 10
    return ordersWithAge
      .sort((a, b) => b.age - a.age)
      .slice(0, 10);
  }, [sgzData]);
  
  // Apply simulation effects if active
  const simulatedList = React.useMemo(() => {
    if (!pendingOrders) return null;
    
    if (isSimulationActive) {
      // In simulation mode, we want to show fewer very old items
      return pendingOrders
        .map(order => ({
          ...order,
          age: Math.floor(order.age * 0.7) // 30% reduction in age
        }))
        .sort((a, b) => b.age - a.age);
    }
    
    return pendingOrders;
  }, [pendingOrders, isSimulationActive]);
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 text-orange-500 animate-spin" />
      </div>
    );
  }
  
  if (!simulatedList || simulatedList.length === 0) {
    return (
      <div className="h-64">
        <InsufficientDataMessage message="Dados insuficientes para listar pendências antigas" />
      </div>
    );
  }
  
  return (
    <div className="h-64 p-2">
      <h3 className="text-sm font-medium text-gray-700 mb-3">Pendências mais antigas</h3>
      <ScrollArea className="h-[200px]">
        <div className="space-y-2">
          {simulatedList.map((order, index) => (
            <div 
              key={index} 
              className="flex items-center p-2 bg-orange-50 rounded-md border border-orange-100"
            >
              <div className="flex items-center justify-center h-8 w-8 rounded-full bg-orange-100 text-orange-600 mr-3">
                <Clock size={16} />
              </div>
              <div className="flex-1">
                <div className="flex justify-between">
                  <p className="text-sm font-medium text-gray-800">
                    {order.sgz_tipo_servico || 'Serviço não especificado'}
                  </p>
                  <span className="text-xs font-bold bg-orange-200 text-orange-800 px-2 py-0.5 rounded-full">
                    {order.age} dias
                  </span>
                </div>
                <div className="flex justify-between mt-1">
                  <p className="text-xs text-gray-600">
                    {order.sgz_distrito || 'Distrito não especificado'}
                  </p>
                  <p className="text-xs text-gray-500">
                    Aberto em: {order.formattedDate}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default OldestPendingList;
