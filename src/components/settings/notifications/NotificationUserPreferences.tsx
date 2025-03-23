
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { AlertCircle, Save } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useSupabaseAuth';

interface UserNotificationPreferences {
  app: boolean;
  email: boolean;
  resumo_diario: boolean;
  [key: string]: boolean;
}

const NotificationUserPreferences = () => {
  const [preferences, setPreferences] = useState<UserNotificationPreferences>({
    app: true,
    email: true,
    resumo_diario: true
  });
  const [originalPreferences, setOriginalPreferences] = useState<UserNotificationPreferences>({
    app: true,
    email: true,
    resumo_diario: true
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  // Fetch user preferences
  useEffect(() => {
    const fetchPreferences = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('usuarios')
          .select('configuracoes_notificacao')
          .eq('id', user.id)
          .single();
          
        if (error) throw error;
        
        if (data && data.configuracoes_notificacao) {
          setPreferences(data.configuracoes_notificacao as UserNotificationPreferences);
          setOriginalPreferences(data.configuracoes_notificacao as UserNotificationPreferences);
        }
      } catch (error: any) {
        console.error('Erro ao carregar preferências de notificações:', error);
        toast({
          title: 'Erro',
          description: 'Não foi possível carregar suas preferências de notificações.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchPreferences();
  }, [user, toast]);

  // Handle toggle preferences
  const handleTogglePreference = (key: string) => {
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Save preferences
  const handleSavePreferences = async () => {
    if (!user) return;
    
    try {
      setSaving(true);
      const { error } = await supabase
        .from('usuarios')
        .update({ configuracoes_notificacao: preferences })
        .eq('id', user.id);
        
      if (error) throw error;
      
      setOriginalPreferences({...preferences});
      
      toast({
        title: 'Preferências salvas',
        description: 'Suas preferências de notificações foram atualizadas com sucesso.',
      });
    } catch (error: any) {
      console.error('Erro ao salvar preferências:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível salvar suas preferências de notificações.',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  // Check if there are unsaved changes
  const hasChanges = () => {
    return JSON.stringify(preferences) !== JSON.stringify(originalPreferences);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex items-center justify-between">
                <div className="h-5 w-40 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-6 w-12 bg-gray-200 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="pt-6">
        {!user ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <AlertCircle className="h-10 w-10 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900">Usuário não autenticado</h3>
            <p className="text-gray-500 mt-1">
              Você precisa estar autenticado para gerenciar suas preferências de notificações.
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-6">
              <div className="flex flex-col space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Notificações no App</div>
                    <div className="text-sm text-gray-500">Receba notificações no aplicativo</div>
                  </div>
                  <Switch 
                    checked={preferences.app} 
                    onCheckedChange={() => handleTogglePreference('app')}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Notificações por Email</div>
                    <div className="text-sm text-gray-500">Receba notificações importantes por email</div>
                  </div>
                  <Switch 
                    checked={preferences.email} 
                    onCheckedChange={() => handleTogglePreference('email')}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Resumo Diário</div>
                    <div className="text-sm text-gray-500">Receba um resumo diário das atividades</div>
                  </div>
                  <Switch 
                    checked={preferences.resumo_diario} 
                    onCheckedChange={() => handleTogglePreference('resumo_diario')}
                  />
                </div>
              </div>
              
              {hasChanges() && (
                <div className="flex justify-end">
                  <Button 
                    onClick={handleSavePreferences} 
                    disabled={saving}
                    className="flex items-center"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Salvar Preferências
                  </Button>
                </div>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default NotificationUserPreferences;
