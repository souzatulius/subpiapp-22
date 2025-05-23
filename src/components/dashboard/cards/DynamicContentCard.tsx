
import React, { useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';

interface TimelineItemProps {
  id: string;
  title: string;
  description?: string;
  date: string; // Using string for date
  tag?: string;
  link?: string;
  coordenacao?: string;
}

interface DynamicContentCardProps {
  items: TimelineItemProps[];
  type: 'notes' | 'demands' | 'news';
  isLoading?: boolean;
}

const DynamicContentCard: React.FC<DynamicContentCardProps> = ({ 
  items = [], // Provide default empty array
  type, 
  isLoading = false 
}) => {
  if (isLoading) {
    return (
      <div className="animate-pulse flex flex-col space-y-4 p-4">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4 text-gray-500">
        <p>Nenhum item disponível</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex-1 overflow-y-auto px-4 py-2">
        <div className="space-y-3">
          {items.map((item) => (
            <ItemCard 
              key={item.id} 
              item={item} 
              type={type}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const ItemCard: React.FC<{ 
  item: TimelineItemProps, 
  type: 'notes' | 'demands' | 'news' 
}> = ({ item, type }) => {
  const navigate = useNavigate();
  
  // Use useMemo for the date formatting to ensure consistent hook usage
  const timeAgo = useMemo(() => {
    try {
      const date = new Date(item.date);
      // Check if date is valid
      if (!isNaN(date.getTime())) {
        return formatDistanceToNow(date, { addSuffix: true, locale: ptBR });
      }
      return "Data inválida";
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Data desconhecida";
    }
  }, [item.date]);
  
  // Handle navigation when clicking on an item
  const handleClick = () => {
    if (type === 'notes' && item.id) {
      navigate(`/notas/${item.id}`);
    } else if (item.link) {
      navigate(item.link);
    }
  };
  
  return (
    <Card 
      className="p-3 hover:bg-gray-50 transition-colors cursor-pointer" 
      onClick={handleClick}
    >
      <div className="flex flex-col space-y-1">
        <div className="flex justify-between items-start">
          <h4 className="font-medium text-gray-800 line-clamp-1">{item.title}</h4>
          <span className="text-xs text-gray-500">{timeAgo}</span>
        </div>
        
        {item.description && (
          <p className="text-sm text-gray-600 line-clamp-2">{item.description}</p>
        )}
        
        <div className="flex items-center justify-between pt-1">
          {type === 'demands' && item.coordenacao && (
            <span className="text-xs text-gray-600">{item.coordenacao}</span>
          )}
          
          {item.tag && (
            <span className="bg-white text-xs px-2 py-0.5 rounded-full border border-gray-200 text-gray-700">
              {item.tag}
            </span>
          )}
        </div>
      </div>
    </Card>
  );
};

export default DynamicContentCard;
