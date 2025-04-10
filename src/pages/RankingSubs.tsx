
import React, { useState, useEffect } from 'react';
import Header from '@/components/layouts/Header';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import BreadcrumbBar from '@/components/layouts/BreadcrumbBar';
import { useIsMobile } from '@/hooks/use-mobile';
import MobileBottomNav from '@/components/layouts/MobileBottomNav';
import { useScrollFade } from '@/hooks/useScrollFade';
import { barChartColors, pieChartColors, lineChartColors } from '@/components/ranking/utils/chartColors';
import { 
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

// Sample data generators
const generateBarData = () => {
  return {
    labels: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio'],
    datasets: [
      {
        label: 'Subsídios Aprovados',
        data: [65, 59, 80, 81, 56],
        backgroundColor: barChartColors[0],
      },
      {
        label: 'Subsídios Pendentes',
        data: [28, 48, 40, 19, 86],
        backgroundColor: barChartColors[1],
      },
    ],
  };
};

const generatePieData = () => {
  return {
    labels: ['Concluído', 'Pendente', 'Em Andamento', 'Cancelado', 'Em Revisão'],
    datasets: [
      {
        data: [45, 25, 20, 5, 5],
        backgroundColor: pieChartColors,
        borderWidth: 1,
        borderColor: '#fff'
      },
    ],
  };
};

const generateLineData = () => {
  return {
    labels: ['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4', 'Semana 5'],
    datasets: [
      {
        label: 'Subprefeitura A',
        data: [12, 19, 3, 5, 2],
        borderColor: lineChartColors[0],
        backgroundColor: `${lineChartColors[0]}33`,
        tension: 0.4,
      },
      {
        label: 'Subprefeitura B',
        data: [3, 10, 13, 15, 22],
        borderColor: lineChartColors[1],
        backgroundColor: `${lineChartColors[1]}33`,
        tension: 0.4,
      },
    ],
  };
};

const RankingSubs = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useIsMobile();
  const scrollFadeStyles = useScrollFade({ threshold: 10, fadeDistance: 80 });
  const [barData, setBarData] = useState(generateBarData());
  const [pieData, setPieData] = useState(generatePieData());
  const [lineData, setLineData] = useState(generateLineData());

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex flex-col h-screen bg-[#FFFAFA]">
      {/* Header */}
      <div className="flex-shrink-0">
        <Header showControls={true} toggleSidebar={toggleSidebar} />
        
        {/* Mobile breadcrumb directly below header */}
        {isMobile && (
          <div className="bg-white">
            <BreadcrumbBar />
          </div>
        )}
      </div>
      
      <div className="flex flex-1 overflow-hidden">
        {!isMobile && (
          <div className="h-full flex-shrink-0">
            <DashboardSidebar isOpen={sidebarOpen} />
          </div>
        )}
        
        <main className="flex-1 flex flex-col overflow-auto">
          {/* Desktop breadcrumb */}
          {!isMobile && <BreadcrumbBar className="flex-shrink-0" />}
          
          <div className="flex-1 max-w-full mx-auto w-full overflow-y-auto">
            <div className={`p-4 ${isMobile ? 'pb-32' : ''}`}>
              <div className="transition-all duration-300">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">Ranking das Subs</h1>
              </div>
              
              {/* Chart containers */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Bar Chart */}
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                  <h2 className="font-semibold mb-4 text-gray-800">Subsídios por Mês</h2>
                  <div className="h-64">
                    <Bar data={barData} 
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
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                  <h2 className="font-semibold mb-4 text-gray-800">Distribuição de Status</h2>
                  <div className="h-64">
                    <Pie data={pieData} 
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
                
                {/* Line Chart */}
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                  <h2 className="font-semibold mb-4 text-gray-800">Evolução Semanal</h2>
                  <div className="h-64">
                    <Line data={lineData} 
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            position: 'top',
                          }
                        }
                      }}
                    />
                  </div>
                </div>
                
                {/* Additional Stats Cards */}
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                  <h2 className="font-semibold mb-4 text-gray-800">Taxa de Resolução</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-600">Subprefeitura A</p>
                      <p className="text-2xl font-bold" style={{ color: barChartColors[0] }}>78%</p>
                    </div>
                    <div className="bg-orange-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-600">Subprefeitura B</p>
                      <p className="text-2xl font-bold" style={{ color: barChartColors[1] }}>65%</p>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-600">Subprefeitura C</p>
                      <p className="text-2xl font-bold" style={{ color: barChartColors[2] }}>91%</p>
                    </div>
                    <div className="bg-orange-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-600">Subprefeitura D</p>
                      <p className="text-2xl font-bold" style={{ color: barChartColors[3] }}>54%</p>
                    </div>
                  </div>
                </div>
                
                {/* Horizontal Bar Chart */}
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                  <h2 className="font-semibold mb-4 text-gray-800">Top 5 Subprefeituras</h2>
                  <div className="h-64">
                    <Bar data={{
                        labels: ['Pinheiros', 'Santo Amaro', 'Lapa', 'Sé', 'Vila Mariana'],
                        datasets: [
                          {
                            label: 'Pontuação',
                            data: [95, 89, 87, 82, 80],
                            backgroundColor: barChartColors[0],
                          }
                        ],
                      }}
                      options={{
                        indexAxis: 'y',
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            display: false,
                          }
                        }
                      }}
                    />
                  </div>
                </div>
                
                {/* Comparison Bar Chart */}
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                  <h2 className="font-semibold mb-4 text-gray-800">Comparativo Mensal</h2>
                  <div className="h-64">
                    <Bar data={{
                        labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai'],
                        datasets: [
                          {
                            label: '2023',
                            data: [65, 59, 80, 81, 56],
                            backgroundColor: barChartColors[2],
                          },
                          {
                            label: '2024',
                            data: [28, 48, 40, 19, 86],
                            backgroundColor: barChartColors[0],
                          }
                        ],
                      }}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            position: 'top',
                          }
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
      
      {isMobile && <MobileBottomNav className="flex-shrink-0" />}
    </div>
  );
};

export default RankingSubs;
