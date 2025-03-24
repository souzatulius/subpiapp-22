
import React from 'react';
import { ChartVisibility } from '../types';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface ChartVisibilityManagerProps {
  chartVisibility: ChartVisibility;
  onChange: (newVisibility: Partial<ChartVisibility>) => void;
}

const ChartVisibilityManager: React.FC<ChartVisibilityManagerProps> = ({
  chartVisibility,
  onChange
}) => {
  const handleChange = (key: keyof ChartVisibility) => {
    onChange({ [key]: !chartVisibility[key] });
  };

  return (
    <div>
      <h3 className="text-sm font-medium mb-2">Visibilidade dos Gráficos</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="vis-occurrences" 
            checked={chartVisibility.occurrences}
            onCheckedChange={() => handleChange('occurrences')}
          />
          <Label htmlFor="vis-occurrences">Ocorrências</Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="vis-resolution" 
            checked={chartVisibility.resolutionTime}
            onCheckedChange={() => handleChange('resolutionTime')}
          />
          <Label htmlFor="vis-resolution">Tempo de Resolução</Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="vis-service-types" 
            checked={chartVisibility.serviceTypes}
            onCheckedChange={() => handleChange('serviceTypes')}
          />
          <Label htmlFor="vis-service-types">Tipos de Serviço</Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="vis-neighborhoods" 
            checked={chartVisibility.neighborhoods}
            onCheckedChange={() => handleChange('neighborhoods')}
          />
          <Label htmlFor="vis-neighborhoods">Bairros</Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="vis-freq-services" 
            checked={chartVisibility.frequentServices}
            onCheckedChange={() => handleChange('frequentServices')}
          />
          <Label htmlFor="vis-freq-services">Serviços Frequentes</Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="vis-status" 
            checked={chartVisibility.statusDistribution}
            onCheckedChange={() => handleChange('statusDistribution')}
          />
          <Label htmlFor="vis-status">Status</Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="vis-timeline" 
            checked={chartVisibility.statusTimeline}
            onCheckedChange={() => handleChange('statusTimeline')}
          />
          <Label htmlFor="vis-timeline">Evolução Temporal</Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="vis-transition" 
            checked={chartVisibility.statusTransition}
            onCheckedChange={() => handleChange('statusTransition')}
          />
          <Label htmlFor="vis-transition">Transição de Status</Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="vis-radar" 
            checked={chartVisibility.efficiencyRadar}
            onCheckedChange={() => handleChange('efficiencyRadar')}
          />
          <Label htmlFor="vis-radar">Radar de Eficiência</Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="vis-critical" 
            checked={chartVisibility.criticalStatus}
            onCheckedChange={() => handleChange('criticalStatus')}
          />
          <Label htmlFor="vis-critical">Status Críticos</Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="vis-external" 
            checked={chartVisibility.externalDistricts}
            onCheckedChange={() => handleChange('externalDistricts')}
          />
          <Label htmlFor="vis-external">Distritos Externos</Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="vis-diversity" 
            checked={chartVisibility.servicesDiversity}
            onCheckedChange={() => handleChange('servicesDiversity')}
          />
          <Label htmlFor="vis-diversity">Diversidade de Serviços</Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="vis-time-close" 
            checked={chartVisibility.timeToClose}
            onCheckedChange={() => handleChange('timeToClose')}
          />
          <Label htmlFor="vis-time-close">Tempo até Fechamento</Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="vis-daily" 
            checked={chartVisibility.dailyOrders}
            onCheckedChange={() => handleChange('dailyOrders')}
          />
          <Label htmlFor="vis-daily">Volume Diário</Label>
        </div>
      </div>
    </div>
  );
};

export default ChartVisibilityManager;
