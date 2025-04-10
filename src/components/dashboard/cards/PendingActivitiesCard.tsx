
import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Clock, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getColorClass } from '@/components/dashboard/card-customization/utils';

interface PendingItem {
  id: string;
  title: string;
  type: 'demand' | 'note';
  createdAt: string;
}

interface PendingActivitiesCardProps {
  color?: string;
  title?: string;
  subtitle?: string;
}

const PendingActivitiesCard: React.FC<PendingActivitiesCardProps> = ({
  color = 'orange-light',
  title = 'Atividades Pendentes',
  subtitle
}) => {
  const [pendingItems, setPendingItems] = useState<PendingItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const bgColorClass = getColorClass(color);

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
      <div className={`flex flex-col space-y-3 p-3 h-full ${bgColorClass} rounded-xl`}>
        <div className="mb-2">
          <h3 className="font-semibold text-lg">{title}</h3>
          {subtitle && <p className="text-sm opacity-80">{subtitle}</p>}
        </div>
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
      <div className={`flex flex-col h-full ${bgColorClass} rounded-xl p-4`}>
        <div className="mb-2">
          <h3 className="font-semibold text-lg">{title}</h3>
          {subtitle && <p className="text-sm opacity-80">{subtitle}</p>}
        </div>
        <div className="flex flex-col items-center justify-center h-full p-4">
          <Clock className="h-8 w-8 opacity-30 mb-2" />
          <p className="text-opacity-70 text-sm text-center">Não há atividades pendentes</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col h-full ${bgColorClass} rounded-xl p-3`}>
      <div className="mb-2">
        <h3 className="font-semibold text-lg">{title}</h3>
        {subtitle && <p className="text-sm opacity-80">{subtitle}</p>}
      </div>

      <div className="flex-1 space-y-2">
        {pendingItems.map(item => (
          <div 
            key={item.id}
            className="flex items-start space-x-2 p-2 rounded-md bg-white bg-opacity-30 hover:bg-opacity-50 transition-colors"
          >
            <AlertTriangle 
              className={cn(
                "h-4 w-4 mt-0.5",
                item.type === 'demand' ? "text-amber-500" : "text-blue-500"
              )} 
            />
            <div>
              <p className="text-sm font-medium line-clamp-2">{item.title}</p>
              <p className="text-xs opacity-70">
                {item.type === 'demand' ? 'Demanda pendente' : 'Nota para aprovação'}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PendingActivitiesCard;
