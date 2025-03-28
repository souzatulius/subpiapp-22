
import React, { useState } from 'react';
import { Settings } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import StatCard from './StatCard';

interface WelcomeCardProps {
  userCount?: number;
  unreadCount?: number;
}

const WelcomeCard: React.FC<WelcomeCardProps> = ({ userCount, unreadCount = 0 }) => {
  const [searchQuery, setSearchQuery] = useState("");
  
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // You could implement searching functionality here
    console.log("Searching for:", query);
  };
  
  return (
    <Card className="bg-gradient-to-r from-blue-500 to-blue-700 text-white shadow-lg overflow-hidden">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold mb-2 flex items-center">
              <Settings className="h-6 w-6 mr-2" />
              Central de Configurações
            </h2>
            <p className="text-blue-100">
              Gerencie todas as configurações do sistema em um só lugar.
            </p>
          </div>
          <div className="flex space-x-4 w-full md:w-64">
            <StatCard 
              showSearch={true}
              onSearch={handleSearch}
              searchPlaceholder="Buscar configurações..."
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WelcomeCard;
