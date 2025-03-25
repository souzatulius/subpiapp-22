
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SGZFilterOptions, SGZChartVisibility } from '../types';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarIcon, Check, Filter, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SGZFilterSectionProps {
  filters: SGZFilterOptions;
  onFiltersChange: (filters: Partial<SGZFilterOptions>) => void;
  chartVisibility: SGZChartVisibility;
  onChartVisibilityChange: (visibility: Partial<SGZChartVisibility>) => void;
}

const SGZFilterSection: React.FC<SGZFilterSectionProps> = ({
  filters,
  onFiltersChange,
  chartVisibility,
  onChartVisibilityChange
}) => {
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  
  // Opções pré-definidas para filtros
  const statusOptions = ['Todos', 'Novo', 'Em Andamento', 'Concluído', 'PREPLAN', 'PRECANC', 'Fechado'];
  const areaOptions = ['STM', 'STLP'] as const;
  const distritoOptions = ['Todos', 'Pinheiros', 'Alto de Pinheiros', 'Itaim Bibi', 'Jardim Paulista', 'Outros'];
  const servicoOptions = ['Todos', 'Tapa Buraco', 'Poda', 'Limpeza', 'Microdrenagem', 'Outros'];
  
  // Filtro de data
  const handleDatePickerSelect = (date: Date | undefined, type: 'de' | 'ate') => {
    if (!date) return;
    
    const newPeriodo = { ...filters.periodo };
    
    if (type === 'de') {
      newPeriodo.de = date;
      // Se a data "de" for posterior à data "até", atualiza "até"
      if (newPeriodo.ate && date > newPeriodo.ate) {
        newPeriodo.ate = date;
      }
    } else {
      newPeriodo.ate = date;
      // Se a data "até" for anterior à data "de", atualiza "de"
      if (newPeriodo.de && date < newPeriodo.de) {
        newPeriodo.de = date;
      }
    }
    
    onFiltersChange({ periodo: newPeriodo });
  };
  
  // Filtro de status
  const handleStatusChange = (status: string) => {
    let newStatuses = [...filters.statuses];
    
    if (status === 'Todos') {
      newStatuses = ['Todos'];
    } else {
      // Remove 'Todos' se estiver presente
      newStatuses = newStatuses.filter(s => s !== 'Todos');
      
      // Adiciona ou remove o status
      if (newStatuses.includes(status)) {
        newStatuses = newStatuses.filter(s => s !== status);
      } else {
        newStatuses.push(status);
      }
      
      // Se não houver nenhum status, adiciona 'Todos'
      if (newStatuses.length === 0) {
        newStatuses = ['Todos'];
      }
    }
    
    onFiltersChange({ statuses: newStatuses });
  };
  
  // Filtro de área técnica
  const handleAreaChange = (area: SGZFilterOptions['areas_tecnicas'][number]) => {
    let newAreas = [...filters.areas_tecnicas];
    
    // Verifica se já existe na lista
    if (newAreas.includes(area)) {
      // Não permite desmarcar todas as áreas
      if (newAreas.length === 1) {
        return;
      }
      newAreas = newAreas.filter(a => a !== area);
    } else {
      newAreas.push(area);
    }
    
    onFiltersChange({ areas_tecnicas: newAreas });
  };
  
  // Filtro de distrito
  const handleDistritoChange = (distrito: string) => {
    let newDistritos = [...filters.distritos];
    
    if (distrito === 'Todos') {
      newDistritos = ['Todos'];
    } else {
      // Remove 'Todos' se estiver presente
      newDistritos = newDistritos.filter(d => d !== 'Todos');
      
      // Adiciona ou remove o distrito
      if (newDistritos.includes(distrito)) {
        newDistritos = newDistritos.filter(d => d !== distrito);
      } else {
        newDistritos.push(distrito);
      }
      
      // Se não houver nenhum distrito, adiciona 'Todos'
      if (newDistritos.length === 0) {
        newDistritos = ['Todos'];
      }
    }
    
    onFiltersChange({ distritos: newDistritos });
  };
  
  // Filtro de tipo de serviço
  const handleServicoChange = (servico: string) => {
    let newServicos = [...filters.tipos_servico];
    
    if (servico === 'Todos') {
      newServicos = ['Todos'];
    } else {
      // Remove 'Todos' se estiver presente
      newServicos = newServicos.filter(s => s !== 'Todos');
      
      // Adiciona ou remove o serviço
      if (newServicos.includes(servico)) {
        newServicos = newServicos.filter(s => s !== servico);
      } else {
        newServicos.push(servico);
      }
      
      // Se não houver nenhum serviço, adiciona 'Todos'
      if (newServicos.length === 0) {
        newServicos = ['Todos'];
      }
    }
    
    onFiltersChange({ tipos_servico: newServicos });
  };
  
  // Reset de todos os filtros
  const handleResetFilters = () => {
    onFiltersChange({
      periodo: undefined,
      statuses: ['Todos'],
      areas_tecnicas: ['STM', 'STLP'],
      distritos: ['Todos'],
      bairros: ['Todos'],
      tipos_servico: ['Todos']
    });
  };
  
  // Toggle de visibilidade de gráficos
  const handleChartVisibilityToggle = (chart: keyof SGZChartVisibility) => {
    onChartVisibilityChange({ 
      [chart]: !chartVisibility[chart] 
    });
  };
  
  // Renderiza os filtros ativos como chips
  const renderActiveFilters = () => {
    const activeFilters = [];
    
    // Filtro de período
    if (filters.periodo?.de && filters.periodo.ate) {
      activeFilters.push(
        <div 
          key="period" 
          className="flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs"
        >
          <span>Período: {format(filters.periodo.de, 'dd/MM/yyyy')} - {format(filters.periodo.ate, 'dd/MM/yyyy')}</span>
          <button 
            onClick={() => onFiltersChange({ periodo: undefined })}
            className="text-orange-500 hover:text-orange-800"
          >
            <XCircle className="h-3 w-3" />
          </button>
        </div>
      );
    }
    
    // Status (apenas se não for 'Todos')
    if (!filters.statuses.includes('Todos')) {
      activeFilters.push(
        <div 
          key="status" 
          className="flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs"
        >
          <span>Status: {filters.statuses.join(', ')}</span>
          <button 
            onClick={() => onFiltersChange({ statuses: ['Todos'] })}
            className="text-orange-500 hover:text-orange-800"
          >
            <XCircle className="h-3 w-3" />
          </button>
        </div>
      );
    }
    
    // Distritos (apenas se não for 'Todos')
    if (!filters.distritos.includes('Todos')) {
      activeFilters.push(
        <div 
          key="distrito" 
          className="flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs"
        >
          <span>Distritos: {filters.distritos.join(', ')}</span>
          <button 
            onClick={() => onFiltersChange({ distritos: ['Todos'] })}
            className="text-orange-500 hover:text-orange-800"
          >
            <XCircle className="h-3 w-3" />
          </button>
        </div>
      );
    }
    
    // Tipos de serviço (apenas se não for 'Todos')
    if (!filters.tipos_servico.includes('Todos')) {
      activeFilters.push(
        <div 
          key="servico" 
          className="flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs"
        >
          <span>Serviços: {filters.tipos_servico.join(', ')}</span>
          <button 
            onClick={() => onFiltersChange({ tipos_servico: ['Todos'] })}
            className="text-orange-500 hover:text-orange-800"
          >
            <XCircle className="h-3 w-3" />
          </button>
        </div>
      );
    }
    
    // Áreas técnicas (apenas se não forem todas)
    if (filters.areas_tecnicas.length < 2) {
      activeFilters.push(
        <div 
          key="area" 
          className="flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs"
        >
          <span>Área Técnica: {filters.areas_tecnicas.join(', ')}</span>
          <button 
            onClick={() => onFiltersChange({ areas_tecnicas: ['STM', 'STLP'] })}
            className="text-orange-500 hover:text-orange-800"
          >
            <XCircle className="h-3 w-3" />
          </button>
        </div>
      );
    }
    
    if (activeFilters.length === 0) {
      return (
        <div className="text-sm text-gray-500">
          Nenhum filtro ativo. Use as opções acima para filtrar os dados.
        </div>
      );
    }
    
    return (
      <div className="flex flex-wrap gap-2">
        {activeFilters}
        
        {activeFilters.length > 0 && (
          <button 
            onClick={handleResetFilters}
            className="flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs hover:bg-gray-200"
          >
            <span>Limpar Todos</span>
          </button>
        )}
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Filtros e Gerenciamento de Exibição</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {/* Filtro de Data */}
            <div className="space-y-2">
              <Label>Período</Label>
              <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !filters.periodo && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filters.periodo?.de && filters.periodo.ate ? (
                      <>
                        {format(filters.periodo.de, 'PP', { locale: ptBR })} - {format(filters.periodo.ate, 'PP', { locale: ptBR })}
                      </>
                    ) : (
                      <span>Selecione o período</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 flex" align="start">
                  <div className="space-y-2 p-3 border-r">
                    <div className="text-sm font-medium">Data Inicial</div>
                    <Calendar
                      mode="single"
                      selected={filters.periodo?.de}
                      onSelect={(date) => handleDatePickerSelect(date, 'de')}
                      initialFocus
                      locale={ptBR}
                    />
                  </div>
                  <div className="space-y-2 p-3">
                    <div className="text-sm font-medium">Data Final</div>
                    <Calendar
                      mode="single"
                      selected={filters.periodo?.ate}
                      onSelect={(date) => handleDatePickerSelect(date, 'ate')}
                      initialFocus
                      locale={ptBR}
                    />
                  </div>
                </PopoverContent>
              </Popover>
            </div>
            
            {/* Filtro de Status */}
            <div className="space-y-2">
              <Label>Status</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <Filter className="mr-2 h-4 w-4" />
                    {filters.statuses.includes('Todos') 
                      ? 'Todos os Status' 
                      : `${filters.statuses.length} selecionados`}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-70 p-4" align="start">
                  <div className="space-y-2">
                    {statusOptions.map((status) => (
                      <div key={status} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`status-${status}`} 
                          checked={filters.statuses.includes(status)}
                          onCheckedChange={() => handleStatusChange(status)}
                        />
                        <Label 
                          htmlFor={`status-${status}`}
                          className={cn(
                            "flex-1 cursor-pointer text-sm",
                            status === 'PREPLAN' || status === 'PRECANC' ? "text-orange-600 font-semibold" : ""
                          )}
                        >
                          {status}
                        </Label>
                      </div>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            </div>
            
            {/* Filtro de Área Técnica */}
            <div className="space-y-2">
              <Label>Área Técnica</Label>
              <div className="flex flex-col space-y-2 border p-3 rounded-md">
                {areaOptions.map((area) => (
                  <div key={area} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`area-${area}`} 
                      checked={filters.areas_tecnicas.includes(area)}
                      onCheckedChange={() => handleAreaChange(area)}
                    />
                    <Label 
                      htmlFor={`area-${area}`}
                      className="flex-1 cursor-pointer text-sm"
                    >
                      {area}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Filtro de Distrito */}
            <div className="space-y-2">
              <Label>Distrito</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <Filter className="mr-2 h-4 w-4" />
                    {filters.distritos.includes('Todos') 
                      ? 'Todos os Distritos' 
                      : `${filters.distritos.length} selecionados`}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-70 p-4" align="start">
                  <div className="space-y-2">
                    {distritoOptions.map((distrito) => (
                      <div key={distrito} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`distrito-${distrito}`} 
                          checked={filters.distritos.includes(distrito)}
                          onCheckedChange={() => handleDistritoChange(distrito)}
                        />
                        <Label 
                          htmlFor={`distrito-${distrito}`}
                          className="flex-1 cursor-pointer text-sm"
                        >
                          {distrito}
                        </Label>
                      </div>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            </div>
            
            {/* Filtro de Tipo de Serviço */}
            <div className="space-y-2">
              <Label>Tipo de Serviço</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <Filter className="mr-2 h-4 w-4" />
                    {filters.tipos_servico.includes('Todos') 
                      ? 'Todos os Serviços' 
                      : `${filters.tipos_servico.length} selecionados`}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-70 p-4" align="start">
                  <div className="space-y-2">
                    {servicoOptions.map((servico) => (
                      <div key={servico} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`servico-${servico}`} 
                          checked={filters.tipos_servico.includes(servico)}
                          onCheckedChange={() => handleServicoChange(servico)}
                        />
                        <Label 
                          htmlFor={`servico-${servico}`}
                          className="flex-1 cursor-pointer text-sm"
                        >
                          {servico}
                        </Label>
                      </div>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          {/* Filtros ativos */}
          <div className="space-y-2">
            <div className="font-medium text-sm">Filtros Ativos</div>
            {renderActiveFilters()}
          </div>
          
          {/* Configuração de visibilidade dos gráficos */}
          <div className="space-y-2">
            <div className="font-medium text-sm">Visibilidade dos Gráficos</div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {Object.entries(chartVisibility).map(([key, value]) => (
                <Button
                  key={key}
                  variant={value ? "default" : "outline"}
                  size="sm"
                  className={value ? "bg-orange-500 hover:bg-orange-600" : ""}
                  onClick={() => handleChartVisibilityToggle(key as keyof SGZChartVisibility)}
                >
                  {value && <Check className="mr-1 h-3 w-3" />}
                  {formatChartName(key)}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Utilitário para formatar nomes de gráficos
function formatChartName(chartKey: string) {
  const formattedNames: Record<string, string> = {
    distribuicao_status: "Distribuição por Status",
    tempo_medio: "Tempo Médio",
    empresas_concluidas: "Empresas",
    ordens_por_area: "Áreas da Subprefeitura",
    servicos_mais_realizados: "Serviços Realizados",
    servicos_por_distrito: "Serviços por Distrito",
    comparativo_tempo: "Comparativo de Tempo",
    impacto_eficiencia: "Impacto na Eficiência",
    volume_diario: "Volume Diário",
    comparativo_bairros: "Comparativo Bairros",
    radar_eficiencia: "Radar de Eficiência",
    transicao_status: "Transição de Status",
    status_criticos: "Status Críticos",
    ordens_externas: "Ordens Externas",
    diversidade_servicos: "Diversidade de Serviços",
    tempo_fechamento: "Tempo de Fechamento"
  };
  
  return formattedNames[chartKey] || chartKey.replace(/_/g, ' ');
}

export default SGZFilterSection;
