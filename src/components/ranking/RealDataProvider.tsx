
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAnimatedFeedback } from '@/hooks/use-animated-feedback';

// Define the context type
interface RealDataContextType {
  sgzData: any[] | null;
  painelData: any[] | null;
  isLoading: boolean;
  hasData: boolean;
  refreshData: () => Promise<void>;
  lastUpdated: Date | null;
}

// Create the context with default values
const RealDataContext = createContext<RealDataContextType>({
  sgzData: null,
  painelData: null,
  isLoading: true,
  hasData: false,
  refreshData: async () => {},
  lastUpdated: null
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
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const { showFeedback } = useAnimatedFeedback();
  
  // Function to load real data from Supabase
  const loadRealData = async () => {
    setIsLoading(true);
    try {
      console.log('Loading SGZ data from Supabase...');
      
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
      
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Error loading data:", error);
      toast.error('Erro ao carregar dados dos gráficos');
    } finally {
      setIsLoading(false);
    }
  };

  // Function to refresh data (reload the real data)
  const refreshData = async () => {
    await loadRealData();
    toast.success('Dados atualizados com sucesso');
    showFeedback('success', 'Dados atualizados com sucesso');
  };
  
  // Load real data on mount
  useEffect(() => {
    loadRealData();
  }, []);
  
  return (
    <RealDataContext.Provider value={{ 
      sgzData, 
      painelData, 
      isLoading, 
      hasData: Boolean(sgzData?.length || painelData?.length),
      refreshData,
      lastUpdated
    }}>
      {children}
    </RealDataContext.Provider>
  );
};

export default RealDataProvider;
