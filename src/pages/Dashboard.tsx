
import React, { useState } from 'react';
import Header from '@/components/layouts/Header';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import { ActionCard } from '@/components/dashboard/ActionCard';
import { ClipboardList, FileText, BarChart2, Users } from 'lucide-react';

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header - explicitly pass showControls={true} */}
      <Header showControls={true} toggleSidebar={toggleSidebar} />
      
      <div className="flex flex-1 overflow-hidden">
        <DashboardSidebar isOpen={sidebarOpen} />
        
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <ActionCard 
                title="Demandas da Imprensa" 
                icon={<ClipboardList className="h-6 w-6" />} 
                count={12} 
                description="Demandas abertas para resposta" 
                linkTo="/demandas" 
              />
              
              <ActionCard 
                title="Notas Oficiais" 
                icon={<FileText className="h-6 w-6" />} 
                count={5} 
                description="Notas aguardando aprovação" 
                linkTo="/notas-oficiais" 
              />
              
              <ActionCard 
                title="Relatórios" 
                icon={<BarChart2 className="h-6 w-6" />} 
                count={8} 
                description="Relatórios disponíveis" 
                linkTo="/relatorios" 
              />
              
              <ActionCard 
                title="Usuários" 
                icon={<Users className="h-6 w-6" />} 
                count={23} 
                description="Usuários ativos no sistema" 
                linkTo="/usuarios" 
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
