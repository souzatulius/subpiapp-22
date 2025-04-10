
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Legend,
  Tooltip,
} from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, Legend, Tooltip);

const DemandasChart = () => {
  const dias = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex'];

  const data = {
    labels: dias,
    datasets: [
      {
        label: 'CPO',
        data: [2, 1, 0, 4, 2],
        backgroundColor: '#66B3FF', // azul claro
      },
      {
        label: 'CPDU',
        data: [1, 3, 2, 4, 1],
        backgroundColor: '#007BFF', // azul
      },
      {
        label: 'Jurídico',
        data: [1, 0, 0, 0, 1],
        backgroundColor: '#0E1B4D', // azul marinho
      },
      {
        label: 'Gabinete',
        data: [1, 1, 0, 0, 1],
        backgroundColor: '#FF7F2A', // laranja
      },
      {
        label: 'Notas (Comunicação)',
        data: [5, 5, 2, 8, 5],
        backgroundColor: '#00FF00', // verde
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          boxWidth: 20,
        },
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0,
        },
      },
    },
  };

  return <Bar data={data} options={options} />;
};

export default DemandasChart;
