
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
} from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  AlertCircle, 
  CheckIcon, 
  ChevronDownIcon, 
  Loader2, 
  Mail, 
  MessagesSquare, 
  RefreshCw, 
  SaveIcon 
} from 'lucide-react';
import { useNotifications } from '@/hooks/useNotifications';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface UserNotificationPreferences {
  app: boolean;
  email: boolean;
  resumo_diario: boolean;
  [key: string]: boolean;
}

const NotificationUserPreferences: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [preferences, setPreferences] = useState<UserNotificationPreferences>({
    app: true,
    email: true,
    resumo_diario: true
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const {
    isNotificationsSupported,
    notificationsPermission,
    requestPermissionAndRegisterToken,
    fcmToken
  } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const [isTokenShown, setIsTokenShown] = useState(false);

  // Load user preferences
  useEffect(() => {
    if (user) {
      fetchUserPreferences();
    }
  }, [user]);

  const fetchUserPreferences = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('usuarios')
        .select('configuracoes_notificacao')
        .eq('id', user.id)
        .single();
      
      if (error) throw error;
      
      if (data && data.configuracoes_notificacao) {
        setPreferences(data.configuracoes_notificacao);
      }
    } catch (error) {
      console.error('Erro ao carregar preferências de notificações:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar suas preferências de notificações.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const savePreferences = async () => {
    if (!user) return;
    
    try {
      setIsSaving(true);
      
      const { error } = await supabase
        .from('usuarios')
        .update({ configuracoes_notificacao: preferences })
        .eq('id', user.id);
        
      if (error) throw error;
      
      toast({
        title: "Sucesso",
        description: "Suas preferências de notificações foram atualizadas.",
      });
    } catch (error) {
      console.error('Erro ao salvar preferências de notificações:', error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar suas preferências de notificações.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggle = (key: string, value: boolean) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const enablePushNotifications = async () => {
    try {
      const success = await requestPermissionAndRegisterToken();
      
      if (success) {
        handleToggle('app', true);
        toast({
          title: "Notificações ativadas",
          description: "As notificações push foram ativadas com sucesso.",
        });
      } else {
        toast({
          title: "Erro",
          description: "Não foi possível ativar as notificações push.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Erro ao ativar notificações push:', error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao ativar as notificações push.",
        variant: "destructive"
      });
    }
  };

  const renderPushNotificationOptions = () => {
    if (!isNotificationsSupported) {
      return (
        <Alert variant="warning" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Notificações não suportadas</AlertTitle>
          <AlertDescription>
            Seu navegador não suporta notificações push. Tente usar um navegador moderno como Chrome, Firefox ou Edge.
          </AlertDescription>
        </Alert>
      );
    }
    
    if (notificationsPermission === 'denied') {
      return (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Permissão negada</AlertTitle>
          <AlertDescription>
            As notificações estão bloqueadas. Habilite-as nas configurações do seu navegador.
          </AlertDescription>
        </Alert>
      );
    }
    
    return (
      <div className="flex items-center justify-between">
        <div>
          <Label htmlFor="toggle-app" className="font-medium">
            Notificações Push
          </Label>
          <p className="text-sm text-muted-foreground mt-1">
            Receba notificações direto no seu navegador
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          {notificationsPermission !== 'granted' ? (
            <Button
              size="sm"
              onClick={enablePushNotifications}
              className="flex items-center gap-2"
            >
              Ativar
            </Button>
          ) : (
            <Switch
              id="toggle-app"
              checked={preferences.app}
              onCheckedChange={(checked) => handleToggle('app', checked)}
            />
          )}
        </div>
      </div>
    );
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
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Minhas Preferências de Notificações</h3>
        
        <Button 
          onClick={savePreferences} 
          disabled={isSaving} 
          className="flex items-center gap-2"
        >
          {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <SaveIcon className="h-4 w-4" />}
          Salvar Preferências
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Canais de Notificações</CardTitle>
          <CardDescription>
            Escolha como deseja receber suas notificações
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Notificações Push */}
          {renderPushNotificationOptions()}
          
          <Separator />
          
          {/* Notificações por Email */}
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="toggle-email" className="font-medium">
                Notificações por Email
              </Label>
              <p className="text-sm text-muted-foreground mt-1">
                Receba notificações importantes no seu email
              </p>
            </div>
            
            <Switch
              id="toggle-email"
              checked={preferences.email}
              onCheckedChange={(checked) => handleToggle('email', checked)}
            />
          </div>
          
          <Separator />
          
          {/* Resumo Diário */}
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="toggle-resumo" className="font-medium">
                Resumo Diário
              </Label>
              <p className="text-sm text-muted-foreground mt-1">
                Receba um resumo diário de todas as atividades
              </p>
            </div>
            
            <Switch
              id="toggle-resumo"
              checked={preferences.resumo_diario}
              onCheckedChange={(checked) => handleToggle('resumo_diario', checked)}
            />
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between flex-col sm:flex-row gap-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <CheckIcon className="h-4 w-4 text-green-500" />
            Suas preferências serão aplicadas a todas as notificações
          </div>
          
          <Button
            variant="link"
            size="sm"
            className="p-0 h-auto text-xs"
            onClick={() => setIsOpen(!isOpen)}
          >
            Detalhes Técnicos
            <ChevronDownIcon className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </Button>
        </CardFooter>
      </Card>
      
      {/* Detalhes técnicos */}
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleContent className="bg-muted rounded-md p-4 mt-4 space-y-4">
          <h4 className="text-sm font-medium">Informações Técnicas</h4>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Status das notificações push:</span>
              <span className="font-mono">
                {notificationsPermission === 'granted' ? 'Permitido' : 
                 notificationsPermission === 'denied' ? 'Negado' : 'Não decidido'}
              </span>
            </div>
            
            <div className="flex justify-between text-sm">
              <span>Navegador suporta notificações:</span>
              <span className="font-mono">{isNotificationsSupported ? 'Sim' : 'Não'}</span>
            </div>
            
            <div className="flex justify-between text-sm">
              <span>Token FCM:</span>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs truncate max-w-[150px]">
                  {isTokenShown ? (fcmToken || 'Não disponível') : '•••••••••••••••••••••'}
                </span>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6" 
                  onClick={() => setIsTokenShown(!isTokenShown)}
                >
                  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-3 w-3">
                    <path d={isTokenShown ? 
                      "M3.30608 2.40884C3.5299 2.75068 3.51802 3.223 3.27284 3.55478C2.52441 4.56899 2.08601 5.76999 2.08601 7.05001C2.08601 10.5687 4.93735 13.42 8.45605 13.42C11.9747 13.42 14.8261 10.5687 14.8261 7.05001C14.8261 5.76999 14.3877 4.56899 13.6392 3.55478C13.3941 3.223 13.3822 2.75068 13.606 2.40884C13.8406 2.05024 14.3003 1.91737 14.6678 2.15305C15.6948 3.41595 16.304 5.15159 16.304 7.05001C16.304 11.3851 12.7911 14.898 8.45605 14.898C4.121 14.898 0.608032 11.3851 0.608032 7.05001C0.608032 5.15159 1.21721 3.41595 2.24425 2.15305C2.61182 1.91737 3.07148 2.05024 3.30608 2.40884ZM8.45605 0.0500126C8.97123 0.0500126 9.38805 0.46683 9.38805 0.982008V7.05001C9.38805 7.56518 8.97123 7.982 8.45605 7.982C7.94088 7.982 7.52405 7.56518 7.52405 7.05001V0.982008C7.52405 0.46683 7.94088 0.0500126 8.45605 0.0500126Z" : 
                      "M0.0518437 7.05001C0.0518437 3.57401 2.90319 0.722656 6.3792 0.722656C9.8552 0.722656 12.7066 3.57401 12.7066 7.05001C12.7066 10.526 9.8552 13.3774 6.3792 13.3774C2.90319 13.3774 0.0518437 10.526 0.0518437 7.05001ZM6.3792 2.1914C3.70626 2.1914 1.52059 4.37707 1.52059 7.05001C1.52059 9.72296 3.70626 11.9086 6.3792 11.9086C9.05215 11.9086 11.2378 9.72296 11.2378 7.05001C11.2378 4.37707 9.05215 2.1914 6.3792 2.1914ZM12.4888 0.778428C12.4888 0.390969 12.8023 0.0773926 13.1898 0.0773926C13.5773 0.0773926 13.8909 0.390969 13.8909 0.778428V13.3216C13.8909 13.7091 13.5773 14.0226 13.1898 14.0226C12.8023 14.0226 12.4888 13.7091 12.4888 13.3216V0.778428Z"} fill="currentColor" />
                  </svg>
                </Button>
              </div>
            </div>
          </div>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full text-xs"
            onClick={fetchUserPreferences}
          >
            <RefreshCw className="h-3 w-3 mr-2" />
            Recarregar Configurações
          </Button>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default NotificationUserPreferences;
