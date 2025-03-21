
import React, { useState, useEffect } from 'react';
import { Bell, BellOff } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useNotifications } from '@/hooks/useNotifications';
import { toast } from '@/hooks/use-toast';
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

const NotificationsEnabler = () => {
  const { permission, enableNotifications } = useNotifications();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only show notification card if permission is not granted
    setIsVisible(permission === 'default');

    // Hide the card after 10 seconds if no interaction
    const timer = setTimeout(() => {
      if (permission === 'default') {
        setIsVisible(false);
      }
    }, 10000);

    return () => clearTimeout(timer);
  }, [permission]);

  const handleEnableClick = async () => {
    setIsDialogOpen(false);
    
    try {
      await enableNotifications();
      
      toast({
        title: "Notificações ativadas",
        description: "Você receberá notificações sobre novas atividades.",
        variant: "success",
      });
      
      setIsVisible(false);
    } catch (error) {
      toast({
        title: "Erro ao ativar notificações",
        description: "Verifique as configurações do seu navegador e tente novamente.",
        variant: "destructive",
      });
    }
  };

  if (!isVisible) return null;

  return (
    <div className="col-span-1 overflow-hidden">
      <Card 
        className="bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-100 cursor-pointer transition-all duration-300 shadow-md rounded-xl overflow-hidden transform-gpu hover:scale-[1.03]"
        onClick={() => setIsDialogOpen(true)}
      >
        <CardContent className="p-6 md:p-4 flex flex-col items-center justify-center">
          <div className="mb-4">
            <Bell className="h-12 w-12" />
          </div>
          <h3 className="text-lg font-medium text-center">Ativar Notificações</h3>
        </CardContent>
      </Card>

      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent className="rounded-xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Ativar notificações?</AlertDialogTitle>
            <AlertDialogDescription>
              Receba notificações sobre novas demandas, aprovações pendentes e outras atividades importantes.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-lg">Não agora</AlertDialogCancel>
            <AlertDialogAction 
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
              onClick={handleEnableClick}
            >
              Ativar Notificações
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default NotificationsEnabler;
