
import { useState, useEffect } from 'react';
import { ZeladoriaChartData } from '@/types/ZeladoriaChartData';

export function useZeladoriaChartDataMock(
  delay: number = 1000 // Optional delay to simulate loading
): {
  data: ZeladoriaChartData | null;
  isLoading: boolean;
  error: string | null;
  refresh: () => void;
} {
  const [data, setData] = useState<ZeladoriaChartData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState(0);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    
    async function loadData() {
      try {
        // Simulate network delay for realistic testing
        if (delay > 0) {
          await new Promise(resolve => setTimeout(resolve, delay));
        }
        
        const res = await fetch('/mock/zeladoria_mock_data.json');
        if (!res.ok) {
          throw new Error(`Failed to fetch mock data: ${res.status} ${res.statusText}`);
        }
        
        const json = await res.json();
        
        if (isMounted) {
          setData(json);
          setError(null);
        }
      } catch (err: any) {
        console.error('Error loading mock data:', err);
        if (isMounted) {
          setError(err.message || 'Erro ao carregar dados mockados');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadData();
    
    return () => {
      isMounted = false;
    };
  }, [delay, refreshToken]);

  // Function to refresh data (simulates fetching new data)
  const refresh = () => setRefreshToken(prev => prev + 1);

  return { data, isLoading, error, refresh };
}
