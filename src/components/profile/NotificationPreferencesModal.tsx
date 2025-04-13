
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, Mail, Phone } from 'lucide-react';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface NotificationPreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationPreferencesModal: React.FC<NotificationPreferencesModalProps> = ({
  isOpen,
  onClose
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Preferências de Notificações</DialogTitle>
          <DialogDescription>
            Configure como deseja receber notificações do sistema
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="app">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="app" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              App
            </TabsTrigger>
            <TabsTrigger value="email" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email
            </TabsTrigger>
            <TabsTrigger value="whatsapp" className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              WhatsApp
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="app" className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="app-todas" className="flex flex-col">
                <span>Todas as notificações</span>
                <span className="font-normal text-xs text-gray-500">Receber notificações no aplicativo</span>
              </Label>
              <Switch id="app-todas" checked={true} />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="app-demandas" className="flex flex-col">
                <span>Novas demandas</span>
                <span className="font-normal text-xs text-gray-500">Quando novas demandas forem criadas</span>
              </Label>
              <Switch id="app-demandas" checked={true} />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="app-notas" className="flex flex-col">
                <span>Notas oficiais</span>
                <span className="font-normal text-xs text-gray-500">Quando notas forem aprovadas ou rejeitadas</span>
              </Label>
              <Switch id="app-notas" checked={true} />
            </div>
          </TabsContent>
          
          <TabsContent value="email" className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="email-todas" className="flex flex-col">
                <span>Receber emails</span>
                <span className="font-normal text-xs text-gray-500">Receber notificações por email</span>
              </Label>
              <Switch id="email-todas" checked={false} />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="email-resumo" className="flex flex-col">
                <span>Resumo diário</span>
                <span className="font-normal text-xs text-gray-500">Receber um resumo diário das atividades</span>
              </Label>
              <Switch id="email-resumo" checked={true} />
            </div>
          </TabsContent>
          
          <TabsContent value="whatsapp" className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="whatsapp-todas" className="flex flex-col">
                <span>Notificações WhatsApp</span>
                <span className="font-normal text-xs text-gray-500">Receber notificações via WhatsApp</span>
              </Label>
              <Switch id="whatsapp-todas" checked={false} />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="whatsapp-urgentes" className="flex flex-col">
                <span>Apenas Urgentes</span>
                <span className="font-normal text-xs text-gray-500">Receber apenas notificações urgentes</span>
              </Label>
              <Switch id="whatsapp-urgentes" checked={false} />
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default NotificationPreferencesModal;
