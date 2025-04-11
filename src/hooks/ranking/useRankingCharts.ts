
import { create } from 'zustand';
import { ChartVisibility } from '@/components/ranking/types';
import { supabase } from '@/integrations/supabase/client';

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
  uploadId: string | null;
  insightsProgress: number;
  chartsProgress: number;
  
  toggleChartVisibility: (chartId: string) => void;
  setChartVisibility: (visibility: ChartVisibility) => void;
  setPlanilhaData: (data: any[]) => void;
  setSgzData: (data: any[]) => void;
  setPainelData: (data: any[]) => void;
  setIsLoading: (isLoading: boolean) => void;
  setIsInsightsLoading: (isLoading: boolean) => void;
  setIsChartsLoading: (isLoading: boolean) => void;
  setUploadId: (id: string | null) => void;
  setInsightsProgress: (progress: number) => void;
  setChartsProgress: (progress: number) => void;
  refreshChartData: () => Promise<void>;
}

export const useRankingCharts = create<RankingChartsState>((set, get) => ({
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
  uploadId: null,
  insightsProgress: 0,
  chartsProgress: 0,
  
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
      isLoading: true, 
      isInsightsLoading: true,
      insightsProgress: 10 
    }),
  
  setSgzData: (data: any[]) => 
    set({ sgzData: data }),
  
  setPainelData: (data: any[]) => 
    set({
      painelData: data,
      isLoading: true, 
      chartsProgress: 20
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
  
  setUploadId: (id: string | null) => 
    set({ uploadId: id }),
  
  setInsightsProgress: (progress: number) => 
    set({ insightsProgress: progress }),
  
  setChartsProgress: (progress: number) => 
    set({ chartsProgress: progress }),
    
  refreshChartData: async () => {
    try {
      set({ 
        isLoading: true,
        isInsightsLoading: true,
        isChartsLoading: true,
        insightsProgress: 10,
        chartsProgress: 20
      });
      
      console.log("Refreshing chart data...");
      
      // Fetch latest SGZ data
      const { data: sgzData, error: sgzError } = await supabase
        .from('sgz_ordens_servico')
        .select('*')
        .order('sgz_criado_em', { ascending: false })
        .limit(1000);
        
      if (sgzError) {
        console.error("Error fetching SGZ data:", sgzError);
        throw sgzError;
      }
      
      // Fetch latest Painel data
      const { data: painelData, error: painelError } = await supabase
        .from('painel_zeladoria_dados')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1000);
        
      if (painelError) {
        console.error("Error fetching Painel data:", painelError);
        throw painelError;
      }
      
      console.log(`Fetched ${sgzData?.length || 0} SGZ records and ${painelData?.length || 0} Painel records`);
      
      // Update state with fetched data
      set({ 
        sgzData: sgzData || [],
        planilhaData: sgzData || [],
        painelData: painelData || [],
        isInsightsLoading: false,
        insightsProgress: 100
      });
      
      // Small delay before considering the loading complete
      setTimeout(() => {
        set({ 
          isLoading: false,
          isChartsLoading: false,
          chartsProgress: 100
        });
      }, 1000);
      
      return;
    } catch (error) {
      console.error("Error refreshing chart data:", error);
      set({ 
        isLoading: false,
        isInsightsLoading: false,
        isChartsLoading: false,
        insightsProgress: 0,
        chartsProgress: 0
      });
      throw error;
    }
  }
}));
