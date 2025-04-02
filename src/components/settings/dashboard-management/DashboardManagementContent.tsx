
import React from 'react';
import KPICard from './KPICard';
import DynamicListCard from './DynamicListCard';
import OriginSelectionCard from './OriginSelectionCard';
import SmartSearchCard from './SmartSearchCard';
import { useDashboardKPIs } from '@/hooks/dashboard-management/useDashboardKPIs';
import { useDashboardLists } from '@/hooks/dashboard-management/useDashboardLists';
import { useOriginOptions } from '@/hooks/dashboard-management/useOriginOptions';
import DashboardPreview from './DashboardPreview';
import { useAvailableCards } from '@/hooks/dashboard-management/useAvailableCards';
import { useDefaultDashboardConfig } from '@/hooks/dashboard-management/useDefaultDashboardConfig';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Save, RefreshCcw, Trash2 } from 'lucide-react';
import DraggableCard from './DraggableCard';
import { ActionCardItem } from '@/types/dashboard';
import { CardTitle, CardContent } from '@/components/ui/card';
import { v4 as uuidv4 } from 'uuid';

const DashboardManagementContent: React.FC = () => {
  const { kpis } = useDashboardKPIs();
  const { lists } = useDashboardLists();
  const { originOptions } = useOriginOptions();
  const { availableCards, dynamicCards, standardCards } = useAvailableCards();
  const {
    config,
    selectedDepartment,
    setSelectedDepartment,
    isLoading,
    isSaving,
    saveConfig,
    resetAllDashboards
  } = useDefaultDashboardConfig();

  const handleSaveConfig = async () => {
    const success = await saveConfig(config);
    if (success) {
      toast({
        title: "Configuração salva",
        description: "A configuração do dashboard foi salva com sucesso.",
        variant: "success"
      });
    } else {
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar a configuração do dashboard.",
        variant: "destructive"
      });
    }
  };

  const handleResetDashboards = async () => {
    if (window.confirm("Tem certeza que deseja redefinir todos os dashboards para o padrão? Esta ação não pode ser desfeita.")) {
      const success = await resetAllDashboards();
      if (success) {
        toast({
          title: "Dashboards redefinidos",
          description: "Todos os dashboards foram redefinidos para a configuração padrão.",
          variant: "success"
        });
      } else {
        toast({
          title: "Erro ao redefinir",
          description: "Não foi possível redefinir os dashboards.",
          variant: "destructive"
        });
      }
    }
  };

  // Define dynamic cards for dragging
  const kpiCards: ActionCardItem[] = [
    {
      id: `kpi-press-requests-${uuidv4()}`,
      title: "Solicitações de imprensa",
      subtitle: `${kpis.pressRequests.today} hoje (${kpis.pressRequests.percentageChange > 0 ? '+' : ''}${kpis.pressRequests.percentageChange.toFixed(0)}%)`,
      iconId: "newspaper",
      path: "/dashboard/comunicacao/demandas",
      color: "blue",
      width: "25",
      height: "1",
      type: "data_dynamic",
      hasBadge: true,
      badgeValue: `${kpis.pressRequests.today}`
    },
    {
      id: `kpi-pending-approval-${uuidv4()}`,
      title: "Demandas em aprovação",
      subtitle: `${kpis.pendingApproval.total} total (${kpis.pendingApproval.awaitingResponse} aguardando)`,
      iconId: "clock",
      path: "/dashboard/comunicacao/responder",
      color: "orange",
      width: "25",
      height: "1",
      type: "data_dynamic",
      hasBadge: true,
      badgeValue: `${kpis.pendingApproval.total}`
    },
    {
      id: `kpi-notes-produced-${uuidv4()}`,
      title: "Notas produzidas",
      subtitle: `${kpis.notesProduced.approved} aprovadas, ${kpis.notesProduced.rejected} recusadas`,
      iconId: "file-text",
      path: "/dashboard/comunicacao/notas",
      color: "green",
      width: "25",
      height: "1",
      type: "data_dynamic",
      hasBadge: true,
      badgeValue: `${kpis.notesProduced.total}`
    }
  ];

  // Create dynamic list cards
  const listCards: ActionCardItem[] = [
    {
      id: `list-demands-${uuidv4()}`,
      title: "Demandas em andamento",
      subtitle: "Últimas demandas em processamento",
      iconId: "list",
      path: "/dashboard/comunicacao/demandas",
      color: "blue-light",
      width: "50",
      height: "2",
      type: "in_progress_demands"
    },
    {
      id: `list-notes-${uuidv4()}`,
      title: "Notas de imprensa",
      subtitle: "Últimas notas produzidas",
      iconId: "file-text",
      path: "/dashboard/comunicacao/notas",
      color: "orange-light",
      width: "50",
      height: "2",
      type: "recent_notes"
    }
  ];

  // Create origin selection card
  const originCard: ActionCardItem = {
    id: `origin-selection-${uuidv4()}`,
    title: "De onde vem a demanda?",
    subtitle: "Selecione a origem para registrar",
    iconId: "help-circle",
    path: "/dashboard/comunicacao/cadastrar",
    color: "lime",
    width: "50",
    height: "2",
    type: "origin_selection"
  };

  // Create smart search card
  const searchCard: ActionCardItem = {
    id: `smart-search-${uuidv4()}`,
    title: "O que vamos fazer?",
    iconId: "search",
    path: "",
    color: "gray-ultra-light",
    width: "100",
    height: "1",
    type: "smart_search",
    isSearch: true
  };

  return (
    <div className="space-y-6">
      {/* Smart Search */}
      <div className="w-full h-20">
        <SmartSearchCard placeholder="O que vamos fazer?" />
      </div>
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <KPICard 
          title="Solicitações de imprensa"
          value={kpis.pressRequests.today}
          previousValue={kpis.pressRequests.yesterday}
          percentageChange={kpis.pressRequests.percentageChange}
          loading={kpis.pressRequests.loading}
          variant={kpis.pressRequests.percentageChange > 0 ? "success" : "default"}
        />
        
        <KPICard 
          title="Demandas em aprovação"
          value={kpis.pendingApproval.total}
          secondaryValue={kpis.pendingApproval.awaitingResponse}
          secondaryLabel="aguardando resposta"
          loading={kpis.pendingApproval.loading}
          variant="warning"
        />
        
        <KPICard 
          title="Notas produzidas"
          value={kpis.notesProduced.total}
          secondaryValue={kpis.notesProduced.approved}
          secondaryLabel={`aprovadas | ${kpis.notesProduced.rejected} recusadas`}
          loading={kpis.notesProduced.loading}
          variant="success"
        />
      </div>
      
      {/* Dynamic Lists and Origin Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="h-80">
          <DynamicListCard 
            title="Demandas em andamento"
            items={lists.recentDemands.items}
            loading={lists.recentDemands.loading}
            emptyMessage="Nenhuma demanda em andamento"
            viewAllPath="/dashboard/comunicacao/demandas"
            viewAllLabel="Ver todas as demandas"
          />
        </div>
        
        <div className="h-80">
          <DynamicListCard 
            title="Notas de imprensa"
            items={lists.recentNotes.items}
            loading={lists.recentNotes.loading}
            emptyMessage="Nenhuma nota de imprensa"
            viewAllPath="/dashboard/comunicacao/notas"
            viewAllLabel="Ver todas as notas"
          />
        </div>
        
        <div className="h-80">
          <OriginSelectionCard 
            title="De onde vem a demanda?"
            options={originOptions}
          />
        </div>
      </div>
      
      {/* Dashboard Preview and Management */}
      <div className="mt-8 space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-center bg-gray-50 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-2 md:mb-0">Gerenciar Dashboard de Comunicação</h2>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleResetDashboards}
              disabled={isSaving}
              className="flex items-center gap-1"
            >
              <RefreshCcw className="h-4 w-4" />
              <span>Redefinir todos</span>
            </Button>
            
            <Button
              variant="default"
              size="sm"
              onClick={handleSaveConfig}
              disabled={isSaving}
              className="flex items-center gap-1"
            >
              <Save className="h-4 w-4" />
              <span>{isSaving ? "Salvando..." : "Salvar configuração"}</span>
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-3 space-y-4">
            <div className="bg-white p-4 rounded-lg border">
              <h3 className="font-medium mb-3">Cards padrão</h3>
              <div className="space-y-2 max-h-[250px] overflow-y-auto p-1">
                {standardCards.map(card => (
                  <DraggableCard 
                    key={card.id}
                    card={card}
                    className="mb-2"
                  >
                    <div className="p-3 flex items-center gap-2">
                      <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-green-700">S</span>
                      </div>
                      <span className="text-sm font-medium">{card.title}</span>
                    </div>
                  </DraggableCard>
                ))}
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg border">
              <h3 className="font-medium mb-3">Cards dinâmicos</h3>
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-500 mb-1">KPIs</h4>
                
                {/* KPI Dynamic Cards */}
                <div className="space-y-2 mb-4">
                  {kpiCards.map(card => (
                    <DraggableCard 
                      key={card.id}
                      card={card}
                      isDynamic={true}
                      className="mb-2"
                    >
                      <div className="p-3 flex items-center gap-2">
                        <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-700">K</span>
                        </div>
                        <div className="flex-1">
                          <span className="text-sm font-medium block">{card.title}</span>
                          <span className="text-xs text-gray-500">{card.subtitle}</span>
                        </div>
                      </div>
                    </DraggableCard>
                  ))}
                </div>
                
                <h4 className="text-sm font-medium text-gray-500 mb-1">Listas</h4>
                {/* List Dynamic Cards */}
                <div className="space-y-2 mb-4">
                  {listCards.map(card => (
                    <DraggableCard 
                      key={card.id}
                      card={card}
                      isDynamic={true}
                      className="mb-2"
                    >
                      <div className="p-3 flex items-center gap-2">
                        <div className="flex-shrink-0 w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                          <span className="text-orange-700">L</span>
                        </div>
                        <div className="flex-1">
                          <span className="text-sm font-medium block">{card.title}</span>
                          <span className="text-xs text-gray-500">{card.subtitle}</span>
                        </div>
                      </div>
                    </DraggableCard>
                  ))}
                </div>
                
                <h4 className="text-sm font-medium text-gray-500 mb-1">Seleção de Origem</h4>
                {/* Origin Selection Card */}
                <DraggableCard 
                  card={originCard}
                  isDynamic={true}
                  className="mb-2"
                >
                  <div className="p-3 flex items-center gap-2">
                    <div className="flex-shrink-0 w-8 h-8 bg-lime-100 rounded-full flex items-center justify-center">
                      <span className="text-lime-700">O</span>
                    </div>
                    <div className="flex-1">
                      <span className="text-sm font-medium block">{originCard.title}</span>
                      <span className="text-xs text-gray-500">{originCard.subtitle}</span>
                    </div>
                  </div>
                </DraggableCard>
                
                <h4 className="text-sm font-medium text-gray-500 mb-1">Busca Inteligente</h4>
                {/* Smart Search Card */}
                <DraggableCard 
                  card={searchCard}
                  isDynamic={true}
                  className="mb-2"
                >
                  <div className="p-3 flex items-center gap-2">
                    <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                      <span className="text-gray-700">B</span>
                    </div>
                    <span className="text-sm font-medium">{searchCard.title}</span>
                  </div>
                </DraggableCard>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-9">
            <div className="bg-white p-4 rounded-lg border">
              <h3 className="font-medium mb-3">Preview do Dashboard</h3>
              <div className="bg-gray-100 rounded-lg p-2">
                <DashboardPreview 
                  dashboardType="communication" 
                  department={selectedDepartment}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardManagementContent;
