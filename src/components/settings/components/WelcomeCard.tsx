
import React, { useState } from 'react';
import { Settings, LayoutDashboard } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import StatCard from './StatCard';
import { useNavigate } from 'react-router-dom';

interface WelcomeCardProps {
  userCount?: number;
  unreadCount?: number;
}

const WelcomeCard: React.FC<WelcomeCardProps> = ({ userCount, unreadCount = 0 }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // You could implement searching functionality here
    console.log("Searching for:", query);
  };

  const handleManageDashboards = () => {
    navigate('/settings/dashboard-management');
  };
  
  return (
    <Card className="bg-gradient-to-r from-orange-500 to-orange-700 text-white shadow-lg overflow-hidden">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold mb-2 flex items-center">
              <Settings className="h-6 w-6 mr-2" />
              Central de Configurações
            </h2>
            <p className="text-orange-100">
              Gerencie todas as configurações do sistema em um só lugar.
            </p>
          </div>
          <div className="flex space-x-4 w-full md:w-auto">
            <StatCard 
              showSearch={true}
              onSearch={handleSearch}
              searchPlaceholder="Buscar configurações..."
            />
            <StatCard
              showButton={true}
              buttonText="Gerenciar Dashboards"
              buttonIcon={<LayoutDashboard className="h-4 w-4" />}
              buttonVariant="secondary"
              onButtonClick={handleManageDashboards}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WelcomeCard;
