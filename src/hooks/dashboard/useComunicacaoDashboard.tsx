
import React, { useState, useEffect, useCallback } from 'react';
import { ActionCardItem } from '@/types/dashboard';
import { getCommunicationActionCards } from '@/hooks/dashboard/defaultCards';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { supabase } from '@/integrations/supabase/client';
import { useAutosaveDashboard } from '@/hooks/dashboard/useAutosaveDashboard';

export const useComunicacaoDashboard = (
  user: any,
  isPreview = false,
  department = 'comunicacao'
) => {
  const userId = user?.id;
  const [isEditMode, setIsEditMode] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<ActionCardItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [specialCardsData, setSpecialCardsData] = useState({
    overdueCount: 0,
    overdueItems: [],
    notesToApprove: 0,
    responsesToDo: 0,
    isLoading: true,
    coordenacaoId: '',
    usuarioId: ''
  });

  // Get default cards for this department
  const defaultCards = getCommunicationActionCards();
  
  // Use the autosave hook
  const {
    cards,
    isSaving,
    lastSaved,
    handleCardsReorder,
    handleSaveCardEdit,
    handleCardHide,
    resetDashboard
  } = useAutosaveDashboard(userId, department, defaultCards);

  const toggleEditMode = useCallback(() => {
    setIsEditMode(prev => !prev);
  }, []);

  const handleCardEdit = useCallback((card: ActionCardItem) => {
    setSelectedCard(card);
    setIsEditModalOpen(true);
  }, []);

  useEffect(() => {
    // Focus on loading special cards data (pending demands, notes to approve, etc.)
    const loadSpecialCardsData = async () => {
      if (isPreview || !userId) {
        setIsLoading(false);
        return;
      }

      try {
        // Get user's coordenacao
        const { data: userData, error: userError } = await supabase
          .from('usuarios')
          .select('coordenacao_id')
          .eq('id', userId)
          .single();

        if (userError) throw userError;

        const coordenacaoId = userData?.coordenacao_id;

        // Todo: Load other data like overdue demands, notes to approve, etc.
        const overdueCount = 0; // Placeholder
        const notesToApprove = 0; // Placeholder
        const responsesToDo = 0; // Placeholder

        setSpecialCardsData({
          overdueCount,
          overdueItems: [],
          notesToApprove,
          responsesToDo,
          isLoading: false,
          coordenacaoId: coordenacaoId || '',
          usuarioId: userId
        });

      } catch (error) {
        console.error('Error loading special cards data:', error);
        setSpecialCardsData(prev => ({ ...prev, isLoading: false }));
      }

      setIsLoading(false);
    };

    loadSpecialCardsData();
  }, [userId, isPreview]);

  // Return everything the dashboard needs
  return {
    cards,
    isEditMode,
    isEditModalOpen,
    selectedCard,
    isLoading,
    isSaving,
    lastSaved,
    specialCardsData,
    handleCardEdit,
    handleCardHide,
    toggleEditMode,
    handleSaveCardEdit,
    setIsEditModalOpen,
    handleCardsReorder,
    resetDashboard
  };
};
