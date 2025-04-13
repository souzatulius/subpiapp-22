
import React, { useState, useEffect, useCallback } from 'react';
import { ActionCardItem } from '@/types/dashboard';
import { getCommunicationActionCards } from '@/hooks/dashboard/getCommunicationActionCards';
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
  
  // Use the autosave hook with 'communication' dashboard type
  const {
    cards,
    isSaving,
    lastSaved,
    hasUnsavedChanges,
    handleCardsReorder,
    handleSaveCardEdit,
    handleCardHide,
    resetDashboard,
    saveNow
  } = useAutosaveDashboard(userId, department, defaultCards, 'communication');

  const toggleEditMode = useCallback(() => {
    setIsEditMode(prev => !prev);
  }, []);

  const handleCardEdit = useCallback((card: ActionCardItem) => {
    setSelectedCard(card);
    setIsEditModalOpen(true);
  }, []);

  // Use useCallback for expensive operations to avoid unnecessary re-renders
  const loadSpecialCardsData = useCallback(async () => {
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
        .maybeSingle();

      if (userError) throw userError;

      const coordenacaoId = userData?.coordenacao_id;

      // Todo: Load other data like overdue demands, notes to approve, etc.
      // For now we'll use placeholder data
      const overdueCount = 0; 
      const notesToApprove = 0;
      const responsesToDo = 0;

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
  }, [userId, isPreview]);

  useEffect(() => {
    loadSpecialCardsData();
  }, [loadSpecialCardsData]);

  // Return everything the dashboard needs
  return {
    cards,
    isEditMode: true, // Set to true to enable drag functionality permanently
    isEditModalOpen,
    selectedCard,
    isLoading,
    isSaving,
    lastSaved,
    hasUnsavedChanges,
    specialCardsData,
    handleCardEdit,
    handleCardHide,
    toggleEditMode,
    handleSaveCardEdit,
    setIsEditModalOpen,
    handleCardsReorder,
    resetDashboard,
    saveNow
  };
};
