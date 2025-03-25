
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, Trash } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Skeleton } from '@/components/ui/skeleton';
import { Bar, Line, Pie, Radar, Doughnut } from 'react-chartjs-2';
import NoDataMessage from '../charts/NoDataMessage';

interface SGZChartProps {
  id: string;
  title: string;
  type: 'bar' | 'line' | 'pie' | 'radar' | 'doughnut';
  data: any;
  isLoading: boolean;
}

const SGZChart: React.FC<SGZChartProps> = ({ id, title, type, data, isLoading }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    touchAction: 'none',
  };

  const renderChart = () => {
    if (isLoading) {
      return <Skeleton className="h-[200px] w-full" />;
    }

    if (!data) {
      return <NoDataMessage />;
    }

    const options = {
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: type === 'pie' || type === 'doughnut' ? 'right' : 'top',
        },
      },
      scales: type !== 'pie' && type !== 'doughnut' && type !== 'radar' ? {
        y: {
          beginAtZero: true,
        },
      } : undefined,
    };

    switch (type) {
      case 'bar':
        return <Bar data={data} options={options} />;
      case 'line':
        return <Line data={data} options={options} />;
      case 'pie':
        return <Pie data={data} options={options} />;
      case 'radar':
        return <Radar data={data} options={options} />;
      case 'doughnut':
        return <Doughnut data={data} options={options} />;
      default:
        return <Bar data={data} options={options} />;
    }
  };

  return (
    <Card 
      ref={setNodeRef} 
      style={style} 
      className="hover:border-orange-300 transition-colors cursor-grab active:cursor-grabbing"
    >
      <CardHeader 
        className="flex flex-row items-center justify-between p-4 pb-2"
        {...attributes}
        {...listeners}
      >
        <CardTitle className="text-sm">{title}</CardTitle>
        {/* Botões de visibilidade e remoção - não implementados nesta versão */}
      </CardHeader>
      <CardContent className="p-4">
        <div className="h-[200px]">
          {renderChart()}
        </div>
      </CardContent>
    </Card>
  );
};

export default SGZChart;
