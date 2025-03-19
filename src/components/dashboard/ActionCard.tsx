
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface ActionCardProps {
  title: string;
  icon: string;
  onClick: () => void;
  color: 'blue' | 'green' | 'orange' | 'purple';
}

const ActionCard: React.FC<ActionCardProps> = ({ title, icon, onClick, color }) => {
  const getColorClasses = () => {
    switch (color) {
      case 'blue':
        return 'bg-blue-50 border-blue-200 hover:bg-blue-100';
      case 'green':
        return 'bg-green-50 border-green-200 hover:bg-green-100';
      case 'orange':
        return 'bg-orange-50 border-orange-200 hover:bg-orange-100';
      case 'purple':
        return 'bg-purple-50 border-purple-200 hover:bg-purple-100';
      default:
        return 'bg-gray-50 border-gray-200 hover:bg-gray-100';
    }
  };

  return (
    <Card 
      className={`cursor-pointer transition-all duration-200 border ${getColorClasses()} hover:shadow-md`}
      onClick={onClick}
    >
      <CardContent className="p-6 flex flex-col items-center text-center">
        <span className="text-4xl mb-4">{icon}</span>
        <h3 className="font-semibold text-[#003570]">{title}</h3>
      </CardContent>
    </Card>
  );
};

export default ActionCard;
