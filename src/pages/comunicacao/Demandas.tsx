
import React, { useState } from 'react';
import Header from '@/components/layouts/Header';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Layout as DemandasLayout } from '@/components/demandas';
import CadastrarDemandaForm from '@/components/dashboard/forms/CadastrarDemandaForm';

const Demandas = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('listar');

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header showControls={true} toggleSidebar={toggleSidebar} />
      
      <div className="flex flex-1 overflow-hidden">
        <DashboardSidebar isOpen={sidebarOpen} />
        
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Gerenciar Demandas</h1>
            
            <Tabs defaultValue="listar" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="listar">Listar Demandas</TabsTrigger>
                <TabsTrigger value="cadastrar">Cadastrar Demanda</TabsTrigger>
                <TabsTrigger value="responder">Responder Demandas</TabsTrigger>
              </TabsList>
              
              <TabsContent value="listar">
                <DemandasLayout mode="view" />
              </TabsContent>
              
              <TabsContent value="cadastrar">
                <CadastrarDemandaForm 
                  onClose={() => setActiveTab('listar')}
                />
              </TabsContent>
              
              <TabsContent value="responder">
                <DemandasLayout mode="respond" />
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Demandas;
