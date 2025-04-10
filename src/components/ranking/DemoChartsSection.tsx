
import React from 'react';
import { Card } from '@/components/ui/card';
import { barChartColors, pieChartColors, lineChartColors } from './utils/chartColors';
import { Bar, Pie, Line } from 'react-chartjs-2';

interface DemoChartsSectionProps {
  className?: string;
}

const DemoChartsSection: React.FC<DemoChartsSectionProps> = ({ className }) => {
  // Sample data generators for demo charts
  const barData = {
    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai'],
    datasets: [
      {
        label: 'Resolvidos',
        data: [65, 59, 80, 81, 56],
        backgroundColor: barChartColors[0],
      },
      {
        label: 'Pendentes',
        data: [28, 48, 40, 19, 86],
        backgroundColor: barChartColors[1],
      },
    ],
  };

  const pieData = {
    labels: ['Concluído', 'Em Progresso', 'Pendente', 'Cancelado', 'Atrasado'],
    datasets: [
      {
        data: [45, 25, 20, 5, 5],
        backgroundColor: pieChartColors,
        borderWidth: 1,
        borderColor: '#fff'
      },
    ],
  };

  const lineData = {
    labels: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio'],
    datasets: [
      {
        label: 'Resolutividade 2023',
        data: [32, 45, 47, 52, 59],
        borderColor: lineChartColors[0],
        backgroundColor: `${lineChartColors[0]}33`,
        tension: 0.4,
      },
      {
        label: 'Resolutividade 2024',
        data: [45, 52, 63, 58, 78],
        borderColor: lineChartColors[1],
        backgroundColor: `${lineChartColors[1]}33`,
        tension: 0.4,
      },
    ],
  };

  return (
    <Card className={`p-5 bg-white border-orange-100 shadow-sm ${className}`}>
      <h2 className="text-lg font-semibold mb-6">Demonstração de Gráficos</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Bar Chart */}
        <div className="bg-white p-4 rounded-lg border border-gray-100">
          <h3 className="font-medium text-gray-700 mb-3">Chamados Mensais</h3>
          <div className="h-64">
            <Bar 
              data={barData} 
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'top',
                  },
                }
              }}
            />
          </div>
        </div>
        
        {/* Pie Chart */}
        <div className="bg-white p-4 rounded-lg border border-gray-100">
          <h3 className="font-medium text-gray-700 mb-3">Status dos Chamados</h3>
          <div className="h-64">
            <Pie 
              data={pieData} 
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'right',
                    labels: {
                      boxWidth: 12,
                      font: {
                        size: 11
                      }
                    }
                  }
                }
              }}
            />
          </div>
        </div>
      </div>
      
      {/* Line Chart - full width */}
      <div className="bg-white p-4 rounded-lg border border-gray-100">
        <h3 className="font-medium text-gray-700 mb-3">Evolução da Resolutividade</h3>
        <div className="h-64">
          <Line 
            data={lineData} 
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'top',
                },
              },
            }}
          />
        </div>
      </div>
    </Card>
  );
};

export default DemoChartsSection;
