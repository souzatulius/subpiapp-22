
import { Demand as DemandComponent } from '@/components/dashboard/forms/criar-nota/types';
import { Demand as DemandType } from '@/types/demand';

export const adaptDemandType = (demanda: DemandComponent): DemandType => {
  // Create a new object with all properties from the original demand
  const adaptedDemand: Partial<DemandType> = {
    ...demanda,
    // Convert object properties to strings for compatibility
    origem: typeof demanda.origem === 'object' ? demanda.origem.descricao : demanda.origem as string,
    servico: typeof demanda.servico === 'object' ? demanda.servico.descricao : demanda.servico as string,
    tipo_midia: typeof demanda.tipo_midia === 'object' ? demanda.tipo_midia.descricao : demanda.tipo_midia as string,
    bairro: typeof demanda.bairro === 'object' ? demanda.bairro.nome : demanda.bairro as string,
    autor: typeof demanda.autor === 'object' ? demanda.autor.nome_completo : demanda.autor as string
  };
  
  return adaptedDemand as DemandType;
};

// Function to convert back if needed
export const adaptToDemandComponent = (demanda: DemandType): DemandComponent => {
  // Create component format with object structures instead of strings
  const componentDemand: Partial<DemandComponent> = {
    ...demanda,
    origem: typeof demanda.origem === 'string' 
      ? { descricao: demanda.origem, id: demanda.origem_id } 
      : demanda.origem as any,
    servico: typeof demanda.servico === 'string'
      ? { descricao: demanda.servico, id: demanda.servico_id }
      : demanda.servico as any
  };
  
  return componentDemand as DemandComponent;
};
