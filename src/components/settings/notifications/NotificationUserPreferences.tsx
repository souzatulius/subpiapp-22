
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks/useSupabaseAuth';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2 } from 'lucide-react';

interface NotificationPreferences {
  app: boolean;
  email: boolean;
  whatsapp: boolean;
  resumo_diario: boolean;
  frequencia?: string;
}

interface FrequencyState {
  value: string;
  label: string;
}

interface NotificationUserPreferencesProps {
  channelType?: 'app' | 'email' | 'whatsapp';
}

const NotificationUserPreferences: React.FC<NotificationUserPreferencesProps> = ({ 
  channelType = 'app' 
}) => {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    app: true,
    email: true,
    whatsapp: false,
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
          whatsapp: configData.whatsapp !== undefined ? Boolean(configData.whatsapp) : false,
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
      case 'seis_horas':
        return 'A cada 6 horas';
      case 'diario':
        return 'Diário';
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
      setPreferences(newPreferences);
      
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
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
        <span className="ml-2 text-gray-500">Carregando preferências...</span>
      </div>
    );
  }

  const getChannelTitle = () => {
    switch(channelType) {
      case 'app': return 'Notificações no Aplicativo';
      case 'email': return 'Notificações por Email';
      case 'whatsapp': return 'Notificações por WhatsApp';
      default: return 'Preferências de Notificação';
    }
  }

  const getChannelDescription = () => {
    switch(channelType) {
      case 'app': return 'Receba notificações diretamente na plataforma';
      case 'email': return 'Receba notificações importantes por email';
      case 'whatsapp': return 'Receba notificações via WhatsApp';
      default: return 'Gerencie como deseja receber suas notificações';
    }
  }

  return (
    <Card className="border-0 shadow-none">
      <CardContent className="space-y-6 p-0">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor={`${channelType}-notifications`} className="text-base">
                {getChannelTitle()}
              </Label>
              <p className="text-sm text-muted-foreground">
                {getChannelDescription()}
              </p>
            </div>
            <Switch
              id={`${channelType}-notifications`}
              checked={preferences[channelType]}
              onCheckedChange={(value) => updatePreference(channelType as keyof NotificationPreferences, value)}
            />
          </div>

          {preferences[channelType] && (
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor={`${channelType}-daily-summary`} className="text-base">Resumo de Atividades</Label>
                <p className="text-sm text-muted-foreground">
                  Receba um resumo das atividades e notificações
                </p>
              </div>
              <Switch
                id={`${channelType}-daily-summary`}
                checked={preferences.resumo_diario}
                onCheckedChange={(value) => updatePreference('resumo_diario', value)}
              />
            </div>
          )}
        </div>

        {preferences[channelType] && preferences.resumo_diario && (
          <div>
            <Label htmlFor={`${channelType}-frequency-select`} className="text-base mb-2 block">
              Frequência do Resumo
            </Label>
            <Select
              value={frequency.value}
              onValueChange={updateFrequency}
            >
              <SelectTrigger id={`${channelType}-frequency-select`} className="w-full">
                <SelectValue placeholder={frequency.label} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="imediata">Imediata</SelectItem>
                <SelectItem value="seis_horas">A cada 6 horas</SelectItem>
                <SelectItem value="diario">Diário</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NotificationUserPreferences;
