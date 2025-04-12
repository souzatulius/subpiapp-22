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
  refreshChartData: () => Promise<void>;
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
        set({ isMockData: isMock }),
        
      setLastRefreshTime: (time: Date | null) =>
        set({ lastRefreshTime: time }),
        
      setLastRefreshSuccess: (success: boolean) =>
        set({ lastRefreshSuccess: success }),
        
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
          
          console.log("Refreshing chart data...");
          
          // Check if we should use mock data based on environment or state
          const useMockData = process.env.NODE_ENV === 'development' || get().isMockData;
          const dataSource = localStorage.getItem('demo-data-source') || (useMockData ? 'mock' : 'supabase');
          
          // First check if we have cached data in localStorage
          let loadedFromCache = false;
          
          try {
            const cachedSgzData = localStorage.getItem('demo-sgz-data');
            const cachedPainelData = localStorage.getItem('demo-painel-data');
            
            if (cachedSgzData && cachedPainelData) {
              const sgzData = JSON.parse(cachedSgzData);
              const painelData = JSON.parse(cachedPainelData);
              
              if (sgzData.length > 0 && painelData.length > 0) {
                console.log(`Loaded data from localStorage cache: ${sgzData.length} SGZ records, ${painelData.length} Painel records`);
                set({ 
                  sgzData: sgzData,
                  planilhaData: sgzData,
                  painelData: painelData,
                  isMockData: dataSource === 'mock',
                  isInsightsLoading: false,
                  insightsProgress: 100
                });
                loadedFromCache = true;
              }
            }
          } catch (cacheError) {
            console.error("Error loading from cache:", cacheError);
          }
          
          // Load fresh data if needed
          if (useMockData || dataSource === 'mock') {
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
          if (!useMockData && dataSource === 'supabase' && !loadedFromCache) {
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
              
              console.log(`Fetched ${sgzData?.length || 0} SGZ records and ${painelData?.length || 0} Painel records from Supabase`);
              
              // Update state with fetched data
              set({ 
                sgzData: sgzData || [],
                planilhaData: sgzData || [],
                painelData: painelData || [],
                isInsightsLoading: false,
                insightsProgress: 100,
                isMockData: false,
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
              throw supabaseError;
            }
          }
          
          // No need for setTimeout anymore, complete loading immediately
          set({ 
            isLoading: false,
            isChartsLoading: false,
            chartsProgress: 100,
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
        isMockData: state.isMockData
      }),
    }
  )
);
