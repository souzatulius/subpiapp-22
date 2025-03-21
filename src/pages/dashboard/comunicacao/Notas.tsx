
import React, { useState } from 'react';
import Header from '@/components/layouts/Header';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import ActionCard from '@/components/dashboard/ActionCard';
import { Card, CardContent } from '@/components/ui/card';
import { 
  FileText, 
  FileCheck, 
  Search, 
  BookOpen,
  TrendingUp, 
  TrendingDown,
  BarChart2 
} from 'lucide-react';

const NotasDashboard: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Dados estatísticos das notas (simulados)
  const notasStats = [
    {
      title: 'Total de Notas',
      value: '1',
      change: '+12%',
      trend: 'up',
      description: 'em relação ao mês passado'
    },
    {
      title: 'Aguardando Aprovação',
      value: '1',
      change: '+4%',
      trend: 'up',
      description: 'em relação ao mês passado'
    },
    {
      title: 'Notas Recusadas',
      value: '5',
      change: '-15%',
      trend: 'down',
      description: 'em relação ao mês passado'
    },
    {
      title: 'Taxa de Aprovação',
      value: '100%',
      change: '+5%',
      trend: 'up',
      description: 'em relação ao mês passado'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header showControls={true} toggleSidebar={toggleSidebar} />
      
      <div className="flex flex-1 overflow-hidden">
        <DashboardSidebar isOpen={sidebarOpen} />
        
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Notas para Imprensa</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <ActionCard 
                title="Nova Nota" 
                icon={<FileText className="h-12 w-12" />} 
                onClick={() => window.location.href = '/dashboard/comunicacao/criar-nota'} 
                color="blue" 
              />
              
              <ActionCard 
                title="Aprovar Nota" 
                icon={<FileCheck className="h-12 w-12" />} 
                onClick={() => window.location.href = '/dashboard/comunicacao/aprovar-nota'} 
                color="green" 
              />
              
              <ActionCard 
                title="Consultar Notas" 
                icon={<BookOpen className="h-12 w-12" />} 
                onClick={() => window.location.href = '/dashboard/comunicacao/consultar-notas'} 
                color="orange" 
              />
              
              <ActionCard 
                title="Relatórios" 
                icon={<BarChart2 className="h-12 w-12" />} 
                onClick={() => window.location.href = '/dashboard/comunicacao/relatorios'} 
                color="purple" 
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {notasStats.map((stat, index) => (
                <Card key={index}>
                  <CardContent className="pt-6">
                    <div className="flex flex-col">
                      <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                      <div className="flex items-baseline justify-between">
                        <h3 className="text-2xl font-bold">{stat.value}</h3>
                        <div className={`flex items-center ${stat.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                          {stat.trend === 'up' ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
                          <span className="text-sm">{stat.change}</span>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default NotasDashboard;
