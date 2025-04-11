
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
    // Mock data for pending items
    const items = [
      { id: '18293', service: 'Remoção de Entulho', district: 'Vila Mariana', days: 145 },
      { id: '17632', service: 'Poda de Árvore', district: 'Pinheiros', days: 137 },
      { id: '18721', service: 'Tapa-Buraco', district: 'Santo Amaro', days: 132 },
      { id: '16954', service: 'Iluminação Pública', district: 'Lapa', days: 129 },
      { id: '19045', service: 'Limpeza de Bueiro', district: 'Sé', days: 117 }
    ];
    
    // In simulation mode, show fewer days pending (as if some were resolved)
    if (isSimulationActive) {
      return items.map(item => ({
        ...item,
        days: Math.round(item.days * 0.7) // 30% reduction in pending days
      }));
    }
    
    return items;
  }, [isSimulationActive]);

  return (
    <EnhancedChartCard
      title="Pendências Mais Antigas"
      subtitle="Ordens de serviço aguardando há mais tempo"
      value={`Máximo: ${pendingItems[0]?.days || 0} dias`}
      isLoading={isLoading}
      onToggleVisibility={onToggleVisibility}
      onToggleAnalysis={onToggleAnalysis}
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
            {pendingItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.id}</TableCell>
                <TableCell>{item.service}</TableCell>
                <TableCell>{item.district}</TableCell>
                <TableCell className="text-right font-semibold text-orange-600">{item.days}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </EnhancedChartCard>
  );
};

export default OldestPendingList;
