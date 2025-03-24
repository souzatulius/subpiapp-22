
import { ChartData } from 'chart.js';

// Function to generate dummy chart data for testing/preview purposes
export const generateDummyChartData = () => {
  // Sample data for status distribution chart
  const statusDistribution = {
    labels: ['NOVO', 'AB', 'PE', 'APROVADO', 'CONC', 'FECHADO'],
    datasets: [
      {
        label: 'Quantidade',
        data: [65, 59, 80, 81, 56, 55],
        backgroundColor: [
          'rgba(54, 162, 235, 0.5)',
          'rgba(153, 102, 255, 0.5)',
          'rgba(255, 206, 86, 0.5)',
          'rgba(75, 192, 192, 0.5)',
          'rgba(75, 192, 75, 0.5)',
          'rgba(201, 203, 207, 0.5)'
        ],
        borderColor: [
          'rgb(54, 162, 235)',
          'rgb(153, 102, 255)',
          'rgb(255, 206, 86)',
          'rgb(75, 192, 192)',
          'rgb(75, 192, 75)',
          'rgb(201, 203, 207)'
        ],
        borderWidth: 1
      }
    ]
  };

  // Sample data for average resolution time by status
  const averageTimeByStatus = {
    labels: ['NOVO', 'AB', 'PE', 'APROVADO', 'CONC', 'FECHADO'],
    datasets: [
      {
        label: 'Tempo Médio (dias)',
        data: [3, 5, 7, 10, 15, 20],
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        borderColor: 'rgb(255, 99, 132)',
        borderWidth: 1
      }
    ]
  };

  // Sample data for service types
  const serviceTypes = {
    labels: ['Tapa Buraco', 'Poda', 'Limpeza', 'Outros'],
    datasets: [
      {
        label: 'Quantidade',
        data: [120, 190, 85, 45],
        backgroundColor: [
          'rgba(255, 99, 132, 0.5)',
          'rgba(54, 162, 235, 0.5)',
          'rgba(255, 206, 86, 0.5)',
          'rgba(75, 192, 192, 0.5)'
        ],
        borderColor: [
          'rgb(255, 99, 132)',
          'rgb(54, 162, 235)',
          'rgb(255, 206, 86)',
          'rgb(75, 192, 192)'
        ],
        borderWidth: 1
      }
    ]
  };

  // Sample data for status timeline
  const statusTimeline = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'NOVO',
        data: [12, 19, 3, 5, 2, 3],
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgb(54, 162, 235)',
        borderWidth: 1
      },
      {
        label: 'CONC',
        data: [2, 3, 20, 5, 1, 4],
        backgroundColor: 'rgba(75, 192, 75, 0.5)',
        borderColor: 'rgb(75, 192, 75)',
        borderWidth: 1
      },
      {
        label: 'FECHADO',
        data: [3, 10, 13, 15, 22, 30],
        backgroundColor: 'rgba(201, 203, 207, 0.5)',
        borderColor: 'rgb(201, 203, 207)',
        borderWidth: 1
      }
    ]
  };

  // Return all dummy chart data
  return {
    statusDistribution,
    averageTimeByStatus,
    serviceTypes,
    statusTimeline
  };
};
