
import { Demand as DemandComponent } from '@/components/dashboard/forms/criar-nota/types';
import { Demand as DemandType, Note as NoteType } from '@/types/demand';
import { Note as NoteComponent } from '@/components/dashboard/forms/criar-nota/types';

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
  
  // Handle notes separately - ensure they're properly converted to NoteType
  if (demanda.notas && Array.isArray(demanda.notas)) {
    // Convert each note, ensuring the required fields are present
    const convertedNotas: NoteType[] = demanda.notas.map((note): NoteType => ({
      id: note.id,
      titulo: note.titulo,
      conteudo: note.conteudo || '', // Ensure conteudo is ALWAYS a string (never undefined)
      status: note.status || 'pendente',
      data_criacao: note.data_criacao || new Date().toISOString(),
      autor_id: note.autor_id,
      demanda_id: note.demanda_id || ''
    }));
    
    // Assign the properly typed notas array to the adapted demand
    adaptedDemand.notas = convertedNotas;
  } else {
    adaptedDemand.notas = [];
  }
  
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
  
  // Handle converting notes if needed - now converting from NoteType to NoteComponent properly
  if (demanda.notas && Array.isArray(demanda.notas)) {
    componentDemand.notas = demanda.notas.map(note => {
      // Convert from NoteType to NoteComponent
      const componentNote: NoteComponent = {
        id: note.id,
        titulo: note.titulo,
        conteudo: note.conteudo, // This is already required in NoteType, so it will always be present
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
