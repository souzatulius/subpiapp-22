
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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
  const hasOverdueItems = overdueCount > 0;

  const handleViewAll = () => {
    navigate('/dashboard/comunicacao/consultar');
  };

  const handleItemClick = (itemId: string) => {
    navigate(`/dashboard/comunicacao/consultar?id=${itemId}`);
  };

  return (
    <Card 
      className={`cursor-pointer h-full ${hasOverdueItems 
        ? 'bg-red-50 text-red-800 border border-red-200' 
        : 'bg-green-50 text-green-800 border border-green-200'} 
        rounded-xl shadow-md hover:shadow-xl overflow-hidden transform-gpu hover:scale-[1.03] transition-all duration-300`}
    >
      <CardContent className="flex flex-col justify-between h-full p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">
            {hasOverdueItems ? 'Demandas em Atraso' : 'Você está com tudo em dia'}
          </h3>
          {hasOverdueItems 
            ? <Clock className="h-5 w-5" /> 
            : <CheckCircle className="h-5 w-5" />
          }
        </div>
        
        <div className="space-y-2 mt-2">
          {hasOverdueItems ? (
            <ul className="text-sm space-y-2">
              {overdueItems.map((item, index) => (
                <li 
                  key={index} 
                  className="truncate cursor-pointer hover:underline" 
                  onClick={() => handleItemClick(item.id)}
                >
                  • {item.title}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm">Não existem demandas em atraso no momento.</p>
          )}
        </div>
        
        {hasOverdueItems && (
          <div className="flex justify-between items-center mt-4 pt-2 border-t border-red-200">
            <span className="text-sm font-medium">Total: {overdueCount} em atraso</span>
            <button 
              onClick={handleViewAll}
              className="text-xs px-2 py-1 bg-red-100 hover:bg-red-200 text-red-800 rounded transition-colors"
            >
              Ver todas
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OverdueDemandsCard;
