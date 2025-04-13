
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

export type ItemType = {
  id: string;
  title: string;
  status?: string;
  date?: string;
  path?: string;
};

interface DynamicContentCardProps {
  items: ItemType[];
  isLoading?: boolean;
  type: 'notes' | 'demands';
  className?: string;
  showHeader?: boolean;
}

// Helper function to get badge styling based on status
const getStatusBadge = (status: string | undefined) => {
  if (!status) return { color: 'bg-gray-200 text-gray-700', text: 'Sem status' };
  
  const statusLower = status.toLowerCase();
  
  if (statusLower.includes('aprova')) return { color: 'bg-green-100 text-green-800', text: status };
  if (statusLower.includes('pend')) return { color: 'bg-yellow-100 text-yellow-800', text: status };
  if (statusLower.includes('rejeit')) return { color: 'bg-red-100 text-red-800', text: status };
  if (statusLower.includes('andamento')) return { color: 'bg-blue-100 text-blue-700', text: status };
  
  // Default
  return { color: 'bg-gray-100 text-gray-800', text: status };
};

const DynamicContentCard: React.FC<DynamicContentCardProps> = ({
  items = [],
  isLoading = false,
  type,
  className = '',
  showHeader = true
}) => {
  const navigate = useNavigate();
  
  const handleItemClick = (item: ItemType) => {
    if (item.path) {
      navigate(item.path);
    } else {
      // Default paths based on type
      if (type === 'notes') {
        navigate(`/dashboard/comunicacao/notas/${item.id}`);
      } else if (type === 'demands') {
        navigate(`/dashboard/comunicacao/demandas/${item.id}`);
      }
    }
  };
  
  const getTitle = () => {
    if (type === 'notes') return 'Últimas Notas';
    if (type === 'demands') return 'Últimas Demandas';
    return 'Itens';
  };
  
  const getIcon = () => {
    if (type === 'notes') return <FileText className="h-5 w-5 text-orange-600" />;
    return null;
  };
  
  // Mock items for demonstration if no items provided
  const displayItems = items.length > 0 ? items : [
    {
      id: '1',
      title: type === 'notes' ? 'Nota sobre projeto municipal' : 'Demanda de entrevista',
      status: type === 'notes' ? 'Aprovada' : 'Em andamento',
      date: '2023-04-10',
    },
    {
      id: '2',
      title: type === 'notes' ? 'Nota técnica sobre obras' : 'Solicitação de dados',
      status: type === 'notes' ? 'Pendente' : 'Nova',
      date: '2023-04-09',
    },
    {
      id: '3',
      title: type === 'notes' ? 'Nota sobre programa social' : 'Esclarecimento sobre projeto',
      status: type === 'notes' ? 'Rejeitada' : 'Finalizada',
      date: '2023-04-08',
    }
  ];
  
  return (
    <Card className={cn("h-full flex flex-col", className)}>
      {showHeader && (
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <div className="flex items-center space-x-2">
            {getIcon()}
            <CardTitle className="text-lg">{getTitle()}</CardTitle>
          </div>
        </CardHeader>
      )}
      
      <CardContent className="flex-1 overflow-hidden">
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="animate-pulse flex flex-col space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-100 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : displayItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full py-8">
            <Clock className="h-12 w-12 text-gray-300 mb-3" />
            <p className="text-gray-500 text-sm text-center">
              {type === 'notes' ? 'Nenhuma nota disponível' : 'Nenhuma demanda disponível'}
            </p>
          </div>
        ) : (
          <div className="space-y-1">
            {displayItems.map((item) => {
              const badge = getStatusBadge(item.status);
              const formattedDate = item.date 
                ? new Date(item.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
                : '';
              
              return (
                <div
                  key={item.id}
                  onClick={() => handleItemClick(item)}
                  className="p-2 transition-all duration-200 hover:bg-gray-50 rounded-md cursor-pointer hover:translate-x-1 border-b border-gray-100 last:border-b-0"
                >
                  <div className="flex justify-between items-start gap-2">
                    <p className="text-sm font-medium line-clamp-2">{item.title}</p>
                    {item.status && (
                      <Badge variant="outline" className={cn("whitespace-nowrap text-xs", badge.color)}>
                        {badge.text}
                      </Badge>
                    )}
                  </div>
                  {formattedDate && (
                    <p className="text-xs text-gray-500 mt-1">{formattedDate}</p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DynamicContentCard;
