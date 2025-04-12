
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRankingCharts } from '@/hooks/ranking/useRankingCharts';
import { compararBases } from '@/hooks/ranking/utils/compararBases';
import { useUploadState } from '@/hooks/ranking/useUploadState';
import { toast } from 'sonner';

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

const STORAGE_KEY_SGZ = 'demo-sgz-data';
const STORAGE_KEY_PAINEL = 'demo-painel-data';
const STORAGE_KEY_LAST_UPDATE = 'demo-last-update';

const DemoDataProvider: React.FC<DemoDataProviderProps> = ({ children }) => {
  const [demoSgzData, setDemoSgzData] = useState<any[]>([]);
  const [demoPainelData, setDemoPainelData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const { 
    setSgzData, 
    setPlanilhaData, 
    setPainelData, 
    setIsMockData,
    refreshChartData
  } = useRankingCharts();
  const { setLastRefreshTime } = useUploadState();
  
  // Load data on component mount
  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      
      // Try to get cached data from localStorage first
      let sgzData: any[] = [];
      let painelData: any[] = [];
      
      try {
        // Check for cached data
        const cachedSgzData = localStorage.getItem(STORAGE_KEY_SGZ);
        const cachedPainelData = localStorage.getItem(STORAGE_KEY_PAINEL);
        const cachedLastUpdate = localStorage.getItem(STORAGE_KEY_LAST_UPDATE);
        
        if (cachedSgzData && cachedPainelData) {
          try {
            sgzData = JSON.parse(cachedSgzData);
            painelData = JSON.parse(cachedPainelData);
            
            if (cachedLastUpdate) {
              setLastUpdated(new Date(cachedLastUpdate));
              setLastRefreshTime(new Date(cachedLastUpdate));
            }
            
            console.log("DemoDataProvider: Using cached data:", {
              sgzData: sgzData.length,
              painelData: painelData.length
            });
            
            // If we have cached data, use it immediately but still refresh in background
            if (sgzData.length > 0 && painelData.length > 0) {
              setDemoSgzData(sgzData);
              setDemoPainelData(painelData);
              setSgzData(sgzData);
              setPlanilhaData(sgzData);
              setPainelData(painelData);
              setIsMockData(true);
              setIsLoading(false);
            }
          } catch (parseError) {
            console.error("Error parsing cached data:", parseError);
            // Continue to fetch fresh data on parse error
          }
        }
      } catch (error) {
        console.error("Error loading from localStorage:", error);
      }
      
      // Always fetch fresh data from mock API
      try {
        // Add timestamp to prevent caching
        const timestamp = new Date().getTime();
        
        // Load SGZ data
        const sgzResponse = await fetch(`/mock/sgz_data_mock.json?t=${timestamp}`);
        if (!sgzResponse.ok) {
          throw new Error(`Failed to load SGZ mock data: ${sgzResponse.status}`);
        }
        const freshSgzData = await sgzResponse.json();
        console.log("DemoDataProvider: Loaded SGZ mock data:", freshSgzData.length, "records");
        
        // Load Painel data
        const painelResponse = await fetch(`/mock/painel_data_mock.json?t=${timestamp}`);
        if (!painelResponse.ok) {
          throw new Error(`Failed to load Painel mock data: ${painelResponse.status}`);
        }
        const freshPainelData = await painelResponse.json();
        console.log("DemoDataProvider: Loaded Painel mock data:", freshPainelData.length, "records");
        
        // Compare data to verify integration
        if (freshSgzData.length > 0 && freshPainelData.length > 0) {
          const comparacao = compararBases(freshSgzData, freshPainelData);
          console.log("DemoDataProvider: Data comparison results:", {
            totalDivergencias: comparacao.divergencias.length,
            totalAusentes: comparacao.ausentes.length,
            divergenciasStatus: comparacao.divergenciasStatus.length
          });
        }
        
        // Set the data in both local state and the store
        setDemoSgzData(freshSgzData);
        setDemoPainelData(freshPainelData);
        
        setSgzData(freshSgzData);
        setPlanilhaData(freshSgzData);
        setPainelData(freshPainelData);
        setIsMockData(true);
        
        const now = new Date();
        setLastUpdated(now);
        setLastRefreshTime(now);
        
        // Cache in localStorage
        try {
          localStorage.setItem(STORAGE_KEY_SGZ, JSON.stringify(freshSgzData));
          localStorage.setItem(STORAGE_KEY_PAINEL, JSON.stringify(freshPainelData));
          localStorage.setItem(STORAGE_KEY_LAST_UPDATE, now.toISOString());
        } catch (storageError) {
          console.error("Error saving to localStorage:", storageError);
        }
        
        // Update loading state
        setIsLoading(false);
      } catch (error) {
        console.error("DemoDataProvider: Error loading mock data:", error);
        setIsLoading(false);
      }
    }
    
    loadData();
  }, [setSgzData, setPlanilhaData, setPainelData, setIsMockData, setLastRefreshTime]);
  
  // Refresh function for demo data
  const refreshData = async () => {
    setIsLoading(true);
    
    // Trigger a refresh of all chart data
    try {
      // First ensure we have the latest data
      const now = new Date();
      setLastUpdated(now);
      setLastRefreshTime(now);
      
      // If we have edited mock data in localStorage, use that
      try {
        const cachedSgzData = localStorage.getItem(STORAGE_KEY_SGZ);
        const cachedPainelData = localStorage.getItem(STORAGE_KEY_PAINEL);
        
        if (cachedSgzData) {
          const sgzData = JSON.parse(cachedSgzData);
          setDemoSgzData(sgzData);
          setSgzData(sgzData);
          setPlanilhaData(sgzData);
        }
        
        if (cachedPainelData) {
          const painelData = JSON.parse(cachedPainelData);
          setDemoPainelData(painelData);
          setPainelData(painelData);
        }
      } catch (error) {
        console.error("Error loading cached data during refresh:", error);
      }
      
      // Then trigger a refresh of all chart data
      if (refreshChartData) {
        await refreshChartData();
        console.log("DemoDataProvider: Charts refreshed with mock data");
      }
      
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error("Error refreshing demo data:", error);
      setIsLoading(false);
      return false;
    }
  };

  // New function to update mock data
  const updateMockData = async (type: 'sgz' | 'painel', data: any[]) => {
    setIsLoading(true);
    
    try {
      // Update local state
      if (type === 'sgz') {
        setDemoSgzData(data);
        setSgzData(data);
        setPlanilhaData(data);
      } else if (type === 'painel') {
        setDemoPainelData(data);
        setPainelData(data);
      }
      
      // Update localStorage
      const now = new Date();
      setLastUpdated(now);
      setLastRefreshTime(now);
      
      try {
        if (type === 'sgz') {
          localStorage.setItem(STORAGE_KEY_SGZ, JSON.stringify(data));
        } else if (type === 'painel') {
          localStorage.setItem(STORAGE_KEY_PAINEL, JSON.stringify(data));
        }
        localStorage.setItem(STORAGE_KEY_LAST_UPDATE, now.toISOString());
      } catch (storageError) {
        console.error("Error saving to localStorage:", storageError);
        toast.error("Erro ao salvar dados no localStorage");
        throw storageError;
      }
      
      // In development mode, we'll allow updating the mock data files (would require backend)
      if (process.env.NODE_ENV === 'development') {
        console.log(`Mock data update requested for ${type}:`, data);
        toast.success(`Mock data para ${type === 'sgz' ? 'SGZ' : 'Painel da Zeladoria'} atualizado com sucesso`);
      }
      
      // Trigger a refresh of all chart data after updating the mock data
      if (refreshChartData) {
        await refreshChartData();
        console.log(`DemoDataProvider: Charts refreshed after ${type} mock data update`);
      }
      
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error(`Error updating ${type} mock data:`, error);
      toast.error(`Erro ao atualizar dados mock de ${type === 'sgz' ? 'SGZ' : 'Painel da Zeladoria'}`);
      setIsLoading(false);
      throw error;
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
    updateMockData,
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
