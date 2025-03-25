
import React from 'react';
import { ChartVisibility } from './types';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface ChartCategorySectionProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  chartVisibility: ChartVisibility;
  onChartVisibilityToggle: (chart: keyof ChartVisibility) => void;
  charts: Array<{
    id: keyof ChartVisibility;
    label: string;
  }>;
}

const ChartCategorySection: React.FC<ChartCategorySectionProps> = ({
  title,
  description,
  icon,
  color,
  chartVisibility,
  onChartVisibilityToggle,
  charts
}) => {
  const allVisible = charts.every(chart => chartVisibility[chart.id]);
  const someVisible = charts.some(chart => chartVisibility[chart.id]);
  
  const toggleAll = () => {
    // If all are visible, hide all. If some or none are visible, show all
    const newValue = !allVisible;
    charts.forEach(chart => {
      if (chartVisibility[chart.id] !== newValue) {
        onChartVisibilityToggle(chart.id);
      }
    });
  };

  return (
    <Card className="border border-gray-200 shadow-sm hover:shadow transition-all duration-300">
      <CardHeader className={`border-b ${color}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {icon}
            <CardTitle className="text-lg font-medium">{title}</CardTitle>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="p-1 h-auto"
            onClick={toggleAll}
            title={allVisible ? "Ocultar todos" : "Mostrar todos"}
          >
            {allVisible ? <EyeOff size={16} /> : <Eye size={16} />}
          </Button>
        </div>
        <p className="text-sm text-gray-600 mt-1">{description}</p>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="flex flex-wrap gap-2">
          {charts.map(chart => (
            <Badge
              key={chart.id}
              variant={chartVisibility[chart.id] ? "default" : "outline"}
              className={`cursor-pointer px-3 py-1.5 ${
                chartVisibility[chart.id] 
                  ? `bg-orange-100 text-orange-800 hover:bg-orange-200 border border-orange-200` 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200'
              }`}
              onClick={() => onChartVisibilityToggle(chart.id)}
            >
              <div className="flex items-center gap-1.5">
                {chartVisibility[chart.id] ? (
                  <Eye size={14} className="text-orange-600" />
                ) : (
                  <EyeOff size={14} className="text-gray-500" />
                )}
                <span>{chart.label}</span>
              </div>
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ChartCategorySection;
