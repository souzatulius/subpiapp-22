
import React from 'react';
import { usePositions } from '@/hooks/usePositions';
import { useProblemsData } from '@/hooks/useProblems';
import { useServices } from '@/hooks/services';
import { useCoordinationAreas } from '@/hooks/coordination-areas/useCoordinationAreas';
import { useDemandOrigins } from '@/hooks/useDemandOrigins';
import { useMediaTypes } from '@/hooks/useMediaTypes';
import WelcomeCard from './components/WelcomeCard';
import SettingsCategorySection from './components/SettingsCategorySection';
import EmptySearchState from './components/EmptySearchState';
import { 
  getSettingsCards, 
  filterCards, 
  groupCardsByCategory 
} from './utils/cardConfig';

interface SettingsDashboardProps {
  searchQuery?: string;
}

const SettingsDashboard: React.FC<SettingsDashboardProps> = ({ searchQuery = '' }) => {
  // Fetch counts from hooks
  const { positions, loading: positionsLoading } = usePositions();
  const { problems, isLoading: problemsLoading } = useProblemsData();
  const { services, loading: servicesLoading } = useServices();
  const { areas, coordinations, loading: areasLoading } = useCoordinationAreas();
  const { origins, loading: originsLoading } = useDemandOrigins();
  const { mediaTypes, loading: mediaTypesLoading } = useMediaTypes();
  
  // Get cards with current data
  const cards = getSettingsCards(
    positions?.length || 0,
    positionsLoading,
    problems?.length || 0,
    problemsLoading,
    services?.length || 0,
    servicesLoading,
    areas?.length || 0,
    coordinations?.length || 0,
    areasLoading,
    origins?.length || 0,
    originsLoading,
    mediaTypes?.length || 0,
    mediaTypesLoading
  );
  
  // Filter cards based on search
  const filteredCards = filterCards(cards, searchQuery);
  
  // Group cards by category
  const categorizedCards = groupCardsByCategory(filteredCards);
  
  if (filteredCards.length === 0 && searchQuery) {
    return <EmptySearchState searchQuery={searchQuery} />;
  }
  
  return (
    <div className="space-y-10">
      {/* Welcome Card */}
      <WelcomeCard userCount={42} unreadCount={5} />
      
      {/* Cards by Category */}
      {Object.entries(categorizedCards).map(([category, categoryCards]) => (
        <SettingsCategorySection 
          key={category} 
          category={category} 
          cards={categoryCards as any[]} 
        />
      ))}
    </div>
  );
};

export default SettingsDashboard;
