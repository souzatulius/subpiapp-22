import React, { useState } from 'react';
import Header from '@/components/layouts/Header';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import ActionCard from '@/components/dashboard/ActionCard';
import { ClipboardList, FileText, BarChart2, Users } from 'lucide-react';
const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  return <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header - explicitly pass showControls={true} */}
      <Header showControls={true} toggleSidebar={toggleSidebar} />
      
      <div className="flex flex-1 overflow-hidden">
        <DashboardSidebar isOpen={sidebarOpen} />
        
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <ActionCard title="Demandas da Imprensa" icon={<ClipboardList className="h-12 w-12 bg-transparent text-[#f57c35]" />} onClick={() => window.location.href = '/demandas'} color="blue" className="" />
              
              <ActionCard title="Notas Oficiais" icon={<FileText className="h-6 w-6" />} onClick={() => window.location.href = '/notas-oficiais'} color="green" className="w-12 h-12" />
              
              <ActionCard title="Relatórios" icon={<BarChart2 className="h-6 w-6" />} onClick={() => window.location.href = '/relatorios'} color="orange" className="w-12 h-12" />
              
              <ActionCard title="Usuários" icon={<Users className="h-6 w-6" />} onClick={() => window.location.href = '/usuarios'} color="purple" className="w-12 h-12" />
            </div>
          </div>
        </main>
      </div>
    </div>;
};
export default Dashboard;