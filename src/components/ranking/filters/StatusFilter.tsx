
import React from 'react';
import { 
  Card, 
  CardContent 
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

interface StatusFilterProps {
  statuses: string[];
  onStatusChange: (status: string) => void;
}

const StatusFilter: React.FC<StatusFilterProps> = ({ 
  statuses, 
  onStatusChange 
}) => {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="space-y-2">
          <h3 className="font-medium text-sm mb-2">Status</h3>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="status-all" 
              checked={statuses.includes('Todos')} 
              onCheckedChange={() => onStatusChange('Todos')}
            />
            <label 
              htmlFor="status-all"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Todos os Status
            </label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="status-conc" 
              checked={statuses.includes('Concluído')} 
              onCheckedChange={() => onStatusChange('Concluído')}
              disabled={statuses.includes('Todos')}
            />
            <label 
              htmlFor="status-conc"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Concluído (CONC)
            </label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="status-fechado" 
              checked={statuses.includes('FECHADO')} 
              onCheckedChange={() => onStatusChange('FECHADO')}
              disabled={statuses.includes('Todos')}
            />
            <label 
              htmlFor="status-fechado"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Fechado
            </label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="status-preplan" 
              checked={statuses.includes('PREPLAN')} 
              onCheckedChange={() => onStatusChange('PREPLAN')}
              disabled={statuses.includes('Todos')}
            />
            <label 
              htmlFor="status-preplan"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              PREPLAN
            </label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="status-precanc" 
              checked={statuses.includes('PRECANC')} 
              onCheckedChange={() => onStatusChange('PRECANC')}
              disabled={statuses.includes('Todos')}
            />
            <label 
              htmlFor="status-precanc"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              PRECANC
            </label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="status-em-andamento" 
              checked={statuses.includes('Em Andamento')} 
              onCheckedChange={() => onStatusChange('Em Andamento')}
              disabled={statuses.includes('Todos')}
            />
            <label 
              htmlFor="status-em-andamento"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Em Andamento
            </label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="status-aprovado" 
              checked={statuses.includes('Aprovado')} 
              onCheckedChange={() => onStatusChange('Aprovado')}
              disabled={statuses.includes('Todos')}
            />
            <label 
              htmlFor="status-aprovado"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Aprovado
            </label>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatusFilter;
