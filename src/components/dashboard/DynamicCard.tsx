
import React from 'react';
import { CardColor, CardType } from '@/types/dashboard';
import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';
import KPICard from '@/components/settings/dashboard-management/KPICard';
import DynamicListCard from '@/components/settings/dashboard-management/DynamicListCard';
import SmartSearchCard from '@/components/dashboard/cards/SmartSearchCard';
import { useDynamicCardsData } from '@/hooks/dashboard/useDynamicCardsData';

interface DynamicCardProps {
  title: string;
  dataSourceKey: string;
  department?: string;
  iconComponent?: React.ReactNode;
}

const DynamicCard: React.FC<DynamicCardProps> = ({
  title,
  dataSourceKey,
  department = 'comunicacao',
  iconComponent
}) => {
  const dynamicData = useDynamicCardsData(department);
  
  // Render search card
  if (dataSourceKey === 'smartSearch') {
    return <SmartSearchCard placeholder="O que vamos fazer?" />;
  }
  
  // Render KPI cards
  if (dataSourceKey === 'kpi_solicitacoes') {
    return (
      <KPICard 
        title="Solicitações de imprensa"
        value={dynamicData.kpis.pressRequests.today || 0}
        previousValue={dynamicData.kpis.pressRequests.yesterday}
        percentageChange={dynamicData.kpis.pressRequests.percentageChange}
        loading={dynamicData.kpis.pressRequests.loading}
        variant={dynamicData.kpis.pressRequests.percentageChange > 0 ? "success" : "default"}
      />
    );
  }
  
  if (dataSourceKey === 'kpi_demandas_aprovacao') {
    return (
      <KPICard 
        title="Demandas em aprovação"
        value={dynamicData.kpis.pendingApproval.total || 0}
        secondaryValue={dynamicData.kpis.pendingApproval.awaitingResponse}
        secondaryLabel="aguardando resposta"
        loading={dynamicData.kpis.pendingApproval.loading}
        variant="warning"
      />
    );
  }
  
  if (dataSourceKey === 'kpi_notas_produzidas') {
    return (
      <KPICard 
        title="Notas produzidas"
        value={dynamicData.kpis.notesProduced.total || 0}
        secondaryValue={dynamicData.kpis.notesProduced.approved}
        secondaryLabel={`aprovadas | ${dynamicData.kpis.notesProduced.rejected} recusadas`}
        loading={dynamicData.kpis.notesProduced.loading}
        variant="success"
      />
    );
  }
  
  // Render list cards
  if (dataSourceKey === 'demandas_andamento') {
    return (
      <DynamicListCard 
        title="Demandas em andamento"
        items={dynamicData.lists.recentDemands.items}
        loading={dynamicData.lists.recentDemands.loading}
        emptyMessage="Nenhuma demanda em andamento"
        viewAllPath="/dashboard/comunicacao/demandas"
        viewAllLabel="Ver todas as demandas"
      />
    );
  }
  
  if (dataSourceKey === 'demandas_aguardando_resposta') {
    return (
      <DynamicListCard 
        title="Aguardando Resposta"
        items={dynamicData.lists.pendingResponse.items}
        loading={dynamicData.lists.pendingResponse.loading}
        emptyMessage="Nenhuma demanda aguardando resposta"
        viewAllPath="/dashboard/comunicacao/responder"
        viewAllLabel="Ver todas pendentes"
      />
    );
  }
  
  if (dataSourceKey === 'notas_aprovacao') {
    return (
      <DynamicListCard 
        title="Notas para Aprovação"
        items={dynamicData.lists.recentNotes.items.filter(item => item.status === 'pending')}
        loading={dynamicData.lists.recentNotes.loading}
        emptyMessage="Nenhuma nota aguardando aprovação"
        viewAllPath="/dashboard/comunicacao/aprovar-nota"
        viewAllLabel="Ver todas as notas"
      />
    );
  }
  
  if (dataSourceKey === 'demandas_aguardando_nota') {
    return (
      <DynamicListCard 
        title="Demandas Aguardando Nota"
        items={dynamicData.lists.pendingNotes.items}
        loading={dynamicData.lists.pendingNotes.loading}
        emptyMessage="Nenhuma demanda aguardando nota"
        viewAllPath="/dashboard/comunicacao/criar-nota"
        viewAllLabel="Criar nova nota"
      />
    );
  }
  
  // Default empty state if no matching dataSourceKey
  return (
    <Card className="w-full h-full flex items-center justify-center p-4">
      <div className="text-center text-gray-500">
        <p>Dados não disponíveis</p>
        <p className="text-xs mt-1">Fonte: {dataSourceKey}</p>
      </div>
    </Card>
  );
};

export default DynamicCard;
