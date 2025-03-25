
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Notifications from '../Notifications';
import NotificationsSettings from './NotificationsSettings';
import { Bell, Settings } from 'lucide-react';

const NotificationsPage: React.FC = () => {
  return (
    <Card className="min-h-[calc(100vh-16rem)]">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Gerenciamento de Notificações</CardTitle>
        <CardDescription>
          Configure e gerencie as notificações do sistema
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="listagem" className="w-full">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="listagem" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Notificações
            </TabsTrigger>
            <TabsTrigger value="configuracoes" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Configurações
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="listagem">
            <Notifications />
          </TabsContent>
          
          <TabsContent value="configuracoes">
            <NotificationsSettings />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default NotificationsPage;
