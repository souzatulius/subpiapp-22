
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ActionCardItem } from '@/hooks/dashboard/types';

interface OverdueDemandsProps {
  id: string;
  overdueCount: number;
  overdueItems: { title: string; id: string }[];
}

const OverdueDemandsCard: React.FC<OverdueDemandsProps> = ({ 
  id, 
  overdueCount,
  overdueItems
}) => {
  const navigate = useNavigate();

  const handleViewAll = () => {
    navigate('/dashboard/comunicacao/consultar');
  };

  return (
    <Card 
      className="cursor-pointer h-full bg-red-50 text-red-800 border border-red-200 
        rounded-xl shadow-md hover:shadow-xl overflow-hidden transform-gpu hover:scale-[1.03] transition-all duration-300"
    >
      <CardContent className="flex flex-col justify-between h-full p-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Demandas em Atraso</h3>
            <Clock className="h-5 w-5" />
          </div>
          
          <ul className="text-sm space-y-2">
            {overdueItems.map((item, index) => (
              <li key={index} className="truncate">• {item.title}</li>
            ))}
          </ul>
        </div>
        
        <div className="flex justify-between items-center mt-4 pt-2 border-t border-red-200">
          <span className="text-sm font-medium">Total: {overdueCount} em atraso</span>
          <button 
            onClick={handleViewAll}
            className="text-xs px-2 py-1 bg-red-100 hover:bg-red-200 text-red-800 rounded transition-colors"
          >
            Ver todas
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default OverdueDemandsCard;
