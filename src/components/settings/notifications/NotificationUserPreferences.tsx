
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { supabase } from '@/integrations/supabase/client';
import { ToggleLeft } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks/useSupabaseAuth';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface NotificationPreferences {
  app: boolean;
  email: boolean;
  resumo_diario: boolean;
  frequencia?: string;
}

interface FrequencyState {
  value: string;
  label: string;
}

const NotificationUserPreferences = () => {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    app: true,
    email: true,
    resumo_diario: true,
  });
  const [frequency, setFrequency] = useState<FrequencyState>({
    value: 'diario',
    label: 'Diário',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserPreferences();
    }
  }, [user]);

  const fetchUserPreferences = async () => {
    try {
      const { data, error } = await supabase
        .from('usuarios')
        .select('configuracoes_notificacao')
        .eq('id', user?.id)
        .single();

      if (error) throw error;

      if (data && data.configuracoes_notificacao) {
        // Cast to the correct type and handle safely
        const configData = data.configuracoes_notificacao as Record<string, any>;
        
        setPreferences({
          app: configData.app !== undefined ? Boolean(configData.app) : true,
          email: configData.email !== undefined ? Boolean(configData.email) : true,
          resumo_diario: configData.resumo_diario !== undefined ? Boolean(configData.resumo_diario) : true,
          frequencia: typeof configData.frequencia === 'string' ? configData.frequencia : 'diario',
        });

        // Set frequency from the data
        const frequencyValue = typeof configData.frequencia === 'string' ? configData.frequencia : 'diario';
        setFrequency({
          value: frequencyValue,
          label: getFrequencyLabel(frequencyValue),
        });
      }
    } catch (error) {
      console.error('Erro ao buscar preferências:', error);
    } finally {
      setLoading(false);
    }
  };

  const getFrequencyLabel = (value: string): string => {
    switch (value) {
      case 'imediata':
        return 'Imediata';
      case 'diario':
        return 'Diário';
      case 'semanal':
        return 'Semanal';
      default:
        return 'Diário';
    }
  };

  const updatePreference = async (key: keyof NotificationPreferences, value: boolean) => {
    try {
      const newPreferences = { ...preferences, [key]: value };
      setPreferences(newPreferences);

      const { error } = await supabase
        .from('usuarios')
        .update({
          configuracoes_notificacao: newPreferences,
        })
        .eq('id', user?.id);

      if (error) throw error;

      toast({
        title: 'Preferências atualizadas',
        description: 'Suas preferências de notificação foram atualizadas com sucesso.',
      });
    } catch (error) {
      console.error('Erro ao atualizar preferências:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar suas preferências. Tente novamente.',
        variant: 'destructive',
      });
    }
  };

  const updateFrequency = async (value: string) => {
    try {
      const label = getFrequencyLabel(value);
      setFrequency({ value, label });

      const newPreferences = { ...preferences, frequencia: value };
      
      const { error } = await supabase
        .from('usuarios')
        .update({
          configuracoes_notificacao: newPreferences,
        })
        .eq('id', user?.id);

      if (error) throw error;

      toast({
        title: 'Frequência atualizada',
        description: `Agora você receberá resumos ${label.toLowerCase()}.`,
      });
    } catch (error) {
      console.error('Erro ao atualizar frequência:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar a frequência. Tente novamente.',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return <div>Carregando preferências...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Preferências de Notificação</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="app-notifications" className="text-base">Notificações no Aplicativo</Label>
              <p className="text-sm text-muted-foreground">
                Receba notificações diretamente na plataforma
              </p>
            </div>
            <Switch
              id="app-notifications"
              checked={preferences.app}
              onCheckedChange={(value) => updatePreference('app', value)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="email-notifications" className="text-base">Notificações por Email</Label>
              <p className="text-sm text-muted-foreground">
                Receba notificações importantes por email
              </p>
            </div>
            <Switch
              id="email-notifications"
              checked={preferences.email}
              onCheckedChange={(value) => updatePreference('email', value)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="daily-summary" className="text-base">Resumo de Atividades</Label>
              <p className="text-sm text-muted-foreground">
                Receba um resumo das atividades e notificações
              </p>
            </div>
            <Switch
              id="daily-summary"
              checked={preferences.resumo_diario}
              onCheckedChange={(value) => updatePreference('resumo_diario', value)}
            />
          </div>
        </div>

        {preferences.resumo_diario && (
          <div>
            <Label htmlFor="frequency-select" className="text-base mb-2 block">
              Frequência do Resumo
            </Label>
            <Select
              value={frequency.value}
              onValueChange={updateFrequency}
            >
              <SelectTrigger id="frequency-select">
                <SelectValue placeholder={frequency.label} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="imediata">Imediata</SelectItem>
                <SelectItem value="diario">Diário</SelectItem>
                <SelectItem value="semanal">Semanal</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NotificationUserPreferences;
