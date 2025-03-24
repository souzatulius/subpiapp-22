
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, CheckCircle, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useSupabaseAuth';

interface OverdueDemandsProps {
  id: string;
  overdueCount: number;
  overdueItems: { title: string; id: string }[];
}

const OverdueDemandsCard: React.FC<OverdueDemandsProps> = ({ 
  id, 
  overdueCount: initialOverdueCount,
  overdueItems: initialOverdueItems
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [overdueItems, setOverdueItems] = useState<{ title: string; id: string }[]>(initialOverdueItems);
  const [overdueCount, setOverdueCount] = useState<number>(initialOverdueCount);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  useEffect(() => {
    const fetchOverdueDemands = async () => {
      if (!user) return;
      
      setIsLoading(true);
      
      try {
        // First, get user's area_coordenacao_id
        const { data: userData, error: userError } = await supabase
          .from('usuarios')
          .select('area_coordenacao_id')
          .eq('id', user.id)
          .single();
          
        if (userError) throw userError;
        
        const userAreaId = userData?.area_coordenacao_id;
        
        // Get current date for comparing with deadlines
        const now = new Date().toISOString();
        
        // Fetch overdue demands for user's area
        const { data: demandsData, error: demandsError } = await supabase
          .from('demandas')
          .select('id, titulo')
          .lt('prazo_resposta', now) // Less than = past deadline
          .eq('area_coordenacao_id', userAreaId)
          .eq('status', 'pendente')
          .order('prazo_resposta', { ascending: true })
          .limit(5);
          
        if (demandsError) throw demandsError;
        
        if (demandsData) {
          const formattedItems = demandsData.map(demand => ({
            id: demand.id,
            title: demand.titulo || 'Demanda sem título'
          }));
          
          setOverdueItems(formattedItems);
          setOverdueCount(formattedItems.length);
        }
      } catch (error) {
        console.error('Error fetching overdue demands:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchOverdueDemands();
    
    // Set up a real-time subscription for new demands
    const demandsChannel = supabase
      .channel('overdue-demands-changes')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen for all events (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'demandas',
        },
        () => {
          // Just re-fetch data when changes occur
          fetchOverdueDemands();
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(demandsChannel);
    };
  }, [user]);

  const hasOverdueItems = overdueCount > 0;

  const handleViewAll = () => {
    navigate('/dashboard/comunicacao/consultar');
  };

  const handleItemClick = (itemId: string) => {
    navigate(`/dashboard/comunicacao/consultar?id=${itemId}`);
  };

  return (
    <Card 
      className={`cursor-pointer h-full ${hasOverdueItems 
        ? 'bg-red-50 text-red-800 border border-red-200' 
        : 'bg-green-50 text-green-800 border border-green-200'} 
        rounded-xl shadow-md hover:shadow-xl overflow-hidden transform-gpu hover:scale-[1.03] transition-all duration-300`}
    >
      <CardContent className="flex flex-col justify-between h-full p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">
            {hasOverdueItems ? 'Demandas em Atraso' : 'Você está com tudo em dia'}
          </h3>
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            hasOverdueItems 
              ? <Clock className="h-5 w-5" /> 
              : <CheckCircle className="h-5 w-5" />
          )}
        </div>
        
        <div className="space-y-2 mt-2">
          {isLoading ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
              <span className="ml-2 text-sm text-gray-500">Carregando...</span>
            </div>
          ) : hasOverdueItems ? (
            <ul className="text-sm space-y-2">
              {overdueItems.map((item, index) => (
                <li 
                  key={index} 
                  className="truncate cursor-pointer hover:underline" 
                  onClick={() => handleItemClick(item.id)}
                >
                  • {item.title}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm">Não existem demandas em atraso no momento.</p>
          )}
        </div>
        
        {hasOverdueItems && (
          <div className="flex justify-between items-center mt-4 pt-2 border-t border-red-200">
            <span className="text-sm font-medium">Total: {overdueCount} em atraso</span>
            <button 
              onClick={handleViewAll}
              className="text-xs px-2 py-1 bg-red-100 hover:bg-red-200 text-red-800 rounded transition-colors"
            >
              Ver todas
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OverdueDemandsCard;
