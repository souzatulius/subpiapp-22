
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { useNotifications } from '@/hooks/notifications';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { BellRing, BellOff } from 'lucide-react';

interface AccountSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NotificationPreferences {
  app: boolean;
  email: boolean;
  resumo_diario: boolean;
  demandas: boolean;
  notas: boolean;
  comunicados: boolean;
  prazos: boolean;
  frequencia?: string;
}

interface FrequencyState {
  value: string;
  label: string;
}

const AccountSettingsModal: React.FC<AccountSettingsModalProps> = ({
  isOpen,
  onClose
}) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("notificacoes");
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    app: true,
    email: true,
    resumo_diario: true,
    demandas: true, 
    notas: true,
    comunicados: true,
    prazos: true
  });
  const [frequency, setFrequency] = useState<FrequencyState>({
    value: 'diario',
    label: 'Diário',
  });
  const [loading, setLoading] = useState(true);
  
  const { 
    isNotificationsSupported, 
    notificationsPermission,
    requestPermissionAndRegisterToken
  } = useNotifications();

  useEffect(() => {
    if (user && isOpen) {
      fetchUserPreferences();
    }
  }, [user, isOpen]);

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
          demandas: configData.demandas !== undefined ? Boolean(configData.demandas) : true,
          notas: configData.notas !== undefined ? Boolean(configData.notas) : true,
          comunicados: configData.comunicados !== undefined ? Boolean(configData.comunicados) : true,
          prazos: configData.prazos !== undefined ? Boolean(configData.prazos) : true,
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
  
  const handleEnableNotifications = async () => {
    if (!isNotificationsSupported) {
      toast({
        title: "Não suportado",
        description: "Seu navegador não suporta notificações.",
        variant: "destructive",
      });
      return;
    }
    
    const success = await requestPermissionAndRegisterToken();
    
    if (success) {
      toast({
        title: "Notificações ativadas",
        description: "Você receberá notificações importantes sobre suas demandas.",
        variant: "success",
      });
    } else {
      toast({
        title: "Falha ao ativar",
        description: notificationsPermission === "denied" 
          ? "Permissão negada. Verifique as configurações do seu navegador."
          : "Não foi possível ativar as notificações.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Ajustes da Conta</DialogTitle>
          </DialogHeader>
          <div className="py-4 text-center">
            Carregando...
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Ajustes da Conta</DialogTitle>
          <DialogDescription>
            Configure suas preferências de conta e notificações.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="notificacoes" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="notificacoes">Notificações</TabsTrigger>
            <TabsTrigger value="perfil">Perfil</TabsTrigger>
          </TabsList>
          
          <TabsContent value="notificacoes" className="space-y-4 py-2">
            {/* Status de permissão do navegador */}
            {isNotificationsSupported && (
              <Alert className={notificationsPermission === "granted" ? "bg-green-50 border-green-200" : "bg-yellow-50 border-yellow-200"}>
                <div className="flex items-center gap-2">
                  {notificationsPermission === "granted" ? 
                    <BellRing className="h-4 w-4 text-green-600" /> : 
                    <BellOff className="h-4 w-4 text-yellow-600" />
                  }
                  <AlertDescription>
                    {notificationsPermission === "granted" ? 
                      "Notificações do navegador estão ativadas." : 
                      "Notificações do navegador estão desativadas."
                    }
                    {notificationsPermission !== "granted" && (
                      <button 
                        onClick={handleEnableNotifications}
                        className="ml-2 text-blue-600 hover:underline"
                      >
                        Ativar agora
                      </button>
                    )}
                  </AlertDescription>
                </div>
              </Alert>
            )}
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Canais de Recebimento</h3>
              
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
              
              <Separator />
              
              <h3 className="text-lg font-medium">Tipos de Notificações</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="demandas-notifications" className="text-base">Demandas</Label>
                    <p className="text-sm text-muted-foreground">
                      Notificações sobre novas demandas e mudanças de status
                    </p>
                  </div>
                  <Switch
                    id="demandas-notifications"
                    checked={preferences.demandas}
                    onCheckedChange={(value) => updatePreference('demandas', value)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="notas-notifications" className="text-base">Notas</Label>
                    <p className="text-sm text-muted-foreground">
                      Notificações sobre novas notas e solicitações de aprovação
                    </p>
                  </div>
                  <Switch
                    id="notas-notifications"
                    checked={preferences.notas}
                    onCheckedChange={(value) => updatePreference('notas', value)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="comunicados-notifications" className="text-base">Comunicados</Label>
                    <p className="text-sm text-muted-foreground">
                      Avisos e comunicados gerais do sistema
                    </p>
                  </div>
                  <Switch
                    id="comunicados-notifications"
                    checked={preferences.comunicados}
                    onCheckedChange={(value) => updatePreference('comunicados', value)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="prazos-notifications" className="text-base">Alertas de Prazo</Label>
                    <p className="text-sm text-muted-foreground">
                      Avisos sobre prazos próximos do vencimento
                    </p>
                  </div>
                  <Switch
                    id="prazos-notifications"
                    checked={preferences.prazos}
                    onCheckedChange={(value) => updatePreference('prazos', value)}
                  />
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="perfil">
            <div className="py-4">
              <p className="text-sm text-gray-500">
                Esta funcionalidade será implementada em breve.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AccountSettingsModal;
