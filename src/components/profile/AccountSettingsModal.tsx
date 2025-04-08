
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bell, Mail, Phone } from 'lucide-react';
import NotificationUserPreferences from '@/components/settings/notifications/NotificationUserPreferences';
import { Separator } from '@/components/ui/separator';

interface AccountSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AccountSettingsModal: React.FC<AccountSettingsModalProps> = ({
  isOpen,
  onClose
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('app');

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Preferências de Notificações</DialogTitle>
          <DialogDescription>
            Configure como deseja receber notificações e alertas do sistema
          </DialogDescription>
        </DialogHeader>
        
        <Separator className="my-2" />
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="app" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              App
            </TabsTrigger>
            <TabsTrigger value="email" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email
            </TabsTrigger>
            <TabsTrigger value="mobile" className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              WhatsApp
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="app">
            <NotificationUserPreferences channelType="app" />
          </TabsContent>
          
          <TabsContent value="email">
            <NotificationUserPreferences channelType="email" />
          </TabsContent>
          
          <TabsContent value="mobile">
            <NotificationUserPreferences channelType="whatsapp" />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AccountSettingsModal;
