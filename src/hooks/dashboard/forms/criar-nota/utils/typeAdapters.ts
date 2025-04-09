
import { Demand as DemandComponent } from '@/components/dashboard/forms/criar-nota/types';
import { Demand as DemandType, Note as NoteType } from '@/types/demand';
import { Note as NoteComponent } from '@/components/dashboard/forms/criar-nota/types';

// This ensures we have a proper adapter between the component and domain types
export const adaptDemandType = (demanda: DemandComponent): DemandType => {
  // First create a new object without the notas property to avoid type issues
  const { notas, ...demandaWithoutNotas } = demanda;
  
  // Create a new object with all properties from the original demand
  const adaptedDemand: Partial<DemandType> = {
    ...demandaWithoutNotas,
    // Convert object properties to strings for compatibility
    origem: typeof demanda.origem === 'object' ? demanda.origem.descricao : demanda.origem as string,
    servico: typeof demanda.servico === 'object' ? demanda.servico.descricao : demanda.servico as string,
    tipo_midia: typeof demanda.tipo_midia === 'object' ? demanda.tipo_midia.descricao : demanda.tipo_midia as string,
    bairro: typeof demanda.bairro === 'object' ? demanda.bairro.nome : demanda.bairro as string,
    autor: typeof demanda.autor === 'object' ? demanda.autor.nome_completo : demanda.autor as string
  };
  
  // Handle notes separately, ensuring they're properly converted
  if (demanda.notas && Array.isArray(demanda.notas)) {
    // Convert each note, ensuring the required fields are present
    adaptedDemand.notas = demanda.notas.map((note): NoteType => ({
      id: note.id,
      titulo: note.titulo,
      conteudo: note.conteudo || '', // Ensure conteudo is ALWAYS present and a string
      status: note.status || 'pendente',
      data_criacao: note.data_criacao || new Date().toISOString(),
      autor_id: note.autor_id,
      demanda_id: note.demanda_id || ''
    }));
  } else {
    adaptedDemand.notas = [];
  }
  
  return adaptedDemand as DemandType;
};

// Function to convert back if needed
export const adaptToDemandComponent = (demanda: DemandType): DemandComponent => {
  // First create a new object without the notas property to avoid type issues
  const { notas, ...demandaWithoutNotas } = demanda;
  
  // Create component format with object structures instead of strings
  const componentDemand: Partial<DemandComponent> = {
    ...demandaWithoutNotas,
    origem: typeof demanda.origem === 'string' 
      ? { descricao: demanda.origem, id: demanda.origem_id } 
      : demanda.origem as any,
    servico: typeof demanda.servico === 'string'
      ? { descricao: demanda.servico, id: demanda.servico_id }
      : demanda.servico as any
  };
  
  // Handle converting notes if needed
  if (demanda.notas && Array.isArray(demanda.notas)) {
    componentDemand.notas = demanda.notas.map(note => {
      // Convert from NoteType to NoteComponent - note that in NoteComponent, conteudo is optional
      const componentNote: NoteComponent = {
        id: note.id,
        titulo: note.titulo,
        conteudo: note.conteudo, // This is required in NoteType, so it will always be present
        status: note.status,
        data_criacao: note.data_criacao,
        autor_id: note.autor_id,
        demanda_id: note.demanda_id
      };
      return componentNote;
    });
  } else {
    componentDemand.notas = [];
  }
  
  return componentDemand as DemandComponent;
};
