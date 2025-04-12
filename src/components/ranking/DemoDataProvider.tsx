
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRankingCharts } from '@/hooks/ranking/useRankingCharts';

interface DemoDataProviderProps {
  children: ReactNode;
}

// Create a context for demo data
const DemoDataContext = createContext<any>(null);

// Hook to use the demo data context
export const useDemoData = () => {
  const context = useContext(DemoDataContext);
  if (!context) {
    throw new Error('useDemoData must be used within a DemoDataProvider');
  }
  return context;
};

const DemoDataProvider: React.FC<DemoDataProviderProps> = ({ children }) => {
  const [demoSgzData, setDemoSgzData] = useState<any[]>([]);
  const [demoPainelData, setDemoPainelData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const { setSgzData, setPlanilhaData } = useRankingCharts();
  
  useEffect(() => {
    // Load mock SGZ data from the JSON file
    async function loadMockSgzData() {
      try {
        const response = await fetch('/mock/sgz_data_mock.json');
        if (!response.ok) {
          throw new Error(`Failed to load mock data: ${response.status}`);
        }
        const data = await response.json();
        console.log("DemoDataProvider: Loaded SGZ mock data:", data);
        
        // Set the data in both local state and the store
        setDemoSgzData(data);
        setSgzData(data);
        setPlanilhaData(data);
        
        // Generate mock Painel data
        generateMockPainelData();
        
        // Update loading state
        setIsLoading(false);
      } catch (error) {
        console.error("DemoDataProvider: Error loading mock SGZ data:", error);
        setIsLoading(false);
      }
    }
    
    // Generate mock Painel data
    const generateMockPainelData = () => {
      const mockPainel = [
        { id: 1, responsavel_classificado: 'Subprefeitura Pinheiros', distrito: 'Pinheiros', status: 'Concluído' },
        { id: 2, responsavel_classificado: 'ENEL', distrito: 'Vila Madalena', status: 'Em Andamento' },
        { id: 3, responsavel_classificado: 'SABESP', distrito: 'Itaim Bibi', status: 'Pendente' }
      ];
      
      setDemoPainelData(mockPainel);
    };
    
    loadMockSgzData();
  }, [setSgzData, setPlanilhaData]);
  
  // Refresh function for demo data
  const refreshData = async () => {
    setIsLoading(true);
    
    // Simulate a network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Reload from the JSON file
    try {
      const response = await fetch('/mock/sgz_data_mock.json');
      if (!response.ok) {
        throw new Error(`Failed to load mock data: ${response.status}`);
      }
      const data = await response.json();
      
      // Update with refreshed data
      setDemoSgzData(data);
      setSgzData(data);
      setPlanilhaData(data);
      setLastUpdated(new Date());
      
    } catch (error) {
      console.error("Error refreshing demo data:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Format the last updated date for display
  const formattedLastUpdated = lastUpdated.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  
  // Provide demo data context
  const demoDataValue = {
    sgzData: demoSgzData,
    painelData: demoPainelData,
    isLoading,
    isRefreshing: isLoading,
    hasData: demoSgzData.length > 0 || demoPainelData.length > 0,
    refreshData,
    lastUpdated,
    formattedLastUpdated
  };
  
  return (
    <DemoDataContext.Provider value={demoDataValue}>
      {children}
    </DemoDataContext.Provider>
  );
};

export default DemoDataProvider;
