
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { toast } from '@/components/ui/use-toast';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import EditModal from '@/components/settings/EditModal';
import { useNotifications } from '@/hooks/useNotifications';
import { Loader2 } from 'lucide-react';

interface AccountSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AccountSettingsModal: React.FC<AccountSettingsModalProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const { 
    notificationsPermission,
    requestPermissionAndRegisterToken,
    isNotificationsSupported
  } = useNotifications();

  // Check if user has notifications enabled
  useEffect(() => {
    const checkNotificationStatus = async () => {
      if (!user) return;
      
      try {
        const { data } = await supabase
          .from('tokens_notificacoes')
          .select('*')
          .eq('user_id', user.id)
          .limit(1);
          
        setNotificationsEnabled(!!data && data.length > 0);
      } catch (error) {
        console.error('Erro ao verificar status das notificações:', error);
      }
    };

    checkNotificationStatus();
  }, [user]);

  const handleToggleNotifications = async (enabled: boolean) => {
    if (!user || !isNotificationsSupported) return;
    
    try {
      setLoading(true);
      
      if (enabled) {
        // Enable notifications
        const success = await requestPermissionAndRegisterToken();
        if (success) {
          setNotificationsEnabled(true);
          toast({
            title: "Notificações ativadas",
            description: "Você receberá notificações importantes sobre suas demandas.",
          });
        } else {
          throw new Error("Não foi possível ativar as notificações");
        }
      } else {
        // Disable notifications
        await supabase
          .from('tokens_notificacoes')
          .delete()
          .eq('user_id', user.id);
          
        setNotificationsEnabled(false);
        toast({
          title: "Notificações desativadas",
          description: "Você não receberá mais notificações.",
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

  const footerContent = (
    <Button variant="outline" onClick={onClose} disabled={loading}>
      Fechar
    </Button>
  );

  return (
    <EditModal
      isOpen={isOpen}
      onClose={onClose}
      title="Configurações da Conta"
      footerContent={footerContent}
    >
      <div className="space-y-6">
        <div>
          <h4 className="text-lg font-medium text-subpi-blue mb-4">Notificações</h4>
          
          {isNotificationsSupported ? (
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="notifications" className="text-base">
                  Receber notificações
                </Label>
                <p className="text-sm text-gray-500 mt-1">
                  Permita receber notificações sobre suas demandas
                </p>
              </div>
              <div className="flex items-center">
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin text-subpi-blue" />
                ) : (
                  <Switch
                    id="notifications"
                    checked={notificationsEnabled}
                    disabled={notificationsPermission === 'denied' || loading}
                    onCheckedChange={handleToggleNotifications}
                  />
                )}
              </div>
            </div>
          ) : (
            <p className="text-sm text-amber-600">
              Seu navegador não suporta notificações. Tente usar outro navegador como Chrome ou Firefox.
            </p>
          )}
          
          {notificationsPermission === 'denied' && (
            <p className="text-sm text-red-500 mt-2">
              As notificações estão bloqueadas. Habilite-as nas configurações do seu navegador.
            </p>
          )}
        </div>
        
        <div>
          <h4 className="text-lg font-medium text-subpi-blue mb-2">Outras configurações</h4>
          <p className="text-sm text-gray-500">
            Mais configurações serão adicionadas em breve.
          </p>
        </div>
      </div>
    </EditModal>
  );
};

export default AccountSettingsModal;
