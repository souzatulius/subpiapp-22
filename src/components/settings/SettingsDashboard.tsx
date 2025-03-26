
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import WelcomeCard from './components/WelcomeCard';
import UserServiceStats from './components/UserServiceStats';
import LocationCommunicationStats from './components/LocationCommunicationStats';
import SettingsCategorySection from './components/SettingsCategorySection';
import { useSettingsStats } from './hooks/useSettingsStats';
import { userManagementCards, organizationalCards, operationalCards } from './utils/cardConfig';
import { useAccessControlData } from './access-control/useAccessControlData';

interface SettingsDashboardProps {
  searchQuery: string;
}

const SettingsDashboard: React.FC<SettingsDashboardProps> = ({ searchQuery }) => {
  const navigate = useNavigate();
  const { stats, loading } = useSettingsStats();
  const { totalUsers } = useAccessControlData();
  const [filteredCards, setFilteredCards] = useState({
    userManagement: userManagementCards,
    organizational: organizationalCards,
    operational: operationalCards
  });

  // Filter cards based on search query
  useEffect(() => {
    if (!searchQuery) {
      setFilteredCards({
        userManagement: userManagementCards,
        organizational: organizationalCards,
        operational: operationalCards
      });
      return;
    }

    const query = searchQuery.toLowerCase();
    setFilteredCards({
      userManagement: userManagementCards.filter(card => 
        card.title.toLowerCase().includes(query) || card.description.toLowerCase().includes(query)
      ),
      organizational: organizationalCards.filter(card => 
        card.title.toLowerCase().includes(query) || card.description.toLowerCase().includes(query)
      ),
      operational: operationalCards.filter(card => 
        card.title.toLowerCase().includes(query) || card.description.toLowerCase().includes(query)
      )
    });
  }, [searchQuery]);

  const handleCardClick = (section: string) => {
    navigate(`/settings?tab=${section}`);
  };

  return (
    <div className="space-y-6">
      <WelcomeCard userCount={totalUsers} />
      
      <div className="space-y-8">
        <div>
          <h3 className="text-lg font-medium mb-4">Estatísticas do Sistema</h3>
          <UserServiceStats stats={stats} loading={loading} />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <LocationCommunicationStats />
        </div>
        
        {/* Categorias de configuração */}
        {(filteredCards.userManagement.length > 0) && (
          <SettingsCategorySection 
            title="Gestão de Usuários e Permissões" 
            cards={filteredCards.userManagement} 
            onCardClick={handleCardClick}
          />
        )}
        
        {(filteredCards.organizational.length > 0) && (
          <SettingsCategorySection 
            title="Gestão Organizacional" 
            cards={filteredCards.organizational} 
            onCardClick={handleCardClick}
          />
        )}
        
        {(filteredCards.operational.length > 0) && (
          <SettingsCategorySection 
            title="Gestão Operacional" 
            cards={filteredCards.operational} 
            onCardClick={handleCardClick}
          />
        )}
      </div>
    </div>
  );
};

export default SettingsDashboard;
