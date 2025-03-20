
import React, { useState } from 'react';
import Header from '@/components/layouts/Header';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import { DemandList } from '@/components/demandas';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter } from 'lucide-react';

const ConsultarDemandas = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  // State for selected demand and mock data
  const [selectedDemand, setSelectedDemand] = useState(null);

  // Mock data for demandas
  const mockDemandas = [];

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Handler for when a demand is selected
  const handleSelectDemand = (demand) => {
    setSelectedDemand(demand);
    // Additional logic for handling selected demand can be added here
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header showControls={true} toggleSidebar={toggleSidebar} />
      
      <div className="flex flex-1 overflow-hidden">
        <DashboardSidebar isOpen={sidebarOpen} />
        
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Consultar Demandas</h1>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">Lista de Demandas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                      type="search"
                      placeholder="Buscar demandas..."
                      className="pl-9"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Button variant="outline" className="md:w-auto flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    Filtros
                  </Button>
                </div>
                
                <DemandList 
                  demandas={mockDemandas} 
                  isLoading={false} 
                  onSelectDemand={handleSelectDemand} 
                />
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ConsultarDemandas;
