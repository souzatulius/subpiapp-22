
import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardFooter 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { Separator } from '@/components/ui/separator';
import { useAdminCheck } from '@/components/dashboard/sidebar/useAdminCheck';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { Loader2 } from 'lucide-react';

import NotificationConfigurations from './NotificationConfigurations';
import NotificationTemplates from './NotificationTemplates';
import NotificationUserPreferences from './NotificationUserPreferences';
import NotificationStats from './NotificationStats';

const NotificationsSettings: React.FC = () => {
  const { user } = useAuth();
  const { isAdmin } = useAdminCheck(user);
  const [activeTab, setActiveTab] = useState('configuracoes');
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <Card className="min-h-[calc(100vh-16rem)]">
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="min-h-[calc(100vh-16rem)]">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Configurações de Notificações</CardTitle>
        <CardDescription>
          Gerencie como as notificações são enviadas e recebidas pelos usuários
        </CardDescription>
        
        <Separator className="my-2" />
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 md:grid-cols-4">
            <TabsTrigger value="configuracoes">Configurações</TabsTrigger>
            <TabsTrigger value="preferencias">Preferências</TabsTrigger>
            {isAdmin && (
              <>
                <TabsTrigger value="templates">Templates</TabsTrigger>
                <TabsTrigger value="estatisticas">Estatísticas</TabsTrigger>
              </>
            )}
          </TabsList>
        </Tabs>
      </CardHeader>
      
      <CardContent>
        <TabsContent value="configuracoes" className="space-y-4">
          <NotificationConfigurations />
        </TabsContent>
        
        <TabsContent value="preferencias" className="space-y-4">
          <NotificationUserPreferences />
        </TabsContent>
        
        {isAdmin && (
          <>
            <TabsContent value="templates" className="space-y-4">
              <NotificationTemplates />
            </TabsContent>
            
            <TabsContent value="estatisticas" className="space-y-4">
              <NotificationStats />
            </TabsContent>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default NotificationsSettings;
