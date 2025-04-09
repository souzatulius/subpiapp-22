
import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Clock, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PendingItem {
  id: string;
  title: string;
  type: 'demand' | 'note';
  createdAt: string;
}

const PendingActivitiesCard: React.FC = () => {
  const [pendingItems, setPendingItems] = useState<PendingItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPendingItems = async () => {
      setIsLoading(true);
      try {
        // Fetch pending demands
        const { data: demands, error: demandsError } = await supabase
          .from('demandas')
          .select('id, titulo, horario_publicacao')
          .in('status', ['pendente', 'em_analise'])
          .order('horario_publicacao', { ascending: false })
          .limit(2);

        if (demandsError) {
          console.error('Error fetching pending demands:', demandsError);
        }

        // Fetch pending notes
        const { data: notes, error: notesError } = await supabase
          .from('notas_oficiais')
          .select('id, titulo, criado_em')
          .eq('status', 'pendente')
          .order('criado_em', { ascending: false })
          .limit(2);

        if (notesError) {
          console.error('Error fetching pending notes:', notesError);
        }

        // Combine and format results
        const combinedItems: PendingItem[] = [
          ...(demands || []).map(d => ({
            id: d.id,
            title: d.titulo,
            type: 'demand' as const,
            createdAt: d.horario_publicacao
          })),
          ...(notes || []).map(n => ({
            id: n.id,
            title: n.titulo,
            type: 'note' as const,
            createdAt: n.criado_em
          }))
        ];

        // Sort by creation date and limit to 3 items
        const sortedItems = combinedItems
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 3);

        setPendingItems(sortedItems);
      } catch (error) {
        console.error('Failed to fetch pending activities:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPendingItems();
    // Refresh every 5 minutes
    const interval = setInterval(fetchPendingItems, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col space-y-3 p-3 h-full">
        {[1, 2, 3].map(i => (
          <div key={i} className="animate-pulse flex items-center space-x-2">
            <div className="rounded-full bg-gray-200 h-4 w-4"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  if (pendingItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4">
        <Clock className="h-8 w-8 text-gray-300 mb-2" />
        <p className="text-gray-500 text-sm text-center">Não há atividades pendentes</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-2 p-3 h-full">
      {pendingItems.map(item => (
        <div 
          key={item.id}
          className="flex items-start space-x-2 p-2 rounded-md hover:bg-gray-50 transition-colors"
        >
          <AlertTriangle 
            className={cn(
              "h-4 w-4 mt-0.5",
              item.type === 'demand' ? "text-amber-500" : "text-blue-500"
            )} 
          />
          <div>
            <p className="text-sm font-medium line-clamp-2">{item.title}</p>
            <p className="text-xs text-gray-500">
              {item.type === 'demand' ? 'Demanda pendente' : 'Nota para aprovação'}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PendingActivitiesCard;
