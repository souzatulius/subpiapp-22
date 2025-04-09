
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { OriginOption } from '@/types/dashboard';

interface OriginSelectionCardProps {
  title: string;
  options: OriginOption[];
}

const OriginSelectionCard: React.FC<OriginSelectionCardProps> = ({ title, options }) => {
  const navigate = useNavigate();
  
  const handleOriginSelect = (originId: string) => {
    navigate(`/dashboard/comunicacao/cadastrar?origem_id=${originId}`);
  };
  
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="text-lg text-blue-700">{title}</CardTitle>
      </CardHeader>
      
      <CardContent className="flex-grow flex flex-col justify-center">
        <p className="text-lg font-medium mb-4 text-gray-700">De onde vem esta demanda?</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {options.map((option) => (
            <button
              key={option.id}
              onClick={() => handleOriginSelect(option.id)}
              className="p-3 bg-white hover:bg-blue-50 border border-gray-200 rounded-md text-center transition-colors flex flex-col items-center justify-center h-24"
            >
              <div className="text-2xl mb-2">
                {typeof option.icon === 'string' ? option.icon : option.icon}
              </div>
              <span className="text-sm font-medium text-gray-800">{option.title}</span>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default OriginSelectionCard;
