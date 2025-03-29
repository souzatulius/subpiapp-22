
import { ReactNode } from 'react';

// Dados do Supabase - Tabela user_dashboard
export interface UserDashboard {
  id: string;
  user_id: string;
  cards_config: string; // JSON armazenado como string
  created_at: string;
  updated_at: string;
}

// Representação de um card serializável (sem ReactNode)
export interface SerializableCard {
  id: string;
  title: string;
  path: string;
  color: string;
  iconId: string;
  width?: '25' | '50' | '75' | '100';
  height?: '1' | '2';
  isCustom?: boolean;
  isQuickDemand?: boolean;
  isSearch?: boolean;
  isNewCardButton?: boolean;
  isOverdueDemands?: boolean;
  isPendingActions?: boolean;
  type?: 'standard' | 'data_dynamic';
  dataSourceKey?: string;
  allowedDepartments?: string[];
  allowedRoles?: string[];
  displayMobile?: boolean;
  mobileOrder?: number;
}

// Interface para o uso dentro do React com o ícone renderizado
export interface ActionCardItem extends Omit<SerializableCard, 'iconId'> {
  icon: ReactNode;
  iconId: string; // ainda necessário para edição
  // Make sure all properties from SerializableCard are included here as well
  // Adding explicit definitions for properties used in CardGrid component
  displayMobile?: boolean;
  mobileOrder?: number;
  type?: 'standard' | 'data_dynamic';
  dataSourceKey?: string;
}

// Esquema do formulário com todos os campos que aparecem no CardFormFields
export interface FormSchema {
  title: string;
  type?: 'standard' | 'data_dynamic';
  dataSourceKey?: string;
  path?: string;
  color: 'blue' | 'green' | 'orange' | 'gray-light' | 'gray-dark' | 'blue-dark' | 'orange-light' | 'gray-ultra-light' | 'lime' | 'orange-600';
  iconId: string;
  width?: '25' | '50' | '75' | '100';
  height?: '1' | '2';
  allowedDepartments?: string[];
  allowedRoles?: string[];
  displayMobile?: boolean;
  mobileOrder?: number;
}

// Interface do hook do dashboard (completa)
export interface DashboardStateReturn {
  firstName: string;
  actionCards: ActionCardItem[];
  setActionCards: React.Dispatch<React.SetStateAction<ActionCardItem[]>>;
  isCustomizationModalOpen: boolean;
  setIsCustomizationModalOpen: (isOpen: boolean) => void;
  editingCard: ActionCardItem | null;
  handleDeleteCard: (id: string) => void;
  handleAddNewCard: () => void;
  handleEditCard: (card: ActionCardItem) => void;
  handleSaveCard: (cardData: Omit<ActionCardItem, 'id' | 'icon'>) => void;

  // Quick demand
  newDemandTitle: string;
  setNewDemandTitle: (value: string) => void;
  handleQuickDemandSubmit: () => void;

  // Busca
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  handleSearchSubmit: (query: string) => void;

  // Dados especiais
  specialCardsData: {
    overdueCount: number;
    overdueItems: { title: string; id: string }[];
    notesToApprove: number;
    responsesToDo: number;
    isLoading: boolean;
  };
}
