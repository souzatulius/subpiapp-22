
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { toast } from '@/components/ui/use-toast';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import EditModal from '@/components/settings/EditModal';
import { useNotifications } from '@/hooks/notifications';
import { Loader2, Bell, BellRing, BellOff, Info } from 'lucide-react';

interface AccountSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AccountSettingsModal: React.FC<AccountSettingsModalProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [emailNotificationsEnabled, setEmailNotificationsEnabled] = useState(false);
  const [demandaNotifications, setDemandaNotifications] = useState(true);
  const [comunicadoNotifications, setComunicadoNotifications] = useState(true);
  const { 
    notificationsPermission,
    requestPermissionAndRegisterToken,
    isNotificationsSupported
  } = useNotifications();

  useEffect(() => {
    const checkPreferences = async () => {
      if (!user || !isOpen) return;
      
      setCheckingStatus(true);
      try {
        // Check push notifications status
        const { data: tokenData, error: tokenError } = await supabase
          .from('tokens_notificacoes')
          .select('*')
          .eq('user_id', user.id)
          .limit(1);
          
        if (tokenError) throw tokenError;
        setNotificationsEnabled(!!tokenData && tokenData.length > 0);
        
        // Check user notification preferences
        const { data: prefsData, error: prefsError } = await supabase
          .from('usuario_preferencias')
          .select('*')
          .eq('usuario_id', user.id)
          .single();
          
        if (prefsError && prefsError.code !== 'PGRST116') { // Not found is fine
          throw prefsError;
        }
        
        if (prefsData) {
          setEmailNotificationsEnabled(prefsData.email_notificacoes || false);
          setDemandaNotifications(prefsData.notificar_demandas !== false); // Default to true
          setComunicadoNotifications(prefsData.notificar_comunicados !== false); // Default to true
        }
      } catch (error) {
        console.error('Erro ao verificar preferências de notificações:', error);
      } finally {
        setCheckingStatus(false);
      }
    };

    checkPreferences();
  }, [user, isOpen]);

  const handleToggleNotifications = async (enabled: boolean) => {
    if (!user || !isNotificationsSupported) return;
    
    try {
      setLoading(true);
      
      if (enabled) {
        const success = await requestPermissionAndRegisterToken();
        if (success) {
          setNotificationsEnabled(true);
          toast({
            title: "Notificações ativadas",
            description: "Você receberá notificações importantes sobre suas demandas.",
            variant: "success",
          });
        } else {
          throw new Error("Não foi possível ativar as notificações");
        }
      } else {
        await supabase
          .from('tokens_notificacoes')
          .delete()
          .eq('user_id', user.id);
          
        setNotificationsEnabled(false);
        toast({
          title: "Notificações desativadas",
          description: "Você não receberá mais notificações.",
          variant: "success",
        });
      }
    } catch (error) {
      console.error('Erro ao alterar configurações de notificação:', error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao alterar suas configurações de notificação.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const savePreferences = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      const preferences = {
        usuario_id: user.id,
        email_notificacoes: emailNotificationsEnabled,
        notificar_demandas: demandaNotifications,
        notificar_comunicados: comunicadoNotifications,
      };
      
      const { error } = await supabase
        .from('usuario_preferencias')
        .upsert(preferences, { onConflict: 'usuario_id' });
        
      if (error) throw error;
      
      toast({
        title: "Preferências salvas",
        description: "Suas preferências de notificação foram atualizadas com sucesso.",
        variant: "success",
      });
    } catch (error) {
      console.error('Erro ao salvar preferências:', error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar suas preferências de notificação.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const footerContent = (
    <>
      <Button variant="outline" onClick={onClose} disabled={loading || checkingStatus}>
        Cancelar
      </Button>
      <Button onClick={savePreferences} disabled={loading || checkingStatus}>
        {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Salvando...</> : 'Salvar'}
      </Button>
    </>
  );

  const NotificationIcon = notificationsEnabled ? BellRing : BellOff;

  return (
    <EditModal
      isOpen={isOpen}
      onClose={onClose}
      title="Configurações de Notificações"
      footerContent={footerContent}
    >
      <div className="space-y-6">
        {checkingStatus ? (
          <div className="flex justify-center py-4">
            <Loader2 className="h-6 w-6 animate-spin text-subpi-blue" />
          </div>
        ) : (
          <>
            <div className="bg-white p-5 rounded-xl shadow-sm border mb-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-blue-100 p-2 rounded-full">
                  <NotificationIcon className="h-5 w-5 text-subpi-blue" />
                </div>
                <h3 className="text-lg font-medium">Notificações no Navegador</h3>
              </div>
              
              {isNotificationsSupported ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="browser-notifications" className="text-base">
                        Receber notificações
                      </Label>
                      <p className="text-sm text-gray-500 mt-1">
                        Permita receber notificações sobre suas demandas e comunicados
                      </p>
                    </div>
                    <div className="flex items-center">
                      {loading ? (
                        <Loader2 className="h-5 w-5 animate-spin text-subpi-blue" />
                      ) : (
                        <Switch
                          id="browser-notifications"
                          checked={notificationsEnabled}
                          disabled={notificationsPermission === 'denied' || loading}
                          onCheckedChange={handleToggleNotifications}
                        />
                      )}
                    </div>
                  </div>
                  
                  {notificationsPermission === 'denied' && (
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mt-2">
                      <p className="text-sm text-amber-700 flex items-start">
                        <Info className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                        As notificações estão bloqueadas no seu navegador. Habilite-as nas configurações do navegador para receber alertas.
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-sm text-amber-600">
                  Seu navegador não suporta notificações. Tente usar outro navegador como Chrome ou Firefox.
                </p>
              )}
            </div>

            <div className="bg-white p-5 rounded-xl shadow-sm border">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-blue-100 p-2 rounded-full">
                  <Bell className="h-5 w-5 text-subpi-blue" />
                </div>
                <h3 className="text-lg font-medium">Preferências de Notificações</h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="email-notifications" className="text-base">
                      Notificações por Email
                    </Label>
                    <p className="text-sm text-gray-500 mt-1">
                      Receber notificações também por email
                    </p>
                  </div>
                  <Switch
                    id="email-notifications"
                    checked={emailNotificationsEnabled}
                    onCheckedChange={setEmailNotificationsEnabled}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="demandas-notifications" className="text-base">
                      Notificações de Demandas
                    </Label>
                    <p className="text-sm text-gray-500 mt-1">
                      Receber alertas sobre mudanças em demandas
                    </p>
                  </div>
                  <Switch
                    id="demandas-notifications"
                    checked={demandaNotifications}
                    onCheckedChange={setDemandaNotifications}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="comunicados-notifications" className="text-base">
                      Notificações de Comunicados
                    </Label>
                    <p className="text-sm text-gray-500 mt-1">
                      Receber alertas sobre novos comunicados
                    </p>
                  </div>
                  <Switch
                    id="comunicados-notifications"
                    checked={comunicadoNotifications}
                    onCheckedChange={setComunicadoNotifications}
                  />
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </EditModal>
  );
};

export default AccountSettingsModal;
