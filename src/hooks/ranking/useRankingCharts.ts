import { create } from 'zustand';
import { ChartVisibility } from '@/components/ranking/types';
import { supabase } from '@/integrations/supabase/client';
import { persist, createJSONStorage } from 'zustand/middleware';
import { toast } from 'sonner';

// Define ChartData directly since it's not exported from the types file
interface ChartData {
  [key: string]: any;
}

interface RankingChartsState {
  chartVisibility: ChartVisibility;
  chartData: ChartData;
  planilhaData: any[] | null;
  sgzData: any[] | null;
  painelData: any[] | null;
  isLoading: boolean;
  isInsightsLoading: boolean;
  isChartsLoading: boolean;
  isRefreshing: boolean;
  uploadId: string | null;
  insightsProgress: number;
  chartsProgress: number;
  isMockData: boolean;
  lastRefreshTime: Date | null;
  lastRefreshSuccess: boolean;
  dataSource: 'mock' | 'upload' | 'supabase';
  
  toggleChartVisibility: (chartId: string) => void;
  setChartVisibility: (visibility: ChartVisibility) => void;
  setPlanilhaData: (data: any[]) => void;
  setSgzData: (data: any[]) => void;
  setPainelData: (data: any[]) => void;
  setIsLoading: (isLoading: boolean) => void;
  setIsInsightsLoading: (isLoading: boolean) => void;
  setIsChartsLoading: (isLoading: boolean) => void;
  setIsRefreshing: (isRefreshing: boolean) => void;
  setUploadId: (id: string | null) => void;
  setInsightsProgress: (progress: number) => void;
  setChartsProgress: (progress: number) => void;
  setIsMockData: (isMock: boolean) => void;
  setLastRefreshTime: (time: Date | null) => void;
  setLastRefreshSuccess: (success: boolean) => void;
  setDataSource: (source: 'mock' | 'upload' | 'supabase') => void;
  refreshChartData: () => Promise<void>;
  clearAllData: () => void;
}

export const useRankingCharts = create<RankingChartsState>()(
  persist(
    (set, get) => ({
      chartVisibility: {
        // Performance & Efficiency charts
        statusDistribution: true,
        statusTransition: true,
        districtEfficiencyRadar: true,
        resolutionTime: true,
        
        // Territories & Services charts
        districtPerformance: true,
        serviceTypes: true,
        
        // Critical Flows charts
        responsibility: true,
        sgzPainel: true,
        oldestPendingList: true,
        
        // Keeping other chart visibility flags for backward compatibility
        evolution: true,
        departmentComparison: true,
        topCompanies: true,
        districtDistribution: true,
        servicesByDepartment: true,
        servicesByDistrict: true,
        timeComparison: true,
        dailyDemands: true,
        closureTime: true,
        neighborhoodComparison: true,
        externalDistricts: true,
        efficiencyImpact: true,
        criticalStatus: true,
        serviceDiversity: true
      },
      chartData: {},
      planilhaData: null,
      sgzData: null,
      painelData: null,
      isLoading: false,
      isInsightsLoading: false,
      isChartsLoading: false,
      isRefreshing: false,
      uploadId: null,
      insightsProgress: 0,
      chartsProgress: 0,
      isMockData: false,
      lastRefreshTime: null,
      lastRefreshSuccess: true,
      dataSource: 'mock',
      
      toggleChartVisibility: (chartId: string) => 
        set(state => ({
          chartVisibility: {
            ...state.chartVisibility,
            [chartId]: !state.chartVisibility[chartId]
          }
        })),
      
      setChartVisibility: (visibility: ChartVisibility) => 
        set({ chartVisibility: visibility }),
      
      setPlanilhaData: (data: any[]) => 
        set({ 
          planilhaData: data,
          isInsightsLoading: true,
          insightsProgress: 10,
          lastRefreshTime: new Date(),
        }),
      
      setSgzData: (data: any[]) => 
        set({ 
          sgzData: data,
          lastRefreshTime: new Date()
        }),
      
      setPainelData: (data: any[]) => 
        set({
          painelData: data,
          isLoading: false,
          chartsProgress: 100,
          lastRefreshTime: new Date()
        }),
      
      setIsLoading: (isLoading: boolean) => 
        set({ isLoading }),
      
      setIsInsightsLoading: (isInsightsLoading: boolean) => 
        set({ 
          isInsightsLoading,
          insightsProgress: isInsightsLoading ? 10 : 100
        }),
      
      setIsChartsLoading: (isChartsLoading: boolean) => 
        set({ 
          isChartsLoading,
          chartsProgress: isChartsLoading ? 20 : 100 
        }),
      
      setIsRefreshing: (isRefreshing: boolean) => 
        set({ isRefreshing }),
      
      setUploadId: (id: string | null) => 
        set({ uploadId: id }),
      
      setInsightsProgress: (progress: number) => 
        set({ insightsProgress: progress }),
      
      setChartsProgress: (progress: number) => 
        set({ chartsProgress: progress }),
        
      setIsMockData: (isMock: boolean) =>
        set({ 
          isMockData: isMock,
          dataSource: isMock ? 'mock' : get().dataSource
        }),
        
      setLastRefreshTime: (time: Date | null) =>
        set({ lastRefreshTime: time }),
        
      setLastRefreshSuccess: (success: boolean) =>
        set({ lastRefreshSuccess: success }),

      setDataSource: (source: 'mock' | 'upload' | 'supabase') =>
        set({ 
          dataSource: source,
          isMockData: source === 'mock'
        }),
        
      clearAllData: () => set({
        planilhaData: null,
        sgzData: null,
        painelData: null,
        chartData: {},
        lastRefreshTime: null,
        uploadId: null
      }),
        
      refreshChartData: async () => {
        try {
          // Prevent multiple simultaneous refreshes
          if (get().isLoading || get().isRefreshing) {
            console.log("Chart refresh already in progress, skipping");
            return;
          }
          
          set({ 
            isLoading: true,
            isRefreshing: true,
            isInsightsLoading: true,
            isChartsLoading: true,
            insightsProgress: 10,
            chartsProgress: 20,
            lastRefreshSuccess: false
          });
          
          console.log("Refreshing chart data with current dataSource:", get().dataSource);
          
          // Check if we should use mock data based on explicitly set dataSource
          const dataSourceFromStorage = localStorage.getItem('demo-data-source');
          console.log("Data source from localStorage:", dataSourceFromStorage);
          
          // Use the value from localStorage if available, otherwise fall back to state
          let useMockData = dataSourceFromStorage === 'mock' || 
            (dataSourceFromStorage !== 'upload' && dataSourceFromStorage !== 'supabase' && get().isMockData);
          
          // Update the store's dataSource based on localStorage
          if (dataSourceFromStorage) {
            set({ 
              dataSource: dataSourceFromStorage as 'mock' | 'upload' | 'supabase',
              isMockData: dataSourceFromStorage === 'mock'
            });
          }
          
          console.log("Using mock data:", useMockData, "with data source:", get().dataSource);
          
          // First check if we have cached data in localStorage
          let loadedFromCache = false;
          
          try {
            const cachedSgzData = localStorage.getItem('demo-sgz-data');
            const cachedPainelData = localStorage.getItem('demo-painel-data');
            
            if (cachedSgzData || cachedPainelData) {
              // Process SGZ data if available
              if (cachedSgzData) {
                try {
                  const sgzData = JSON.parse(cachedSgzData);
                  if (Array.isArray(sgzData) && sgzData.length > 0) {
                    console.log(`Loaded ${sgzData.length} SGZ records from localStorage cache`);
                    set({ 
                      sgzData: sgzData,
                      planilhaData: sgzData,
                      // Set mock data based on actual data source
                      isMockData: dataSourceFromStorage === 'mock',
                      dataSource: dataSourceFromStorage as 'mock' | 'upload' | 'supabase',
                      isInsightsLoading: false,
                      insightsProgress: 100,
                      lastRefreshSuccess: true
                    });
                    loadedFromCache = true;
                  }
                } catch (err) {
                  console.error("Failed to parse SGZ data from localStorage", err);
                }
              }
              
              // Process Painel data if available (independent of SGZ)
              if (cachedPainelData) {
                try {
                  const painelData = JSON.parse(cachedPainelData);
                  if (Array.isArray(painelData) && painelData.length > 0) {
                    console.log(`Loaded ${painelData.length} Painel records from localStorage cache`);
                    set({ 
                      painelData: painelData,
                      // Set mock data based on actual data source, only if not already set by SGZ
                      isMockData: !loadedFromCache ? dataSourceFromStorage === 'mock' : get().isMockData,
                      dataSource: !loadedFromCache ? 
                        dataSourceFromStorage as 'mock' | 'upload' | 'supabase' : 
                        get().dataSource,
                      isInsightsLoading: false,
                      insightsProgress: 100,
                      lastRefreshSuccess: true
                    });
                    loadedFromCache = true;
                  }
                } catch (err) {
                  console.error("Failed to parse Painel data from localStorage", err);
                }
              }
              
              // Special case for uploaded data - ensure we set correct flags
              if (dataSourceFromStorage === 'upload' && loadedFromCache) {
                set({
                  isMockData: false,
                  dataSource: 'upload',
                  lastRefreshSuccess: true
                });
              }
            }
          } catch (cacheError) {
            console.error("Error loading from cache:", cacheError);
          }
          
          // Load fresh data if we didn't load from cache
          if (get().dataSource === 'mock' || useMockData) {
            // Only load from mock API if we didn't get valid data from cache
            if (!loadedFromCache) {
              try {
                // Add timestamp to prevent caching
                const timestamp = new Date().getTime();
                
                // Load SGZ data
                const sgzResponse = await fetch(`/mock/sgz_data_mock.json?t=${timestamp}`);
                if (!sgzResponse.ok) {
                  throw new Error(`Failed to load SGZ mock data: ${sgzResponse.status}`);
                }
                const sgzData = await sgzResponse.json();
                console.log(`Loaded ${sgzData.length} SGZ records from mock`);
                
                // Load Painel data
                const painelResponse = await fetch(`/mock/painel_data_mock.json?t=${timestamp}`);
                if (!painelResponse.ok) {
                  throw new Error(`Failed to load Painel mock data: ${painelResponse.status}`);
                }
                const painelData = await painelResponse.json();
                console.log(`Loaded ${painelData.length} Painel records from mock`);
                
                set({ 
                  sgzData: sgzData,
                  planilhaData: sgzData,
                  painelData: painelData,
                  isMockData: true,
                  dataSource: 'mock',
                  lastRefreshSuccess: true
                });
                
                // Save to localStorage
                try {
                  localStorage.setItem('demo-sgz-data', JSON.stringify(sgzData));
                  localStorage.setItem('demo-painel-data', JSON.stringify(painelData));
                  localStorage.setItem('demo-last-update', new Date().toISOString());
                  localStorage.setItem('demo-data-source', 'mock');
                } catch (storageError) {
                  console.error("Error saving to localStorage:", storageError);
                }
                
                set({
                  isInsightsLoading: false,
                  insightsProgress: 100
                });
              } catch (mockError) {
                console.error("Error loading mock data:", mockError);
                toast.error("Erro ao carregar dados mock");
                set({ lastRefreshSuccess: false });
                
                // Continue to try loading from Supabase if mock loading fails and we're not in dev
                if (process.env.NODE_ENV !== 'development') {
                  loadedFromCache = false;
                } else {
                  throw mockError;
                }
              }
            }
          }
          
          // Only fetch from Supabase if we're not using mocks or mock loading failed
          if (get().dataSource === 'supabase' && !useMockData && !loadedFromCache) {
            try {
              // Fetch latest SGZ data from Supabase
              const { data: sgzData, error: sgzError } = await supabase
                .from('sgz_ordens_servico')
                .select('*')
                .order('sgz_criado_em', { ascending: false })
                .limit(1000);
                
              if (sgzError) {
                console.error("Error fetching SGZ data:", sgzError);
                toast.error("Erro ao buscar dados SGZ do Supabase");
                throw sgzError;
              }
              
              console.log("Fetched SGZ data from Supabase:", sgzData?.length || 0, "records");
              
              // Fetch latest Painel data from Supabase
              const { data: painelData, error: painelError } = await supabase
                .from('painel_zeladoria_dados')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(1000);
                
              if (painelError) {
                console.error("Error fetching Painel data:", painelError);
                toast.error("Erro ao buscar dados do Painel do Supabase");
                throw painelError;
              }
              
              console.log("Fetched Painel data from Supabase:", painelData?.length || 0, "records");
              
              // Update state with fetched data
              set({ 
                sgzData: sgzData || [],
                planilhaData: sgzData || [],
                painelData: painelData || [],
                isInsightsLoading: false,
                insightsProgress: 100,
                isMockData: false,
                dataSource: 'supabase',
                lastRefreshSuccess: true
              });
              
              // Save to localStorage for faster loading next time
              try {
                localStorage.setItem('demo-sgz-data', JSON.stringify(sgzData));
                localStorage.setItem('demo-painel-data', JSON.stringify(painelData));
                localStorage.setItem('demo-last-update', new Date().toISOString());
                localStorage.setItem('demo-data-source', 'supabase');
              } catch (storageError) {
                console.error("Error saving to localStorage:", storageError);
              }
            } catch (supabaseError) {
              console.error("Error fetching data from Supabase:", supabaseError);
              toast.error("Erro ao buscar dados do Supabase");
              set({ lastRefreshSuccess: false });
              
              // Fall back to mock data if Supabase fails
              if (!get().isMockData) {
                console.warn("Supabase failed. Falling back to mock data.");
                try {
                  // Update localStorage to use mock data
                  localStorage.setItem('demo-data-source', 'mock');
                  
                  // Retry with mock data
                  set({ isMockData: true, dataSource: 'mock' });
                  
                  // Re-run the refresh with mock data
                  return get().refreshChartData();
                } catch (fallbackError) {
                  console.error("Failed to fall back to mock data:", fallbackError);
                  throw supabaseError;
                }
              } else {
                throw supabaseError;
              }
            }
          }
          
          set({ 
            isLoading: false,
            isChartsLoading: false,
            chartsProgress: 100,
            isRefreshing: false,
            lastRefreshTime: new Date()
          });
          
          return;
        } catch (error) {
          console.error("Error refreshing chart data:", error);
          toast.error("Erro ao atualizar dados dos gráficos");
          set({ 
            isLoading: false,
            isInsightsLoading: false,
            isChartsLoading: false,
            isRefreshing: false,
            insightsProgress: 0,
            chartsProgress: 0,
            lastRefreshSuccess: false
          });
          throw error;
        }
      }
    }),
    {
      name: 'ranking-charts-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ 
        chartVisibility: state.chartVisibility,
        isMockData: state.isMockData,
        dataSource: state.dataSource,
        uploadId: state.uploadId,
        lastRefreshTime: state.lastRefreshTime ? state.lastRefreshTime.toISOString() : null
      }),
    }
  )
);
