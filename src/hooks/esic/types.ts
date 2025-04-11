
import { ESICProcesso, ESICProcessoFormValues, ESICJustificativaFormValues } from '@/types/esic';

export type ScreenState = 'list' | 'create' | 'edit' | 'view' | 'justify';

export interface ESICStateReturn {
  screen: ScreenState;
  setScreen: (screen: ScreenState) => void;
  deleteConfirmOpen: boolean;
  processoToDelete: string | null;
  processos: ESICProcesso[];
  isLoading: boolean;
  error: string | null;
  selectedProcesso: ESICProcesso | null;
  justificativas: any[];
  isJustificativasLoading: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  isJustificativaCreating: boolean;
  isGenerating: boolean;
  resetDeleteDialogState: () => void;
  handleCreateProcesso: (values: ESICProcessoFormValues) => Promise<void>;
  handleUpdateProcesso: (values: ESICProcessoFormValues) => Promise<void>;
  handleDeleteProcesso: (id: string) => void;
  confirmDeleteProcesso: () => void;
  handleViewProcesso: (processo: ESICProcesso) => void;
  handleEditProcesso: (processo: ESICProcesso) => void;
  handleAddJustificativa: () => void;
  handleCreateJustificativa: (values: ESICJustificativaFormValues) => Promise<void>;
  handleGenerateJustificativa: (rascunho?: string) => Promise<void>;
  handleUpdateStatus: (status: 'novo_processo' | 'aguardando_justificativa' | 'aguardando_aprovacao' | 'concluido') => void;
  handleUpdateSituacao: (situacao: 'em_tramitacao' | 'prazo_prorrogado' | 'concluido') => void;
  fetchProcessos: () => Promise<void>;
  generatedJustificativaText?: string;
  setGeneratedJustificativaText: (text: string) => void;
}
