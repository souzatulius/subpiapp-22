
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bell, Mail, Phone, UserCircle } from 'lucide-react';
import NotificationUserPreferences from '@/components/settings/notifications/NotificationUserPreferences';
import { Separator } from '@/components/ui/separator';
import ProfileSettings from './ProfileSettings';

interface AccountSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: string;
}

const AccountSettingsModal: React.FC<AccountSettingsModalProps> = ({
  isOpen,
  onClose,
  defaultTab = 'profile'
}) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(defaultTab);

  useEffect(() => {
    if (defaultTab) {
      setActiveTab(defaultTab);
    }
  }, [defaultTab]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto bg-gray-100 rounded-xl border border-gray-200">
        <DialogHeader>
          <DialogTitle>Configurações da Conta</DialogTitle>
          <DialogDescription>
            Gerencie seu perfil e configure preferências de notificações
          </DialogDescription>
        </DialogHeader>
        
        <Separator className="my-2" />
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <UserCircle className="h-4 w-4" />
              Perfil
            </TabsTrigger>
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
          
          <TabsContent value="profile">
            <ProfileSettings />
          </TabsContent>

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
