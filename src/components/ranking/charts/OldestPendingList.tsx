
import React from 'react';
import EnhancedChartCard from './EnhancedChartCard';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface OldestPendingListProps {
  data: any;
  sgzData: any[] | null;
  isLoading: boolean;
  isSimulationActive: boolean;
  onToggleVisibility?: () => void;
  onToggleAnalysis?: () => void;
}

const OldestPendingList: React.FC<OldestPendingListProps> = ({
  data,
  sgzData,
  isLoading,
  isSimulationActive,
  onToggleVisibility,
  onToggleAnalysis
}) => {
  const pendingItems = React.useMemo(() => {
    if (!sgzData || sgzData.length === 0) {
      return {
        items: [],
        maxDays: 0
      };
    }
    
    // Filter for pending items and sort by days open
    const pendingOrders = sgzData
      .filter(order => {
        // Include orders that are not marked as completed
        const status = (order.sgz_status || '').toLowerCase();
        return !status.includes('conclu') && !status.includes('encerr') && !status.includes('cancel');
      })
      .map(order => {
        return {
          id: order.sgz_id || order.sgz_numero || 'N/A',
          service: order.sgz_tipo_servico || 'Não especificado',
          district: order.sgz_distrito || 'Não especificado',
          days: order.sgz_dias_ate_status_atual || order.sgz_dias_no_status || 0
        };
      })
      .sort((a, b) => b.days - a.days)
      .slice(0, 5); // Take top 5 oldest
    
    const maxDays = pendingOrders.length > 0 ? pendingOrders[0].days : 0;
    
    // Apply simulation (if active, show slightly fewer days)
    const simulatedItems = isSimulationActive
      ? pendingOrders.map(item => ({
          ...item,
          days: Math.round(item.days * 0.9)
        }))
      : pendingOrders;
      
    return {
      items: simulatedItems,
      maxDays: simulatedItems.length > 0 ? simulatedItems[0].days : 0
    };
  }, [sgzData, isSimulationActive]);

  return (
    <EnhancedChartCard
      title="Tempo de Abertura das OS"
      subtitle="OS agrupadas por tempo desde abertura. Destaca gargalos críticos"
      value={`Máximo: ${pendingItems.maxDays || 0} dias`}
      isLoading={isLoading}
      onToggleVisibility={onToggleVisibility}
      onToggleAnalysis={onToggleAnalysis}
      dataSource="Painel da Zeladoria"
      analysis="Identifique as razões principais para OS abertas há mais tempo e recomende ações emergenciais para solução."
    >
      <div className="w-full h-full overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">ID</TableHead>
              <TableHead>Serviço</TableHead>
              <TableHead>Distrito</TableHead>
              <TableHead className="text-right w-[100px]">Dias</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pendingItems.items.length > 0 ? (
              pendingItems.items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.id}</TableCell>
                  <TableCell>{item.service}</TableCell>
                  <TableCell>{item.district}</TableCell>
                  <TableCell className="text-right font-semibold text-orange-600">{item.days}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-4 text-gray-500">
                  Sem dados disponíveis
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </EnhancedChartCard>
  );
};

export default OldestPendingList;
