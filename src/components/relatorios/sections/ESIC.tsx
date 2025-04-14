
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RelatorioItem } from '../hooks/useRelatorioItemsState';
import { SortableChartCard } from '../components/SortableChartCard';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';
import ESICProcessesChart from '../charts/ESICProcessesChart';
import { useIsMobile } from '@/hooks/use-mobile';

interface ESICProps {
  items: RelatorioItem[];
  isLoading: boolean;
  handleToggleVisibility: (itemId: string) => void;
  handleToggleAnalysis: (itemId: string) => void;
  handleToggleView: (itemId: string) => void;
}

const ESIC: React.FC<ESICProps> = ({
  items,
  isLoading,
  handleToggleVisibility,
  handleToggleAnalysis,
  handleToggleView
}) => {
  const [esicStats, setEsicStats] = useState({
    total: 0,
    responded: 0,
    justified: 0
  });
  const [loadingESIC, setLoadingESIC] = useState(true);
  const isMobile = useIsMobile();

  useEffect(() => {
    const fetchESICStats = async () => {
      setLoadingESIC(true);
      try {
        const { count: total } = await supabase
          .from('esic_processos')
          .select('*', { count: 'exact', head: true });
        
        const { count: responded } = await supabase
          .from('esic_processos')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'concluido');
        
        const { count: justified } = await supabase
          .from('esic_justificativas')
          .select('*', { count: 'exact', head: true });
        
        setEsicStats({
          total: total || 0,
          responded: responded || 0,
          justified: justified || 0
        });
      } catch (error) {
        console.error('Error fetching ESIC stats:', error);
      } finally {
        setLoadingESIC(false);
      }
    };
    
    fetchESICStats();
  }, []);

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold text-orange-600">
          Transparência e Acesso à Informação (e-SIC)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="relative group">
            <ESICProcessesChart 
              total={esicStats.total} 
              responded={esicStats.responded} 
              justified={esicStats.justified}
              isLoading={loadingESIC} 
            />
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                className="p-1 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-500"
                onClick={() => handleToggleVisibility('esicProcessesChart')}
                title="Ocultar card"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
          </div>
          
          {items.map((item) => (
            <div key={item.id} className="relative group">
              <SortableChartCard
                item={item}
                onToggleVisibility={handleToggleVisibility}
                onToggleAnalysis={handleToggleAnalysis}
                onToggleView={handleToggleView}
              />
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  className="p-1 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-500"
                  onClick={() => handleToggleVisibility(item.id)}
                  title="Ocultar card"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <>
              <Skeleton className="h-64 w-full" />
              <Skeleton className="h-64 w-full" />
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ESIC;
