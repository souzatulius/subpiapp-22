
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { AlertTriangle, BellRing } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { useNotifications } from '@/hooks/notifications';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const NotificationConfigurations = () => {
  const { user } = useAuth();
  const { 
    isNotificationsSupported, 
    notificationsPermission, 
    requestPermissionAndRegisterToken 
  } = useNotifications();
  
  const [fcmTokens, setFcmTokens] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [browserNotificationsEnabled, setBrowserNotificationsEnabled] = useState(false);
  
  useEffect(() => {
    if (user) {
      fetchUserTokens();
      
      // Check browser notifications status
      setBrowserNotificationsEnabled(
        isNotificationsSupported && notificationsPermission === 'granted'
      );
    }
  }, [user, notificationsPermission, isNotificationsSupported]);
  
  const fetchUserTokens = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('tokens_notificacoes')
        .select('*')
        .eq('user_id', user?.id);
        
      if (error) throw error;
      setFcmTokens(data || []);
    } catch (error) {
      console.error('Erro ao buscar tokens:', error);
      toast({
        title: "Erro ao carregar dados",
        description: "Não foi possível carregar suas configurações de notificação.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleEnableNotifications = async () => {
    try {
      const success = await requestPermissionAndRegisterToken();
      
      if (success) {
        setBrowserNotificationsEnabled(true);
        toast({
          title: "Notificações ativadas",
          description: "Você receberá notificações importantes sobre suas demandas.",
          variant: "success",
        });
        fetchUserTokens(); // Refresh tokens list
      } else {
        toast({
          title: "Falha ao ativar",
          description: notificationsPermission === "denied" 
            ? "Permissão negada. Verifique as configurações do seu navegador."
            : "Não foi possível ativar as notificações.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Erro ao ativar notificações:', error);
    }
  };
  
  const removeDevice = async (tokenId: string) => {
    try {
      const { error } = await supabase
        .from('tokens_notificacoes')
        .delete()
        .eq('id', tokenId);
        
      if (error) throw error;
      
      setFcmTokens(fcmTokens.filter(token => token.id !== tokenId));
      
      toast({
        title: "Dispositivo removido",
        description: "Este dispositivo não receberá mais notificações.",
        variant: "success",
      });
    } catch (error) {
      console.error('Erro ao remover dispositivo:', error);
      toast({
        title: "Erro",
        description: "Não foi possível remover o dispositivo.",
        variant: "destructive",
      });
    }
  };

  const formatDeviceName = (userAgent: string) => {
    // Extract browser and device info
    let browserName = "Navegador";
    let deviceType = "Dispositivo";
    
    if (userAgent.match(/chrome|chromium|crios/i)) {
      browserName = "Chrome";
    } else if (userAgent.match(/firefox|fxios/i)) {
      browserName = "Firefox";
    } else if (userAgent.match(/safari/i)) {
      browserName = "Safari";
    } else if (userAgent.match(/opr\//i)) {
      browserName = "Opera";
    } else if (userAgent.match(/edg/i)) {
      browserName = "Edge";
    }
    
    if (userAgent.match(/android/i)) {
      deviceType = "Android";
    } else if (userAgent.match(/iphone|ipad|ipod/i)) {
      deviceType = "iOS";
    } else if (userAgent.match(/windows/i)) {
      deviceType = "Windows";
    } else if (userAgent.match(/macintosh|mac os/i)) {
      deviceType = "Mac";
    } else if (userAgent.match(/linux/i)) {
      deviceType = "Linux";
    }
    
    return `${browserName} em ${deviceType}`;
  };
  
  // Check if this is the current browser
  const isCurrentBrowser = (tokenUserAgent: string) => {
    if (!tokenUserAgent) return false;
    return navigator.userAgent.includes(tokenUserAgent.substring(0, 50));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <BellRing className="h-5 w-5 mr-2" />
          Configurações de Notificação
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Browser Notifications */}
        <div className="bg-gray-50 p-4 rounded-lg border">
          <h3 className="text-lg font-medium mb-2">Notificações do Navegador</h3>
          
          {!isNotificationsSupported && (
            <Alert variant="destructive" className="mb-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Navegador não compatível</AlertTitle>
              <AlertDescription>
                Seu navegador não suporta notificações. Use Chrome, Firefox, Safari ou Edge para receber notificações.
              </AlertDescription>
            </Alert>
          )}
          
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-2">
                {browserNotificationsEnabled
                  ? "Notificações do navegador estão ativadas. Você receberá alertas sobre novas demandas, notas e comunicados."
                  : "Ative as notificações do navegador para receber alertas sobre novas demandas, notas e comunicados."}
              </p>
              <p className="text-xs text-gray-500">
                Status: {notificationsPermission === 'granted' ? 'Permitido' : notificationsPermission === 'denied' ? 'Bloqueado' : 'Não configurado'}
              </p>
            </div>
            
            <Button 
              variant={browserNotificationsEnabled ? "outline" : "default"} 
              disabled={!isNotificationsSupported || notificationsPermission === 'denied' && browserNotificationsEnabled}
              onClick={handleEnableNotifications}
            >
              {browserNotificationsEnabled ? 'Configurado' : 'Ativar'}
            </Button>
          </div>
          
          {notificationsPermission === 'denied' && (
            <Alert variant="destructive" className="mt-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Notificações bloqueadas</AlertTitle>
              <AlertDescription>
                Você bloqueou as notificações neste navegador. Para ativá-las novamente, verifique as configurações do seu navegador.
              </AlertDescription>
            </Alert>
          )}
        </div>
        
        {/* Registered Devices */}
        <div>
          <h3 className="text-lg font-medium mb-4">Dispositivos Registrados</h3>
          
          {isLoading ? (
            <div className="text-center py-8">
              <div className="inline-block h-6 w-6 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
              <p className="mt-2 text-sm text-gray-500">Carregando dispositivos...</p>
            </div>
          ) : fcmTokens.length === 0 ? (
            <div className="text-center py-8 border rounded-lg bg-gray-50">
              <p className="text-gray-500">Nenhum dispositivo registrado para notificações</p>
            </div>
          ) : (
            <div className="space-y-3">
              {fcmTokens.map(token => (
                <div 
                  key={token.id} 
                  className={`flex items-center justify-between p-3 rounded-lg border ${
                    isCurrentBrowser(token.navegador) ? 'border-blue-200 bg-blue-50' : 'border-gray-200'
                  }`}
                >
                  <div>
                    <div className="font-medium">
                      {formatDeviceName(token.navegador)}
                      {isCurrentBrowser(token.navegador) && (
                        <span className="ml-2 text-xs text-blue-600 font-normal">
                          (Dispositivo atual)
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-500">
                      Registrado em {new Date(token.criado_em).toLocaleDateString('pt-BR')}
                    </div>
                  </div>
                  <div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => removeDevice(token.id)}
                    >
                      Remover
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationConfigurations;
