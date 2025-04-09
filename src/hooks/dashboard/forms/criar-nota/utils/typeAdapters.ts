
import { Demand as DemandComponent } from '@/components/dashboard/forms/criar-nota/types';
import { Demand as DemandType } from '@/types/demand';

export const adaptDemandType = (demanda: DemandComponent): DemandType => {
  // Convert origin from object to string for compatibility
  return {
    ...demanda,
    origem: typeof demanda.origem === 'object' ? demanda.origem.descricao : demanda.origem,
  } as DemandType;
};
