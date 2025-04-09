
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart3, MapPin, CalendarDays } from 'lucide-react';

interface RankingTabsProps {
  currentTab: string;
  onChange: (value: string) => void;
}

const RankingTabs: React.FC<RankingTabsProps> = ({ currentTab, onChange }) => {
  return (
    <Tabs defaultValue={currentTab || 'overview'} onValueChange={onChange} className="w-auto">
      <TabsList className="bg-gray-100 p-1">
        <TabsTrigger value="overview" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
          <BarChart3 className="mr-2 h-4 w-4" />
          <span className="hidden sm:inline">Visão Geral</span>
          <span className="sm:hidden">Geral</span>
        </TabsTrigger>
        <TabsTrigger value="districts" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
          <MapPin className="mr-2 h-4 w-4" />
          <span className="hidden sm:inline">Distritos</span>
          <span className="sm:hidden">Distritos</span>
        </TabsTrigger>
        <TabsTrigger value="timeline" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
          <CalendarDays className="mr-2 h-4 w-4" />
          <span className="hidden sm:inline">Cronologia</span>
          <span className="sm:hidden">Tempo</span>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default RankingTabs;
