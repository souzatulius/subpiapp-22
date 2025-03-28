
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  BarChart3, 
  TrendingUp, 
  Activity, 
  PieChart 
} from 'lucide-react';

interface ChartCategorySectionProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  categories: string[];
}

const ChartCategorySection: React.FC<ChartCategorySectionProps> = ({
  activeCategory,
  onCategoryChange,
  categories
}) => {
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
      {categories.map((category) => (
        <Button
          key={category}
          variant={activeCategory === category ? "default" : "outline"}
          size="sm"
          className={activeCategory === category 
            ? "bg-orange-600 hover:bg-orange-700" 
            : "text-orange-700 border-orange-200 hover:bg-orange-50"}
          onClick={() => onCategoryChange(category)}
        >
          {categoryIcons[category]}
          <span className="ml-1">{categoryLabels[category] || category}</span>
        </Button>
      ))}
    </div>
  );
};

export default ChartCategorySection;
