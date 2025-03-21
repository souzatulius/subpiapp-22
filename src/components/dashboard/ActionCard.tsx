import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
interface ActionCardProps {
  title: string;
  icon: string | React.ReactNode;
  onClick: () => void;
  color: 'blue' | 'green' | 'orange' | 'purple' | 'dark-blue';
  iconSize?: 'normal' | 'large' | 'giant';
  className?: string;
}
const ActionCard: React.FC<ActionCardProps> = ({
  title,
  icon,
  onClick,
  color,
  iconSize = 'normal',
  className = ''
}) => {
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
      case 'dark-blue':
        return 'bg-[#003570] border-[#002855] hover:bg-[#002855] text-white';
      default:
        return 'bg-gray-50 border-gray-200 hover:bg-gray-100';
    }
  };
  const getIconSizeClasses = () => {
    switch (iconSize) {
      case 'giant':
        return 'text-6xl mb-6';
      case 'large':
        return 'text-5xl mb-5';
      case 'normal':
      default:
        return 'text-4xl mb-4';
    }
  };
  const renderIcon = () => {
    if (typeof icon === 'string') {
      return <span className={getIconSizeClasses()}>{icon}</span>;
    }

    // If it's a React component (like a Lucide icon)
    return <div className={`${getIconSizeClasses()} flex justify-center items-center`}>
        {icon}
      </div>;
  };
  return <Card onClick={onClick} className="cursor-pointer rounded-2xl">
      <CardContent className="p-6 flex flex-col items-center justify-center text-center bg-orange-500 rounded-2xl">
        <div className="mb-2 p-3 rounded-full bg-transparent">
          {renderIcon()}
        </div>
        <h3 className="text-lg font-semibold">
          {title}
        </h3>
      </CardContent>
    </Card>;
};
export default ActionCard;