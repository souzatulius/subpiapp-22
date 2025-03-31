
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, FileText, Calendar, Clock } from 'lucide-react';

interface CardProps {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

const StatCard: React.FC<CardProps> = ({ title, value, description, icon, color }) => (
  <Card className="overflow-hidden">
    <CardHeader className={`${color} text-white p-4 flex flex-row items-center justify-between space-y-0 pb-2`}>
      <CardTitle className="text-md font-medium">{title}</CardTitle>
      <div className="rounded-md bg-white/20 p-1">{icon}</div>
    </CardHeader>
    <CardContent className="p-4 pt-3">
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-gray-500">{description}</p>
    </CardContent>
  </Card>
);

export const OverviewCards: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="Demandas Pendentes"
        value="24"
        description="Aguardando resposta"
        icon={<Activity className="h-4 w-4" />}
        color="bg-blue-600"
      />
      <StatCard
        title="Notas Oficiais"
        value="8"
        description="Publicadas este mês"
        icon={<FileText className="h-4 w-4" />}
        color="bg-orange-500"
      />
      <StatCard
        title="Eventos"
        value="3"
        description="Próximos 7 dias"
        icon={<Calendar className="h-4 w-4" />}
        color="bg-green-500"
      />
      <StatCard
        title="Tempo Médio"
        value="2.4 dias"
        description="Para resposta de demandas"
        icon={<Clock className="h-4 w-4" />}
        color="bg-purple-600"
      />
    </div>
  );
};

export default OverviewCards;
