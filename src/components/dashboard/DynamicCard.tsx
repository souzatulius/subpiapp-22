
import React from 'react';
import { Card } from '@/components/ui/card';
import DynamicIcon from './DynamicIcon';
import SmartSearchCard from './cards/SmartSearchCard';
import OriginFormCard from './cards/OriginFormCard';

interface DynamicCardProps {
  title: string;
  dataSourceKey: string;
  iconComponent?: React.ReactNode;
  iconId?: string;
}

const DynamicCard: React.FC<DynamicCardProps> = ({ 
  title, 
  dataSourceKey,
  iconComponent,
  iconId
}) => {
  
  // Handle special card types based on dataSourceKey
  if (dataSourceKey === 'smartSearch') {
    return <SmartSearchCard placeholder={title} />;
  }
  
  if (dataSourceKey === 'form_origem') {
    return <OriginFormCard />;
  }
  
  // Default card rendering
  return (
    <Card className="w-full h-full flex flex-col justify-center items-center p-4">
      <div className="text-center">
        {iconComponent ? (
          iconComponent
        ) : iconId ? (
          <div className="mb-3">
            <DynamicIcon iconId={iconId} className="h-8 w-8 text-blue-600" />
          </div>
        ) : null}
        <h3 className="font-medium text-base">{title}</h3>
        <p className="text-gray-500 text-sm mt-2">
          {dataSourceKey}
        </p>
      </div>
    </Card>
  );
};

export default DynamicCard;
