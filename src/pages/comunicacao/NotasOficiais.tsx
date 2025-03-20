
import React, { useState } from 'react';
import Header from '@/components/layouts/Header';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CriarNotaForm from '@/components/dashboard/forms/CriarNotaForm';
import AprovarNotaForm from '@/components/dashboard/forms/AprovarNotaForm';

const NotasOficiais = () => {
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
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Notas Oficiais</h1>
            
            <Tabs defaultValue="listar" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="listar">Listar Notas</TabsTrigger>
                <TabsTrigger value="criar">Criar Nota Oficial</TabsTrigger>
                <TabsTrigger value="aprovar">Aprovar Notas</TabsTrigger>
              </TabsList>
              
              <TabsContent value="listar">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h2 className="text-xl font-semibold mb-4">Notas Oficiais Existentes</h2>
                  {/* Lista de notas existentes aqui */}
                </div>
              </TabsContent>
              
              <TabsContent value="criar">
                <CriarNotaForm 
                  onClose={() => setActiveTab('listar')}
                />
              </TabsContent>
              
              <TabsContent value="aprovar">
                <AprovarNotaForm
                  onClose={() => setActiveTab('listar')}
                />
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
};

export default NotasOficiais;
