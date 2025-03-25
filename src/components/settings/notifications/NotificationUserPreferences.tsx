import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/components/ui/use-toast";
import { useNotifications } from "@/hooks/notifications";
import { useAuth } from "@/hooks/useSupabaseAuth";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Bell, Mail, MessageSquare } from "lucide-react";
import AttentionBox from "@/components/ui/attention-box";

interface NotificationPreferences {
  app: boolean;
  email: boolean;
  resumo_diario: boolean;
  frequencia?: string;
}

const NotificationUserPreferences: React.FC = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    app: true,
    email: true,
    resumo_diario: true,
  });
  const [frequency, setFrequency] = useState<string>("imediata");
  const { requestPermissionAndRegisterToken, isNotificationsSupported } = useNotifications();

  React.useEffect(() => {
    if (user) {
      loadUserPreferences();
    }
  }, [user]);

  const loadUserPreferences = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('usuarios')
        .select('configuracoes_notificacao')
        .eq('id', user?.id)
        .single();
      
      if (error) throw error;
      
      if (data?.configuracoes_notificacao) {
        const userPrefs = data.configuracoes_notificacao as NotificationPreferences;
        setPreferences({
          app: userPrefs.app ?? true,
          email: userPrefs.email ?? true,
          resumo_diario: userPrefs.resumo_diario ?? true
        });
        
        if (userPrefs.frequencia) {
          setFrequency(userPrefs.frequencia);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar preferências:', error);
      toast({
        title: "Erro ao carregar configurações",
        description: "Não foi possível carregar suas preferências de notificação.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const savePreferences = async () => {
    if (!user) return;
    
    try {
      setIsSaving(true);
      
      const updatedPreferences = {
        ...preferences,
        frequencia: frequency
      };
      
      const { error } = await supabase
        .from('usuarios')
        .update({ 
          configuracoes_notificacao: updatedPreferences
        })
        .eq('id', user.id);
      
      if (error) throw error;
      
      toast({
        title: "Preferências salvas",
        description: "Suas preferências de notificação foram atualizadas com sucesso.",
        variant: "success",
      });
    } catch (error) {
      console.error('Erro ao salvar preferências:', error);
      toast({
        title: "Erro ao salvar configurações",
        description: "Não foi possível salvar suas preferências de notificação.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const enableBrowserNotifications = async () => {
    const success = await requestPermissionAndRegisterToken();
    if (success) {
      setPreferences(prev => ({ ...prev, app: true }));
      toast({
        title: "Notificações do navegador ativadas",
        description: "Você receberá notificações diretamente neste dispositivo.",
        variant: "success",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Canais de Notificação</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Bell className="h-5 w-5 text-gray-500" />
                <Label htmlFor="app-notif" className="font-medium">
                  Notificações no aplicativo
                </Label>
              </div>
              <Switch 
                id="app-notif" 
                checked={preferences.app}
                onCheckedChange={(checked) => {
                  if (checked && isNotificationsSupported) {
                    enableBrowserNotifications();
                  } else {
                    setPreferences(prev => ({ ...prev, app: checked }));
                  }
                }}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Mail className="h-5 w-5 text-gray-500" />
                <Label htmlFor="email-notif" className="font-medium">
                  Notificações por e-mail
                </Label>
              </div>
              <Switch 
                id="email-notif" 
                checked={preferences.email}
                onCheckedChange={(checked) => 
                  setPreferences(prev => ({ ...prev, email: checked }))
                }
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <MessageSquare className="h-5 w-5 text-gray-500" />
                <Label htmlFor="resumo-notif" className="font-medium">
                  Receber resumo diário
                </Label>
              </div>
              <Switch 
                id="resumo-notif" 
                checked={preferences.resumo_diario}
                onCheckedChange={(checked) => 
                  setPreferences(prev => ({ ...prev, resumo_diario: checked }))
                }
              />
            </div>
          </div>
          
          {isNotificationsSupported === false && preferences.app && (
            <AttentionBox 
              title="Notificações não suportadas" 
              variant="warning"
            >
              Seu navegador não suporta notificações ou elas foram bloqueadas. 
              Verifique as permissões do seu navegador.
            </AttentionBox>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Frequência de Notificações</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <RadioGroup value={frequency} onValueChange={setFrequency}>
            <div className="flex items-center space-x-2 py-2">
              <RadioGroupItem value="imediata" id="imediata" />
              <Label htmlFor="imediata">Imediata (receber em tempo real)</Label>
            </div>
            <div className="flex items-center space-x-2 py-2">
              <RadioGroupItem value="agrupada" id="agrupada" />
              <Label htmlFor="agrupada">Agrupada (receber a cada hora)</Label>
            </div>
            <div className="flex items-center space-x-2 py-2">
              <RadioGroupItem value="diaria" id="diaria" />
              <Label htmlFor="diaria">Diária (receber uma vez ao dia)</Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>
      
      <div className="flex justify-end">
        <Button 
          onClick={savePreferences} 
          disabled={isSaving}
        >
          {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Salvar Preferências
        </Button>
      </div>
    </div>
  );
};

export default NotificationUserPreferences;
