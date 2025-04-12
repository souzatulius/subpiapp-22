
import React, { useState, useEffect, useRef } from 'react';
import { Pie } from 'react-chartjs-2';
import { pieChartColors } from '../utils/chartColors';
import ChartCard from './ChartCard';
import { useOpenAIChartData } from '@/hooks/ranking/useOpenAIChartData';

interface StatusDistributionChartProps {
  data: any;
  sgzData: any[] | null;
  isLoading: boolean;
  isSimulationActive: boolean;
  onToggleVisibility?: () => void;
  onToggleAnalysis?: () => void;
  showAnalysis?: boolean;
}

const StatusDistributionChart: React.FC<StatusDistributionChartProps> = ({ 
  data,
  sgzData,
  isLoading,
  isSimulationActive,
  onToggleVisibility,
  onToggleAnalysis,
  showAnalysis = false
}) => {
  const [chartData, setChartData] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(isLoading);
  const [error, setError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<string>('');
  const chartRef = useRef<any>(null);
  const { generateChartData, isGenerating } = useOpenAIChartData();

  useEffect(() => {
    const processData = async () => {
      setIsProcessing(true);
      setError(null);
      
      try {
        if (!sgzData || sgzData.length === 0) {
          console.log('StatusDistributionChart: No SGZ data provided');
          setChartData(null);
          setIsProcessing(false);
          return;
        }

        console.log(`StatusDistributionChart: Processing ${sgzData.length} records`);

        // Try to generate data with OpenAI
        try {
          const aiChartData = await generateChartData('statusDistribution', sgzData);
          console.log('StatusDistributionChart: AI chart data received', aiChartData);
          
          if (aiChartData && aiChartData.labels && aiChartData.data) {
            const pieData = {
              labels: aiChartData.labels || [],
              datasets: [{
                data: aiChartData.data || [],
                backgroundColor: pieChartColors,
                borderWidth: 1,
                borderColor: '#fff'
              }]
            };
            
            setChartData(pieData);
            
            // Set the analysis if provided
            if (aiChartData.analysis) {
              setAnalysis(aiChartData.analysis);
            } else {
              setAnalysis('Distribuição de status das ordens de serviço mostra a proporção de cada estado no sistema.');
            }
            
            setIsProcessing(false);
            return;
          }
        } catch (aiError) {
          console.error('Error using AI for chart data generation:', aiError);
          // Continue with fallback processing
        }

        // Fallback to client-side processing
        console.log('StatusDistributionChart: Using fallback processing');
        const statusCounts: Record<string, number> = {};
        
        sgzData.forEach(item => {
          const status = item.sgz_status?.toUpperCase() || 'NÃO ESPECIFICADO';
          statusCounts[status] = (statusCounts[status] || 0) + 1;
        });
        
        // Sort statuses by count
        const sortedStatuses = Object.entries(statusCounts)
          .sort(([, countA], [, countB]) => countB - countA);
        
        // Prepare chart data
        const labels = sortedStatuses.map(([status]) => status);
        const values = sortedStatuses.map(([, count]) => count);
        
        console.log('StatusDistributionChart: Generated chart data', {labels, values});
        
        setChartData({
          labels,
          datasets: [{
            data: values,
            backgroundColor: pieChartColors,
            borderWidth: 1,
            borderColor: '#fff'
          }]
        });
        
        setAnalysis('Distribuição de status das ordens de serviço mostra a proporção de cada estado no sistema.');
      } catch (error) {
        console.error('Error processing status distribution data:', error);
        setError('Falha ao processar dados de distribuição de status');
      } finally {
        setIsProcessing(false);
      }
    };
    
    processData();
  }, [sgzData, isSimulationActive, generateChartData]);
  
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          boxWidth: 12,
          font: {
            size: 10
          }
        }
      }
    }
  };

  return (
    <div className="h-[250px]">
      {isProcessing || isGenerating ? (
        <div className="text-center h-full flex flex-col items-center justify-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
          <p className="mt-2 text-sm text-orange-600">Gerando dados...</p>
        </div>
      ) : error ? (
        <div className="text-center h-full flex flex-col items-center justify-center text-red-500">
          <p>{error}</p>
        </div>
      ) : chartData && chartData.labels && chartData.labels.length > 0 ? (
        <Pie 
          data={chartData} 
          options={chartOptions}
          ref={chartRef} 
        />
      ) : (
        <div className="text-center h-full flex flex-col items-center justify-center text-gray-500">
          <p>Sem dados disponíveis</p>
        </div>
      )}
    </div>
  );
};

export default StatusDistributionChart;
