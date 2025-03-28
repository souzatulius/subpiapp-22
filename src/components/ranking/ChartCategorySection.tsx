
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  BarChart3, 
  TrendingUp, 
  Activity, 
  PieChart 
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { ChartVisibility } from './types';

interface ChartCategorySectionProps {
  activeCategory?: string;
  onCategoryChange?: (category: string) => void;
  categories?: string[];
  // Added props for chart category cards
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  color?: string;
  chartVisibility?: ChartVisibility;
  onChartVisibilityToggle?: (chartId: keyof ChartVisibility) => void;
  charts?: { id: keyof ChartVisibility; label: string }[];
}

const ChartCategorySection: React.FC<ChartCategorySectionProps> = ({
  activeCategory,
  onCategoryChange,
  categories,
  // Chart category card props
  title,
  description,
  icon,
  color = "border-orange-200",
  chartVisibility,
  onChartVisibilityToggle,
  charts
}) => {
  // If we have chart props, render chart category card
  if (title && charts && chartVisibility && onChartVisibilityToggle) {
    return (
      <Card className={`border ${color}`}>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium flex items-center gap-2">
            {icon}
            {title}
          </CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {charts.map((chart) => (
              <div key={chart.id} className="flex items-center justify-between">
                <span className="text-sm">{chart.label}</span>
                <Switch 
                  checked={chartVisibility[chart.id]}
                  onCheckedChange={() => onChartVisibilityToggle(chart.id)}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Original implementation for category buttons
  const categoryIcons: Record<string, React.ReactNode> = {
    all: <BarChart3 className="h-4 w-4" />,
    trends: <TrendingUp className="h-4 w-4" />,
    performance: <Activity className="h-4 w-4" />,
    distribution: <PieChart className="h-4 w-4" />
  };

  const categoryLabels: Record<string, string> = {
    all: 'Todos os Gráficos',
    trends: 'Tendências',
    performance: 'Performance',
    distribution: 'Distribuição'
  };

  return (
    <div className="flex flex-wrap gap-2">
      {categories?.map((category) => (
        <Button
          key={category}
          variant={activeCategory === category ? "default" : "outline"}
          size="sm"
          className={activeCategory === category 
            ? "bg-orange-600 hover:bg-orange-700" 
            : "text-orange-700 border-orange-200 hover:bg-orange-50"}
          onClick={() => onCategoryChange?.(category)}
        >
          {categoryIcons[category]}
          <span className="ml-1">{categoryLabels[category] || category}</span>
        </Button>
      ))}
    </div>
  );
};

export default ChartCategorySection;
