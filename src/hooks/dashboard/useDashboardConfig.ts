import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ActionCardItem } from '@/types/dashboard';
import { toast } from '@/hooks/use-toast';

export interface DashboardConfigResult {
  config: ActionCardItem[];
  isLoading: boolean;
  isSaving: boolean;
  saveConfig: (cards: ActionCardItem[], departmentId?: string) => Promise<boolean>;
}

export const useDashboardConfig = (
  department: string = 'default',
  viewType: 'dashboard' | 'communication' = 'dashboard'
): DashboardConfigResult => {
  const [config, setConfig] = useState<ActionCardItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const fetchDashboardConfig = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('department_dashboards')
        .select('cards_config')
        .eq('department', department)
        .eq('view_type', viewType)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Erro ao buscar config:', error);
        setConfig([]);
      } else if (data?.cards_config) {
        try {
          const raw = JSON.parse(data.cards_config) as unknown;
          const parsedCards = Array.isArray(raw) ? (raw as ActionCardItem[]) : [];
          setConfig(parsedCards);
        } catch (parseError) {
          console.error('Erro ao fazer parse da config:', parseError);
          setConfig([]);
        }
      } else {
        setConfig([]);
      }
    } catch (err) {
      console.error('Erro inesperado ao buscar config:', err);
      setConfig([]);
    } finally {
      setIsLoading(false);
    }
  }, [department, viewType]);

  useEffect(() => {
    fetchDashboardConfig();
  }, [fetchDashboardConfig]);

  const saveConfig = async (cards: ActionCardItem[], departmentId: string = department) => {
    setIsSaving(true);
    try {
      const { data: existingConfig, error: checkError } = await supabase
        .from('department_dashboards')
        .select('id')
        .eq('department', departmentId)
        .eq('view_type', viewType)
        .maybeSingle();

      if (checkError && checkError.code !== 'PGRST116') {
        console.error('Erro ao verificar config existente:', checkError);
        setIsSaving(false);
        return false;
      }

      const cardsJson = JSON.stringify(cards);

      if (existingConfig) {
        const { error: updateError } = await supabase
          .from('department_dashboards')
          .update({ cards_config: cardsJson })
          .eq('id', existingConfig.id);

        if (updateError) {
          toast({
            title: 'Erro ao salvar dashboard',
            description: 'Não foi possível salvar a configuração.',
            variant: 'destructive'
          });
          setIsSaving(false);
          return false;
        }
      } else {
        const { error: insertError } = await supabase
          .from('department_dashboards')
          .insert({
            department: departmentId,
            view_type: viewType,
            cards_config: cardsJson
          });

        if (insertError) {
          toast({
            title: 'Erro ao criar dashboard',
            description: 'Não foi possível criar a configuração.',
            variant: 'destructive'
          });
          setIsSaving(false);
          return false;
        }
      }

      toast({
        title: 'Dashboard salvo',
        description: 'As configurações foram salvas com sucesso.'
      });

      setIsSaving(false);
      return true;
    } catch (err) {
      console.error('Erro ao salvar config:', err);
      toast({
        title: 'Erro inesperado',
        description: 'Não foi possível
