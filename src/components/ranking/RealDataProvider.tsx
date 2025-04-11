
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAnimatedFeedback } from '@/hooks/use-animated-feedback';
import { format, formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Define the context type
interface RealDataContextType {
  sgzData: any[] | null;
  painelData: any[] | null;
  isLoading: boolean;
  hasData: boolean;
  refreshData: () => Promise<void>;
  lastUpdated: Date | null;
  formattedLastUpdated: string | null;
  isRefreshing: boolean;
}

// Create the context with default values
const RealDataContext = createContext<RealDataContextType>({
  sgzData: null,
  painelData: null,
  isLoading: true,
  hasData: false,
  refreshData: async () => {},
  lastUpdated: null,
  formattedLastUpdated: null,
  isRefreshing: false
});

// Custom hook to use the context
export const useRealData = () => useContext(RealDataContext);

// Provider component
interface RealDataProviderProps {
  children: ReactNode;
}

const RealDataProvider: React.FC<RealDataProviderProps> = ({ children }) => {
  const [sgzData, setSgzData] = useState<any[] | null>(null);
  const [painelData, setPainelData] = useState<any[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [formattedLastUpdated, setFormattedLastUpdated] = useState<string | null>(null);
  const { showFeedback } = useAnimatedFeedback();
  
  // Format the last updated time in a readable format
  useEffect(() => {
    if (lastUpdated) {
      const formatted = formatDistanceToNow(lastUpdated, { 
        addSuffix: true,
        locale: ptBR
      });
      setFormattedLastUpdated(formatted);
      
      // Update the formatted time every minute
      const interval = setInterval(() => {
        const newFormatted = formatDistanceToNow(lastUpdated, { 
          addSuffix: true,
          locale: ptBR
        });
        setFormattedLastUpdated(newFormatted);
      }, 60000); // Update every minute
      
      return () => clearInterval(interval);
    }
    return undefined;
  }, [lastUpdated]);
  
  // Function to load real data from Supabase
  const loadRealData = async () => {
    // If this is a refresh rather than initial load, use a different flag
    const isInitialLoad = !lastUpdated;
    if (!isInitialLoad) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    
    try {
      console.log('Loading data from Supabase...');
      
      // Fetch SGZ data
      const { data: sgzOrders, error: sgzError } = await supabase
        .from('sgz_ordens_servico')
        .select('*')
        .order('sgz_criado_em', { ascending: false })
        .limit(1000);
      
      if (sgzError) {
        console.error('Error fetching SGZ data:', sgzError);
        toast.error('Erro ao carregar dados SGZ');
        showFeedback('error', 'Erro ao carregar dados SGZ');
        throw sgzError;
      }
      
      console.log(`Loaded ${sgzOrders?.length || 0} SGZ orders`);
      setSgzData(sgzOrders);
      
      // Fetch Painel data
      const { data: painelOrders, error: painelError } = await supabase
        .from('painel_zeladoria_dados')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1000);
      
      if (painelError) {
        console.error('Error fetching Painel data:', painelError);
        toast.error('Erro ao carregar dados do Painel');
        showFeedback('error', 'Erro ao carregar dados do Painel');
        throw painelError;
      }
      
      console.log(`Loaded ${painelOrders?.length || 0} Painel records`);
      setPainelData(painelOrders);
      
      // Only update the last updated time when we have successfully loaded data
      setLastUpdated(new Date());
      
      // Show a success message only if this was a manual refresh
      if (!isInitialLoad) {
        toast.success('Dados atualizados com sucesso');
        showFeedback('success', 'Dados atualizados com sucesso');
      }
    } catch (error) {
      console.error("Error loading data:", error);
      if (!isInitialLoad) {
        toast.error('Erro ao atualizar dados');
        showFeedback('error', 'Erro ao atualizar dados');
      }
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  // Function to refresh data (reload the real data)
  const refreshData = async () => {
    if (isRefreshing) return; // Prevent multiple simultaneous refreshes
    await loadRealData();
  };
  
  // Subscribe to realtime changes for automatic updates
  useEffect(() => {
    // Setup a subscription to listen for changes in the data tables
    const sgzChannel = supabase
      .channel('sgz-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'sgz_ordens_servico'
      }, () => {
        console.log('SGZ data changed, refreshing...');
        refreshData();
      })
      .subscribe();
    
    const painelChannel = supabase
      .channel('painel-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'painel_zeladoria_dados'
      }, () => {
        console.log('Painel data changed, refreshing...');
        refreshData();
      })
      .subscribe();
    
    // Load real data on mount
    loadRealData();
    
    return () => {
      supabase.removeChannel(sgzChannel);
      supabase.removeChannel(painelChannel);
    };
  }, []);
  
  return (
    <RealDataContext.Provider value={{ 
      sgzData, 
      painelData, 
      isLoading, 
      isRefreshing,
      hasData: Boolean(sgzData?.length || painelData?.length),
      refreshData,
      lastUpdated,
      formattedLastUpdated
    }}>
      {children}
    </RealDataContext.Provider>
  );
};

export default RealDataProvider;
