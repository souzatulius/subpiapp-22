import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRankingCharts } from '@/hooks/ranking/useRankingCharts';
import { compararBases } from '@/hooks/ranking/utils/compararBases';
import { useUploadState } from '@/hooks/ranking/useUploadState';
import { toast } from 'sonner';

interface DemoDataProviderProps {
  children: ReactNode;
}

// Create a context for demo data with proper typing
interface DemoDataContextType {
  sgzData: any[] | null;
  painelData: any[] | null;
  isLoading: boolean;
  isRefreshing: boolean;
  hasData: boolean;
  refreshData: () => Promise<boolean>;
  updateMockData: (type: 'sgz' | 'painel', data: any[]) => Promise<void>;
  lastUpdated: Date;
  formattedLastUpdated: string;
  dataSource: 'mock' | 'upload' | 'supabase';
  dataStatus: {
    sgzCount: number;
    painelCount: number;
    lastSgzUpdate: string | null;
    lastPainelUpdate: string | null;
  };
}

// Create a context with a null initial value
const DemoDataContext = createContext<DemoDataContextType | null>(null);

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
const STORAGE_KEY_DATA_SOURCE = 'demo-data-source';

const DemoDataProvider: React.FC<DemoDataProviderProps> = ({ children }) => {
  const [demoSgzData, setDemoSgzData] = useState<any[]>([]);
  const [demoPainelData, setDemoPainelData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [dataSource, setDataSource] = useState<'mock' | 'upload' | 'supabase'>('mock');
  const [dataStatus, setDataStatus] = useState({
    sgzCount: 0,
    painelCount: 0,
    lastSgzUpdate: null as string | null,
    lastPainelUpdate: null as string | null
  });
  
  const { 
    setSgzData, 
    setPlanilhaData, 
    setPainelData, 
    setIsMockData,
    refreshChartData
  } = useRankingCharts();
  
  const { setLastRefreshTime } = useUploadState();
  
  // Update data status when data changes
  useEffect(() => {
    setDataStatus({
      sgzCount: demoSgzData.length,
      painelCount: demoPainelData.length,
      lastSgzUpdate: demoSgzData.length > 0 ? new Date().toLocaleString() : null,
      lastPainelUpdate: demoPainelData.length > 0 ? new Date().toLocaleString() : null
    });
  }, [demoSgzData, demoPainelData]);
  
  // Load data on component mount
  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      
      // Try to get cached data from localStorage first
      let sgzData: any[] = [];
      let painelData: any[] = [];
      let cachedDataSource: 'mock' | 'upload' | 'supabase' = 'mock';
      
      try {
        // Check for cached data
        const cachedSgzData = localStorage.getItem(STORAGE_KEY_SGZ);
        const cachedPainelData = localStorage.getItem(STORAGE_KEY_PAINEL);
        const cachedLastUpdate = localStorage.getItem(STORAGE_KEY_LAST_UPDATE);
        const cachedDataSource = localStorage.getItem(STORAGE_KEY_DATA_SOURCE) as 'mock' | 'upload' | 'supabase' || 'mock';
        
        if (cachedSgzData && cachedPainelData) {
          try {
            sgzData = JSON.parse(cachedSgzData);
            painelData = JSON.parse(cachedPainelData);
            setDataSource(cachedDataSource);
            
            if (cachedLastUpdate) {
              setLastUpdated(new Date(cachedLastUpdate));
              setLastRefreshTime(new Date(cachedLastUpdate));
            }
            
            console.log("DemoDataProvider: Using cached data:", {
              sgzData: sgzData.length,
              painelData: painelData.length,
              source: cachedDataSource
            });
            
            // If we have cached data, use it immediately but still refresh in background
            if (sgzData.length > 0 && painelData.length > 0) {
              setDemoSgzData(sgzData);
              setDemoPainelData(painelData);
              setSgzData(sgzData);
              setPlanilhaData(sgzData);
              setPainelData(painelData);
              setIsMockData(cachedDataSource === 'mock');
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
      
      // Always fetch fresh mock data from API if we don't have valid cached data
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
        
        // Only update if we didn't get valid data from cache
        if (sgzData.length === 0 || painelData.length === 0) {
          // Set the data in both local state and the store
          setDemoSgzData(freshSgzData);
          setDemoPainelData(freshPainelData);
          
          setSgzData(freshSgzData);
          setPlanilhaData(freshSgzData);
          setPainelData(freshPainelData);
          setIsMockData(true);
          setDataSource('mock');
          
          const now = new Date();
          setLastUpdated(now);
          setLastRefreshTime(now);
          
          // Cache in localStorage
          try {
            localStorage.setItem(STORAGE_KEY_SGZ, JSON.stringify(freshSgzData));
            localStorage.setItem(STORAGE_KEY_PAINEL, JSON.stringify(freshPainelData));
            localStorage.setItem(STORAGE_KEY_LAST_UPDATE, now.toISOString());
            localStorage.setItem(STORAGE_KEY_DATA_SOURCE, 'mock');
          } catch (storageError) {
            console.error("Error saving to localStorage:", storageError);
          }
        }
        
        // Update loading state
        setIsLoading(false);
      } catch (error) {
        console.error("DemoDataProvider: Error loading mock data:", error);
        // Only show error if we also failed to load from cache
        if (sgzData.length === 0 || painelData.length === 0) {
          toast.error("Erro ao carregar dados mock. Tente novamente mais tarde.");
        }
        setIsLoading(false);
      }
    }
    
    loadData();
  }, [setSgzData, setPlanilhaData, setPainelData, setIsMockData, setLastRefreshTime]);
  
  // Refresh function for demo data
  const refreshData = async () => {
    if (isRefreshing) return false; // Prevent multiple simultaneous refreshes
    
    setIsRefreshing(true);
    
    try {
      console.log("DemoDataProvider: Refreshing data...");
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
          console.log("DemoDataProvider: Refreshed with cached SGZ data:", sgzData.length);
        }
        
        if (cachedPainelData) {
          const painelData = JSON.parse(cachedPainelData);
          setDemoPainelData(painelData);
          setPainelData(painelData);
          console.log("DemoDataProvider: Refreshed with cached Painel data:", painelData.length);
        }
      } catch (error) {
        console.error("Error loading cached data during refresh:", error);
      }
      
      // Then trigger a refresh of all chart data
      if (refreshChartData) {
        await refreshChartData();
        console.log("DemoDataProvider: Charts refreshed with data");
        toast.success("Dados e gráficos atualizados com sucesso");
      }
      
      setIsRefreshing(false);
      return true;
    } catch (error) {
      console.error("Error refreshing demo data:", error);
      toast.error("Erro ao atualizar os dados");
      setIsRefreshing(false);
      return false;
    }
  };

  // Function to update mock data with validation
  const updateMockData = async (type: 'sgz' | 'painel', data: any[]) => {
    if (!data || !Array.isArray(data)) {
      console.error(`Invalid data format for ${type} update:`, data);
      toast.error(`Formato inválido para dados ${type}`);
      throw new Error(`Invalid data format for ${type}`);
    }
    
    setIsRefreshing(true);
    console.log(`Updating ${type} mock data with ${data.length} records`);
    
    try {
      // Validate data structure based on type
      const isValidStructure = validateDataStructure(type, data);
      if (!isValidStructure.valid) {
        toast.error(`Erro de estrutura nos dados: ${isValidStructure.error}`);
        throw new Error(`Invalid structure: ${isValidStructure.error}`);
      }
      
      // Update local state
      if (type === 'sgz') {
        setDemoSgzData(data);
        setSgzData(data);
        setPlanilhaData(data);
        console.log(`Updated SGZ mock data: ${data.length} records`);
      } else if (type === 'painel') {
        setDemoPainelData(data);
        setPainelData(data);
        console.log(`Updated Painel mock data: ${data.length} records`);
      }
      
      // Update localStorage
      const now = new Date();
      setLastUpdated(now);
      setLastRefreshTime(now);
      setDataSource('mock');
      
      try {
        if (type === 'sgz') {
          localStorage.setItem(STORAGE_KEY_SGZ, JSON.stringify(data));
        } else if (type === 'painel') {
          localStorage.setItem(STORAGE_KEY_PAINEL, JSON.stringify(data));
        }
        localStorage.setItem(STORAGE_KEY_LAST_UPDATE, now.toISOString());
        localStorage.setItem(STORAGE_KEY_DATA_SOURCE, 'mock');
        console.log(`Saved ${type} mock data to localStorage`);
      } catch (storageError) {
        console.error("Error saving to localStorage:", storageError);
        toast.warning("Os dados foram atualizados, mas não foi possível salvá-los no localStorage");
      }
      
      // Trigger a refresh of all chart data after updating the mock data
      if (refreshChartData) {
        try {
          await refreshChartData();
          console.log(`DemoDataProvider: Charts refreshed after ${type} mock data update`);
          toast.success(`Dados ${type === 'sgz' ? 'SGZ' : 'Painel da Zeladoria'} atualizados com sucesso`);
        } catch (chartError) {
          console.error("Error refreshing charts:", chartError);
          toast.warning("Dados atualizados, mas houve um erro ao atualizar os gráficos");
        }
      }
      
      setIsRefreshing(false);
    } catch (error) {
      console.error(`Error updating ${type} mock data:`, error);
      toast.error(`Erro ao atualizar dados mock de ${type === 'sgz' ? 'SGZ' : 'Painel da Zeladoria'}`);
      setIsRefreshing(false);
      throw error;
    }
  };
  
  // Function to validate data structure before saving
  const validateDataStructure = (type: 'sgz' | 'painel', data: any[]): {valid: boolean, error?: string} => {
    if (data.length === 0) {
      return { valid: true }; // Empty array is valid (though not useful)
    }
    
    // Check first item to validate structure
    const firstItem = data[0];
    
    if (type === 'sgz') {
      const requiredFields = ['ordem_servico', 'sgz_status', 'sgz_tipo_servico', 'sgz_distrito'];
      for (const field of requiredFields) {
        if (!(field in firstItem)) {
          return { 
            valid: false, 
            error: `Campo obrigatório '${field}' ausente nos dados do SGZ` 
          };
        }
      }
    } else if (type === 'painel') {
      const requiredFields = ['id_os', 'status', 'tipo_servico', 'distrito'];
      for (const field of requiredFields) {
        if (!(field in firstItem)) {
          return { 
            valid: false, 
            error: `Campo obrigatório '${field}' ausente nos dados do Painel` 
          };
        }
      }
    }
    
    return { valid: true };
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
    isRefreshing,
    hasData: demoSgzData.length > 0 || demoPainelData.length > 0,
    refreshData,
    updateMockData,
    lastUpdated,
    formattedLastUpdated,
    dataSource,
    dataStatus
  };
  
  return (
    <DemoDataContext.Provider value={demoDataValue}>
      {children}
    </DemoDataContext.Provider>
  );
};

export default DemoDataProvider;
