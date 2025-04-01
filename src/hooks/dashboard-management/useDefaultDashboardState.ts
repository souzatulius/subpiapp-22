import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ActionCardItem } from '@/types/dashboard';
import { toast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';

interface SpecialCardsData {
  overdueCount: number;
  overdueItems: { title: string; id: string }[];
  notesToApprove: number;
  responsesToDo: number;
  isLoading: boolean;
  version?: string;
}

interface UseDefaultDashboardStateResult {
  cards: ActionCardItem[];
  setCards: (cards: ActionCardItem[]) => void;
  handleDeleteCard: (cardId: string) => void;
  handleEditCard: (card: ActionCardItem) => void;
  hideCard: (cardId: string) => void;
  showCard: (cardId: string) => void;
  reorderCards: (reordered: ActionCardItem[]) => void;
  saveCards: () => Promise<boolean>;
  loading: boolean;
  departmentName: string;
  specialCardsData: SpecialCardsData;
}

export const useDefaultDashboardState = (departmentId: string): UseDefaultDashboardStateResult => {
  const [cards, setCards] = useState<ActionCardItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [departmentName, setDepartmentName] = useState('');
  const [specialCardsData, setSpecialCardsData] = useState<SpecialCardsData>({
    overdueCount: 0,
    overdueItems: [],
    notesToApprove: 0,
    responsesToDo: 0,
    isLoading: false,
    version: '1.0'
  });

  // Load cards from Supabase
  useEffect(() => {
    const fetchCards = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('department_dashboards')
          .select('cards_config')
          .eq('department', departmentId)
          .eq('view_type', 'dashboard')
          .maybeSingle();

        if (error && error.code !== 'PGRST116') throw error;

        const parsed: ActionCardItem[] = data?.cards_config
          ? JSON.parse(data.cards_config)
          : generateDefaultCards();

        // Ensure version field is present
        const withVersion = parsed.map(card => ({
          ...card,
          version: card.version || '1.0'
        }));

        setCards(withVersion);
      } catch (err) {
        console.error('Erro ao carregar cards:', err);
        setCards(generateDefaultCards());
      } finally {
        setLoading(false);
      }
    };

    fetchCards();
  }, [departmentId]);

  // Load department name
  useEffect(() => {
    const fetchDepartmentName = async () => {
      try {
        const { data, error } = await supabase
          .from('coordenacoes')
          .select('descricao')
          .eq('id', departmentId)
          .single();

        if (!error && data) {
          setDepartmentName(data.descricao);
        }
      } catch (err) {
        console.error('Erro ao carregar nome da coordenação:', err);
      }
    };

    fetchDepartmentName();
  }, [departmentId]);

  const saveCards = async (): Promise<boolean> => {
    try {
      const cardsToSave = cards.map(card => ({
        ...card,
        version: card.version || '1.0'
      }));

      const { error } = await supabase
        .from('department_dashboards')
        .upsert({
          department: departmentId,
          view_type: 'dashboard',
          cards_config: JSON.stringify(cardsToSave),
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'department,view_type'
        });

      if (error) throw error;

      toast({
        title: 'Dashboard salvo',
        description: 'As alterações foram salvas com sucesso.',
        variant: 'success'
      });

      return true;
    } catch (err) {
      console.error('Erro ao salvar dashboard:', err);
      toast({
        title: 'Erro',
        description: 'Não foi possível salvar as alterações.',
        variant: 'destructive'
      });
      return false;
    }
  };

  const handleDeleteCard = (cardId: string) => {
    setCards(prev => prev.filter(card => card.id !== cardId));
  };

  const handleEditCard = (card: ActionCardItem) => {
    // Aqui você pode abrir um modal ou setar `editingCard`, se necessário
    console.log('Editar card:', card);
  };

  const hideCard = (cardId: string) => {
    setCards(prev =>
      prev.map(card =>
        card.id === cardId ? { ...card, hidden: true } : card
      )
    );
  };

  const showCard = (cardId: string) => {
    setCards(prev =>
      prev.map(card =>
        card.id === cardId ? { ...card, hidden: false } : card
      )
    );
  };

  const reorderCards = (reordered: ActionCardItem[]) => {
    setCards(reordered);
  };

  return {
    cards,
    setCards,
    handleDeleteCard,
    handleEditCard,
    hideCard,
    showCard,
    reorderCards,
    saveCards,
    loading,
    departmentName,
    specialCardsData
  };
};

// Gerador básico de cards padrão
const generateDefaultCards = (): ActionCardItem[] => {
  return [
    {
      id: uuidv4(),
      title: 'Consultar Demandas',
      iconId: 'Search',
      path: '/demandas',
      color: 'blue',
      width: '25',
      height: '1',
      type: 'standard',
      isCustom: false,
      displayMobile: true,
      mobileOrder: 1
    }
  ];
};
