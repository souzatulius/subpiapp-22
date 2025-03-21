
import React from 'react';
import ActionCard from '@/components/dashboard/ActionCard';
import { Card, CardContent } from '@/components/ui/card';
import { 
  ClipboardList, 
  MessageSquareReply, 
  FileCheck, 
  BarChart2, 
  TrendingUp, 
  TrendingDown,
  Search 
} from 'lucide-react';

const ComunicacaoDashboard: React.FC = () => {
  // Dados estatísticos das demandas (simulados)
  const comunicacaoStats = [
    {
      title: 'Total de Demandas',
      value: '1',
      change: '+12%',
      trend: 'up',
      description: 'em relação ao mês passado'
    },
    {
      title: 'Aguardando Respostas',
      value: '1',
      change: '+4%',
      trend: 'up',
      description: 'em relação ao mês passado'
    },
    {
      title: 'Tempo Médio de Resposta',
      value: '2.5 dias',
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
    <div className="max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Comunicação</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <ActionCard 
          title="Nova Demanda" 
          icon={<ClipboardList className="h-12 w-12" />} 
          path="/dashboard/comunicacao/cadastrar" 
          color="blue" 
        />
        
        <ActionCard 
          title="Responder Demandas" 
          icon={<MessageSquareReply className="h-12 w-12" />} 
          path="/dashboard/comunicacao/responder" 
          color="green" 
        />
        
        <ActionCard 
          title="Consultar Demandas" 
          icon={<Search className="h-12 w-12" />} 
          path="/dashboard/comunicacao/consultar-demandas" 
          color="orange" 
        />
        
        <ActionCard 
          title="Relatórios" 
          icon={<BarChart2 className="h-12 w-12" />} 
          path="/dashboard/comunicacao/relatorios" 
          color="purple" 
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {comunicacaoStats.map((stat, index) => (
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
  );
};

export default ComunicacaoDashboard;
