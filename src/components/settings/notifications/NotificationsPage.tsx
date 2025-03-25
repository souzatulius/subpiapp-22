
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, MessageSquare, Send, Settings } from 'lucide-react';
import Notifications from '../Notifications';
import NotificationsSettings from './NotificationsSettings';
import Announcements from '../Announcements';

const NotificationsPage: React.FC = () => {
  return (
    <Card className="min-h-[calc(100vh-16rem)]">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Gerenciamento de Notificações</CardTitle>
        <CardDescription>
          Configure e gerencie notificações, avisos e comunicados
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="notificacoes" className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="notificacoes" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Notificações
            </TabsTrigger>
            <TabsTrigger value="avisos" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Avisos
            </TabsTrigger>
            <TabsTrigger value="configuracoes" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Configurações
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="notificacoes">
            <Notifications />
          </TabsContent>
          
          <TabsContent value="avisos">
            <Announcements />
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
