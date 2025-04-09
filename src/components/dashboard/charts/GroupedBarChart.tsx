
import React, { useEffect, useRef, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { motion } from 'framer-motion';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface GroupedBarChartProps {
  data: ChartData<'bar'>;
  height?: number;
  tooltipFormatter?: (tooltipItems: any) => string;
  className?: string;
}

const GroupedBarChart: React.FC<GroupedBarChartProps> = ({
  data,
  height = 300,
  tooltipFormatter,
  className = ''
}) => {
  const chartRef = useRef<ChartJS<'bar'>>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  // Set up IntersectionObserver to detect when chart is visible
  useEffect(() => {
    if (chartContainerRef.current) {
      observerRef.current = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            // Disconnect after first visibility to prevent unnecessary callbacks
            observerRef.current?.disconnect();
          }
        }, 
        { threshold: 0.1 }
      );
      
      observerRef.current.observe(chartContainerRef.current);
    }
    
    return () => {
      observerRef.current?.disconnect();
    };
  }, []);

  // Chart options
  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 800,
      easing: 'easeOutQuart'
    },
    scales: {
      x: {
        grid: {
          display: false
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: '#f2f2f2'
        }
      }
    },
    plugins: {
      legend: {
        position: 'bottom',
        align: 'center',
        labels: {
          boxWidth: 12,
          usePointStyle: true,
          pointStyle: 'circle'
        }
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: '#333',
        bodyColor: '#666',
        bodyFont: { size: 12 },
        titleFont: { size: 13, weight: 'bold' },
        borderColor: '#ddd',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        displayColors: true,
        boxPadding: 5,
        callbacks: {
          title: (contexts) => {
            return contexts[0].label;
          },
          label: tooltipFormatter || ((context) => {
            const label = context.dataset.label || '';
            const value = context.parsed.y || 0;
            
            if (label.includes('Nota')) {
              return `${value} notas de imprensa geradas`;
            } else {
              return `${value} solicitações de imprensa por ${label}`;
            }
          })
        }
      }
    },
    onHover: (event, elements, chart) => {
      // Highlight the hovered bar
      if (elements && elements.length) {
        const index = elements[0].index;
        const datasetIndex = elements[0].datasetIndex;
        
        if (chart.data.datasets) {
          chart.data.datasets.forEach((dataset, i) => {
            const meta = chart.getDatasetMeta(i);
            meta.data.forEach((bar, j) => {
              // Original colors
              const originalBgColor = dataset.backgroundColor;
              const originalBorderColor = dataset.borderColor;
              
              // Dim all bars except the one hovered
              if (i === datasetIndex && j === index) {
                // Highlight the hovered bar
                if (meta.data[j]) {
                  (meta.data[j] as any).options.backgroundColor = typeof originalBgColor === 'string' 
                    ? originalBgColor 
                    : (Array.isArray(originalBgColor) ? originalBgColor[j] : originalBgColor);
                  (meta.data[j] as any).options.borderColor = typeof originalBorderColor === 'string'
                    ? originalBorderColor
                    : (Array.isArray(originalBorderColor) ? originalBorderColor[j] : originalBorderColor);
                }
              } else if (j === index) {
                // Same day, different dataset - subtle highlight
                if (meta.data[j]) {
                  (meta.data[j] as any).options.backgroundColor = typeof originalBgColor === 'string'
                    ? originalBgColor
                    : (Array.isArray(originalBgColor) ? originalBgColor[j] : originalBgColor);
                  (meta.data[j] as any).options.borderColor = typeof originalBorderColor === 'string'
                    ? originalBorderColor
                    : (Array.isArray(originalBorderColor) ? originalBorderColor[j] : originalBorderColor);
                }
              } else {
                // Dim other bars
                if (meta.data[j]) {
                  const color = typeof originalBgColor === 'string' 
                    ? originalBgColor 
                    : (Array.isArray(originalBgColor) ? originalBgColor[j] : originalBgColor);
                  
                  (meta.data[j] as any).options.backgroundColor = color + '80'; // Add transparency
                  (meta.data[j] as any).options.borderColor = color + '80';
                }
              }
            });
          });
        }
        chart.update();
      } else {
        // Reset all bars to their original colors
        if (chart.data.datasets) {
          chart.data.datasets.forEach((dataset, i) => {
            const meta = chart.getDatasetMeta(i);
            meta.data.forEach((bar, j) => {
              const originalBgColor = dataset.backgroundColor;
              const originalBorderColor = dataset.borderColor;
              
              if (meta.data[j]) {
                (meta.data[j] as any).options.backgroundColor = typeof originalBgColor === 'string' 
                  ? originalBgColor 
                  : (Array.isArray(originalBgColor) ? originalBgColor[j] : originalBgColor);
                (meta.data[j] as any).options.borderColor = typeof originalBorderColor === 'string'
                  ? originalBorderColor
                  : (Array.isArray(originalBorderColor) ? originalBorderColor[j] : originalBorderColor);
              }
            });
          });
        }
        chart.update();
      }
    }
  };

  // Only render chart when it becomes visible
  if (!isVisible) {
    return (
      <div 
        ref={chartContainerRef} 
        className={`w-full ${className}`} 
        style={{ height: `${height}px` }}
      >
        <div className="flex items-center justify-center w-full h-full bg-gray-50 rounded-md">
          <div className="text-gray-400">Carregando gráfico...</div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className={`w-full ${className}`}
      style={{ height: `${height}px` }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <Bar 
        ref={chartRef}
        data={data} 
        options={options} 
      />
    </motion.div>
  );
};

export default GroupedBarChart;
