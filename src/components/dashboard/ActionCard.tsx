
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

interface ActionCardProps {
  title: string;
  icon: React.ReactNode;
  onClick?: () => void;
  color: 'blue' | 'green' | 'orange' | 'purple' | 'red';
  path?: string;
}

const getColorClasses = (color: string) => {
  switch (color) {
    case 'blue':
      return 'bg-blue-50 text-blue-500 hover:bg-blue-100';
    case 'green':
      return 'bg-green-50 text-green-500 hover:bg-green-100';
    case 'orange':
      return 'bg-orange-50 text-orange-500 hover:bg-orange-100';
    case 'purple':
      return 'bg-purple-50 text-purple-500 hover:bg-purple-100';
    case 'red':
      return 'bg-red-50 text-red-500 hover:bg-red-100';
    default:
      return 'bg-blue-50 text-blue-500 hover:bg-blue-100';
  }
};

const ActionCard: React.FC<ActionCardProps> = ({
  title,
  icon,
  onClick,
  color,
  path
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (path) {
      navigate(path);
    } else if (onClick) {
      onClick();
    }
  };

  return (
    <Card 
      className={`cursor-pointer transition-all duration-200 border border-gray-200 hover:shadow-md ${getColorClasses(color)}`} 
      onClick={handleClick}
    >
      <CardContent className="flex flex-col items-center justify-center p-6 h-full">
        <div className="mb-4">
          {icon}
        </div>
        <h3 className="text-lg font-medium text-center">{title}</h3>
      </CardContent>
    </Card>
  );
};

export default ActionCard;
