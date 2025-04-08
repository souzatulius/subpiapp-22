
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, Mail, Phone, Info } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { useToast } from '@/components/ui/use-toast';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useNotifications } from '@/hooks/notifications';

interface NotificationPreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type FrequencyType = 'imediata' | 'periodica' | 'diaria';
type ChannelType = 'app' | 'email' | 'whatsapp';

interface NotificationPreferences {
  app: boolean;
  email: boolean;
  whatsapp: boolean;
  frequency: {
    app: FrequencyType;
    email: FrequencyType;
    whatsapp: FrequencyType;
  };
}

const NotificationPreferencesModal: React.FC<NotificationPreferencesModalProps> = ({
  isOpen,
  onClose
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<ChannelType>('app');
  const [isLoading, setIsLoading] = useState(false);
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    app: true,
    email: true,
    whatsapp: false,
    frequency: {
      app: 'imediata',
      email: 'diaria',
      whatsapp: 'periodica'
    }
  });
  
  const { requestPermissionAndRegisterToken, isNotificationsSupported } = useNotifications();

  useEffect(() => {
    if (user) {
      fetchPreferences();
    }
  }, [user]);

  const fetchPreferences = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('usuarios')
        .select('configuracoes_notificacao')
        .eq('id', user.id)
        .single();
      
      if (error) throw error;
      
      if (data?.configuracoes_notificacao) {
        setPreferences({
          app: data.configuracoes_notificacao.app ?? true,
          email: data.configuracoes_notificacao.email ?? true,
          whatsapp: data.configuracoes_notificacao.whatsapp ?? false,
          frequency: {
            app: data.configuracoes_notificacao.frequency?.app || 'imediata',
            email: data.configuracoes_notificacao.frequency?.email || 'diaria',
            whatsapp: data.configuracoes_notificacao.frequency?.whatsapp || 'periodica'
          }
        });
      }
    } catch (error) {
      console.error('Erro ao buscar preferências:', error);
      toast({
        title: 'Erro ao carregar preferências',
        description: 'Não foi possível carregar suas preferências de notificação.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const savePreferences = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      
      const { error } = await supabase
        .from('usuarios')
        .update({
          configuracoes_notificacao: preferences
        })
        .eq('id', user.id);
      
      if (error) throw error;
      
      // If app notifications are enabled, request permission
      if (preferences.app && isNotificationsSupported) {
        await requestPermissionAndRegisterToken();
      }
      
      toast({
        title: 'Preferências salvas',
        description: 'Suas preferências de notificação foram atualizadas com sucesso.'
      });
      
      onClose();
    } catch (error) {
      console.error('Erro ao salvar preferências:', error);
      toast({
        title: 'Erro ao salvar preferências',
        description: 'Não foi possível salvar suas preferências de notificação.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleChannel = (channel: ChannelType, enabled: boolean) => {
    setPreferences(prev => ({
      ...prev,
      [channel]: enabled
    }));
  };

  const handleFrequencyChange = (channel: ChannelType, frequency: FrequencyType) => {
    setPreferences(prev => ({
      ...prev,
      frequency: {
        ...prev.frequency,
        [channel]: frequency
      }
    }));
  };

  const renderFrequencyOptions = (channel: ChannelType) => {
    if (!preferences[channel]) return null;
    
    return (
      <div className="mt-4 space-y-4">
        <RadioGroup 
          value={preferences.frequency[channel]} 
          onValueChange={(value) => handleFrequencyChange(channel, value as FrequencyType)}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="imediata" id={`${channel}-immediate`} />
            <Label htmlFor={`${channel}-immediate`}>Imediata (receba assim que houver atualização)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="periodica" id={`${channel}-periodic`} />
            <Label htmlFor={`${channel}-periodic`}>Periódica (receba a cada 6 horas)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="diaria" id={`${channel}-daily`} />
            <Label htmlFor={`${channel}-daily`}>Resumo diário (receba um resumo ao final do dia)</Label>
          </div>
        </RadioGroup>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Preferências de Notificações</DialogTitle>
          <DialogDescription>
            Configure como deseja receber notificações e alertas do sistema
          </DialogDescription>
        </DialogHeader>
        
        <Separator className="my-2" />
        
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as ChannelType)} className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="app" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              App
            </TabsTrigger>
            <TabsTrigger value="email" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email
            </TabsTrigger>
            <TabsTrigger value="whatsapp" className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              WhatsApp
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="app" className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Notificações no Navegador</CardTitle>
                <CardDescription>
                  Receba notificações diretamente no seu navegador, mesmo quando estiver em outras abas.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="app-notifications" 
                    checked={preferences.app}
                    onCheckedChange={(checked) => handleToggleChannel('app', checked)}
                  />
                  <Label htmlFor="app-notifications">Ativar notificações no navegador</Label>
                </div>
                
                {!isNotificationsSupported && (
                  <div className="mt-3 flex items-start space-x-2 text-sm text-amber-600 bg-amber-50 p-3 rounded-md">
                    <Info className="h-4 w-4 mt-0.5" />
                    <span>Seu navegador não suporta notificações ou você ainda não concedeu permissão.</span>
                  </div>
                )}

                {renderFrequencyOptions('app')}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="email" className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Notificações por Email</CardTitle>
                <CardDescription>
                  Receba alertas e atualizações importantes por email.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="email-notifications" 
                    checked={preferences.email}
                    onCheckedChange={(checked) => handleToggleChannel('email', checked)}
                  />
                  <Label htmlFor="email-notifications">Ativar notificações por email</Label>
                </div>
                
                {renderFrequencyOptions('email')}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="whatsapp" className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Notificações por WhatsApp</CardTitle>
                <CardDescription>
                  Receba alertas e atualizações importantes por WhatsApp.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="whatsapp-notifications" 
                    checked={preferences.whatsapp}
                    onCheckedChange={(checked) => handleToggleChannel('whatsapp', checked)}
                  />
                  <Label htmlFor="whatsapp-notifications">Ativar notificações por WhatsApp</Label>
                </div>
                
                {renderFrequencyOptions('whatsapp')}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <DialogFooter className="mt-4">
          <Button 
            variant="outline" 
            onClick={onClose}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button 
            onClick={savePreferences}
            disabled={isLoading}
          >
            {isLoading ? 'Salvando...' : 'Salvar Preferências'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NotificationPreferencesModal;
