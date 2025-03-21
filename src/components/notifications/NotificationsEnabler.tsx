
import React, { useEffect, useState } from 'react';
import { useNotifications } from '@/hooks/useNotifications';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { Bell, Loader2, X, Pencil } from 'lucide-react';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { Card, CardContent } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const NotificationsEnabler: React.FC = () => {
  const { 
    isNotificationsSupported, 
    notificationsPermission, 
    isLoading, 
    error, 
    requestPermissionAndRegisterToken 
  } = useNotifications();
  
  const { user } = useAuth();
  const [dismissed, setDismissed] = useState(false);
  const [showConfirmDismiss, setShowConfirmDismiss] = useState(false);

  // Check if notifications were previously dismissed in this session
  useEffect(() => {
    const wasDismissed = localStorage.getItem('notifications_card_dismissed');
    if (wasDismissed === 'true') {
      setDismissed(true);
    }
  }, []);

  // Handle successful setup
  const handleEnableNotifications = async () => {
    const result = await requestPermissionAndRegisterToken();
    if (result) {
      toast({
        title: 'Notificações ativadas',
        description: 'Você receberá notificações importantes sobre suas demandas.',
      });
    }
  };

  // Show error toast when there's an error
  useEffect(() => {
    if (error) {
      toast({
        title: 'Erro nas notificações',
        description: error,
        variant: 'destructive',
      });
    }
  }, [error]);

  // Handler to dismiss notification message
  const handleDismiss = () => {
    setShowConfirmDismiss(true);
  };

  const confirmDismiss = () => {
    setDismissed(true);
    localStorage.setItem('notifications_card_dismissed', 'true');
    setShowConfirmDismiss(false);
  };

  // Don't show anything if user isn't logged in or banner was dismissed
  // Also don't show if notifications are already granted
  if (!user || dismissed || notificationsPermission === 'granted') return null;

  // Show unsupported message
  if (isNotificationsSupported === false) {
    return (
      <div className="col-span-1 md:col-span-2 lg:col-span-4">
        <Card className="cursor-pointer transition-all duration-300 border border-gray-200 
          rounded-xl shadow-md hover:shadow-xl hover:scale-105 
          bg-gray-50 text-gray-600 border-gray-100 hover:bg-gray-100 group">
          <CardContent className="relative flex flex-col items-center justify-center p-6 md:p-4 h-full">
            <button 
              className="absolute top-2 right-2 p-1 rounded-full bg-white/80 hover:bg-white text-gray-500 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
              onClick={handleDismiss}
              aria-label="Remover card"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="mb-4">
              <Bell className="h-12 w-12" />
            </div>
            <h3 className="text-lg font-medium text-center">Notificações não suportadas</h3>
            <p className="text-sm text-center mt-2">Seu navegador não suporta notificações push.</p>
          </CardContent>
        </Card>

        <AlertDialog open={showConfirmDismiss} onOpenChange={setShowConfirmDismiss}>
          <AlertDialogContent className="rounded-xl">
            <AlertDialogHeader>
              <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
              <AlertDialogDescription>
                O card de notificações não aparecerá novamente até que você faça um novo login.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="rounded-lg">Cancelar</AlertDialogCancel>
              <AlertDialogAction 
                className="bg-red-600 hover:bg-red-700 text-white rounded-lg"
                onClick={confirmDismiss}
              >
                Remover
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    );
  }

  // Still checking support or not initialized
  if (isNotificationsSupported === null) {
    return null;
  }

  // Denied permission
  if (notificationsPermission === 'denied') {
    return (
      <div className="col-span-1 md:col-span-2 lg:col-span-4">
        <Card className="cursor-pointer transition-all duration-300 border border-gray-200 
          rounded-xl shadow-md hover:shadow-xl hover:scale-105 
          bg-orange-50 text-orange-600 border-orange-100 hover:bg-orange-100 group">
          <CardContent className="relative flex flex-col items-center justify-center p-6 md:p-4 h-full">
            <button 
              className="absolute top-2 right-2 p-1 rounded-full bg-white/80 hover:bg-white text-gray-500 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
              onClick={handleDismiss}
              aria-label="Remover card"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="mb-4">
              <Bell className="h-12 w-12" />
            </div>
            <h3 className="text-lg font-medium text-center">Notificações bloqueadas</h3>
            <p className="text-sm text-center mt-2">Habilite-as nas configurações do seu navegador para receber atualizações.</p>
          </CardContent>
        </Card>

        <AlertDialog open={showConfirmDismiss} onOpenChange={setShowConfirmDismiss}>
          <AlertDialogContent className="rounded-xl">
            <AlertDialogHeader>
              <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
              <AlertDialogDescription>
                O card de notificações não aparecerá novamente até que você faça um novo login.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="rounded-lg">Cancelar</AlertDialogCancel>
              <AlertDialogAction 
                className="bg-red-600 hover:bg-red-700 text-white rounded-lg"
                onClick={confirmDismiss}
              >
                Remover
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    );
  }

  // Default - request permission
  return (
    <div className="col-span-1 md:col-span-2 lg:col-span-4">
      <Card className="cursor-pointer transition-all duration-300 border border-gray-200 
        rounded-xl shadow-md hover:shadow-xl hover:scale-105 
        bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-100 group">
        <CardContent className="relative flex flex-col items-center justify-center p-6 md:p-4 h-full">
          <button 
            className="absolute top-2 right-2 p-1 rounded-full bg-white/80 hover:bg-white text-gray-500 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
            onClick={handleDismiss}
            aria-label="Remover card"
          >
            <X className="h-4 w-4" />
          </button>
          <div className="mb-4">
            <Bell className="h-12 w-12" />
          </div>
          <h3 className="text-lg font-medium text-center">Ativar notificações</h3>
          <p className="text-sm text-center mt-2">Ativar notificações para receber atualizações sobre suas demandas?</p>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleEnableNotifications}
            disabled={isLoading}
            className="mt-4"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Aguarde...
              </>
            ) : (
              'Ativar'
            )}
          </Button>
        </CardContent>
      </Card>

      <AlertDialog open={showConfirmDismiss} onOpenChange={setShowConfirmDismiss}>
        <AlertDialogContent className="rounded-xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              O card de notificações não aparecerá novamente até que você faça um novo login.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-lg">Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              className="bg-red-600 hover:bg-red-700 text-white rounded-lg"
              onClick={confirmDismiss}
            >
              Remover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default NotificationsEnabler;
