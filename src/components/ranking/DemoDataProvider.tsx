
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRankingCharts } from '@/hooks/ranking/useRankingCharts';
import { compararBases } from '@/hooks/ranking/utils/compararBases';

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
  const { setSgzData, setPlanilhaData, setPainelData } = useRankingCharts();
  
  useEffect(() => {
    // Load mock data from the JSON files
    async function loadMockData() {
      try {
        setIsLoading(true);
        
        // Load SGZ data
        const sgzResponse = await fetch('/mock/sgz_data_mock.json');
        if (!sgzResponse.ok) {
          throw new Error(`Failed to load SGZ mock data: ${sgzResponse.status}`);
        }
        const sgzData = await sgzResponse.json();
        console.log("DemoDataProvider: Loaded SGZ mock data:", sgzData.length, "records");
        
        // Load Painel data
        const painelResponse = await fetch('/mock/painel_data_mock.json');
        if (!painelResponse.ok) {
          throw new Error(`Failed to load Painel mock data: ${painelResponse.status}`);
        }
        const painelData = await painelResponse.json();
        console.log("DemoDataProvider: Loaded Painel mock data:", painelData.length, "records");
        
        // Compare data to verify integration
        if (sgzData.length > 0 && painelData.length > 0) {
          const comparacao = compararBases(sgzData, painelData);
          console.log("DemoDataProvider: Data comparison results:", {
            totalDivergencias: comparacao.divergencias.length,
            totalAusentes: comparacao.ausentes.length,
            divergenciasStatus: comparacao.divergenciasStatus.length
          });
        }
        
        // Set the data in both local state and the store
        setDemoSgzData(sgzData);
        setDemoPainelData(painelData);
        
        setSgzData(sgzData);
        setPlanilhaData(sgzData);
        setPainelData(painelData);
        
        // Update loading state
        setIsLoading(false);
      } catch (error) {
        console.error("DemoDataProvider: Error loading mock data:", error);
        setIsLoading(false);
      }
    }
    
    loadMockData();
  }, [setSgzData, setPlanilhaData, setPainelData]);
  
  // Refresh function for demo data
  const refreshData = async () => {
    setIsLoading(true);
    
    // Simulate a network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Reload from the JSON files
    try {
      // Load SGZ data
      const sgzResponse = await fetch('/mock/sgz_data_mock.json');
      if (!sgzResponse.ok) {
        throw new Error(`Failed to load SGZ mock data: ${sgzResponse.status}`);
      }
      const sgzData = await sgzResponse.json();
      
      // Load Painel data
      const painelResponse = await fetch('/mock/painel_data_mock.json');
      if (!painelResponse.ok) {
        throw new Error(`Failed to load Painel mock data: ${painelResponse.status}`);
      }
      const painelData = await painelResponse.json();
      
      // Update with refreshed data
      setDemoSgzData(sgzData);
      setDemoPainelData(painelData);
      
      setSgzData(sgzData);
      setPlanilhaData(sgzData);
      setPainelData(painelData);
      
      setLastUpdated(new Date());
      setIsLoading(false);
    } catch (error) {
      console.error("Error refreshing demo data:", error);
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
