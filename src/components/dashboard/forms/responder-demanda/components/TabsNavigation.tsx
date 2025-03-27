
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface TabsNavigationProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  children?: React.ReactNode;
}

const TabsNavigation: React.FC<TabsNavigationProps> = ({ 
  activeTab, 
  onTabChange, 
  children 
}) => {
  return (
    <Tabs 
      defaultValue="details" 
      value={activeTab}
      onValueChange={onTabChange}
      className="w-full"
    >
      <TabsList className="grid grid-cols-2 w-full lg:w-auto mb-4 bg-gray-100">
        <TabsTrigger 
          value="details" 
          className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-subpi-blue transition-all duration-300"
        >
          Detalhes da Demanda
        </TabsTrigger>
        <TabsTrigger 
          value="comments" 
          className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-subpi-blue transition-all duration-300"
        >
          Comentários
        </TabsTrigger>
      </TabsList>
      
      {children}
    </Tabs>
  );
};

export default TabsNavigation;
