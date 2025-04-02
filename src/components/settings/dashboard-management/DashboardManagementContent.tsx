
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
              <h3 className="font-medium mb-3">Cards disponíveis</h3>
              <div className="space-y-2 max-h-[500px] overflow-y-auto p-1">
                {dynamicCards.map(card => (
                  <div 
                    key={card.id}
                    className="p-2 bg-gray-50 rounded border border-gray-200 cursor-grab hover:border-blue-300 transition-colors"
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData('application/json', JSON.stringify(card));
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-700">D</span>
                      </div>
                      <span className="text-sm font-medium">{card.title}</span>
                    </div>
                  </div>
                ))}
                {standardCards.map(card => (
                  <div 
                    key={card.id}
                    className="p-2 bg-gray-50 rounded border border-gray-200 cursor-grab hover:border-blue-300 transition-colors"
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData('application/json', JSON.stringify(card));
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-green-700">S</span>
                      </div>
                      <span className="text-sm font-medium">{card.title}</span>
                    </div>
                  </div>
                ))}
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
