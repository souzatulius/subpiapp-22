
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '@/hooks/useSupabaseAuth';
import UsersManagement from '@/components/settings/UsersManagement';
import CoordinationAreas from '@/components/settings/CoordinationAreas';
import Positions from '@/components/settings/Positions';
import Services from '@/components/settings/Services';
import MediaTypes from '@/components/settings/MediaTypes';
import DemandOrigins from '@/components/settings/DemandOrigins';
import DistrictsAndNeighborhoods from '@/components/settings/DistrictsAndNeighborhoods';
import Announcements from '@/components/settings/Announcements';
import Notifications from '@/components/settings/Notifications';
import AccessControl from '@/components/settings/AccessControl';
import SettingsDashboard from '@/components/settings/SettingsDashboard';

const Settings = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => navigate('/dashboard')}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-bold text-subpi-gray-text">Ajustes da Plataforma</h1>
          </div>
        </div>

        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab} 
          className="bg-white rounded-lg shadow-sm"
        >
          <div className="p-4 border-b overflow-x-auto">
            <TabsList className="h-10 bg-gray-100">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="users">Usuários</TabsTrigger>
              <TabsTrigger value="access">Controle de Acesso</TabsTrigger>
              <TabsTrigger value="areas">Áreas de Coordenação</TabsTrigger>
              <TabsTrigger value="positions">Cargos</TabsTrigger>
              <TabsTrigger value="services">Serviços</TabsTrigger>
              <TabsTrigger value="media">Tipos de Mídia</TabsTrigger>
              <TabsTrigger value="origins">Origens de Demandas</TabsTrigger>
              <TabsTrigger value="districts">Distritos e Bairros</TabsTrigger>
              <TabsTrigger value="announcements">Comunicados</TabsTrigger>
              <TabsTrigger value="notifications">Notificações</TabsTrigger>
            </TabsList>
          </div>

          <div className="p-6">
            <TabsContent value="dashboard" className="mt-0">
              <SettingsDashboard />
            </TabsContent>
            
            <TabsContent value="users" className="mt-0">
              <UsersManagement />
            </TabsContent>
            
            <TabsContent value="access" className="mt-0">
              <AccessControl />
            </TabsContent>
            
            <TabsContent value="areas" className="mt-0">
              <CoordinationAreas />
            </TabsContent>
            
            <TabsContent value="positions" className="mt-0">
              <Positions />
            </TabsContent>
            
            <TabsContent value="services" className="mt-0">
              <Services />
            </TabsContent>
            
            <TabsContent value="media" className="mt-0">
              <MediaTypes />
            </TabsContent>
            
            <TabsContent value="origins" className="mt-0">
              <DemandOrigins />
            </TabsContent>
            
            <TabsContent value="districts" className="mt-0">
              <DistrictsAndNeighborhoods />
            </TabsContent>
            
            <TabsContent value="announcements" className="mt-0">
              <Announcements />
            </TabsContent>
            
            <TabsContent value="notifications" className="mt-0">
              <Notifications />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default Settings;
