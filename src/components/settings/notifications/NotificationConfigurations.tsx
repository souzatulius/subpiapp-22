
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Check, X, AlertCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useSupabaseAuth';

interface NotificationConfig {
  id: string;
  tipo: string;
  titulo: string;
  descricao: string;
  ativo: boolean;
  frequencia: string;
}

const NotificationConfigurations = () => {
  const [configurations, setConfigurations] = useState<NotificationConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  // Fetch notification configurations
  useEffect(() => {
    const fetchConfigurations = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('configuracoes_notificacoes')
          .select('*')
          .order('titulo');
          
        if (error) throw error;
        setConfigurations(data || []);
      } catch (error: any) {
        console.error('Erro ao carregar configurações de notificações:', error);
        toast({
          title: 'Erro',
          description: 'Não foi possível carregar as configurações de notificações.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchConfigurations();
  }, [user, toast]);

  // Toggle notification status
  const handleToggleActive = async (id: string, currentValue: boolean) => {
    const updatedConfigurations = configurations.map(config => 
      config.id === id ? { ...config, ativo: !currentValue } : config
    );
    
    setConfigurations(updatedConfigurations);
    
    try {
      setSaving(true);
      const { error } = await supabase
        .from('configuracoes_notificacoes')
        .update({ ativo: !currentValue })
        .eq('id', id);
        
      if (error) throw error;
      
      toast({
        title: 'Configuração atualizada',
        description: !currentValue 
          ? 'Notificação ativada com sucesso.' 
          : 'Notificação desativada com sucesso.',
      });
    } catch (error: any) {
      console.error('Erro ao atualizar configuração:', error);
      // Revert the change in UI
      setConfigurations(configurations);
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar a configuração.',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  // Update notification frequency
  const handleFrequencyChange = async (id: string, frequency: string) => {
    const updatedConfigurations = configurations.map(config => 
      config.id === id ? { ...config, frequencia: frequency } : config
    );
    
    setConfigurations(updatedConfigurations);
    
    try {
      setSaving(true);
      const { error } = await supabase
        .from('configuracoes_notificacoes')
        .update({ frequencia: frequency })
        .eq('id', id);
        
      if (error) throw error;
      
      toast({
        title: 'Frequência atualizada',
        description: 'A frequência da notificação foi atualizada com sucesso.',
      });
    } catch (error: any) {
      console.error('Erro ao atualizar frequência:', error);
      // Revert the change in UI
      setConfigurations(configurations);
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar a frequência da notificação.',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  // Add a new configuration
  const handleAddConfiguration = async () => {
    toast({
      title: 'Funcionalidade em desenvolvimento',
      description: 'A adição de novas configurações será implementada em breve.',
    });
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="h-5 w-40 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 w-60 bg-gray-200 rounded animate-pulse"></div>
                </div>
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
        <div className="space-y-6">
          {configurations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <AlertCircle className="h-10 w-10 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900">Nenhuma configuração encontrada</h3>
              <p className="text-gray-500 mt-1 mb-4">
                Não existem configurações de notificações definidas no sistema.
              </p>
              <Button onClick={handleAddConfiguration}>
                Adicionar Configuração
              </Button>
            </div>
          ) : (
            <>
              {configurations.map((config) => (
                <div key={config.id} className="flex flex-col space-y-3 border-b pb-4 last:border-b-0">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-sm">{config.titulo}</div>
                      <div className="text-sm text-gray-500">{config.descricao}</div>
                    </div>
                    <div className="flex items-center">
                      <Switch 
                        checked={config.ativo} 
                        disabled={saving}
                        onCheckedChange={() => handleToggleActive(config.id, config.ativo)}
                      />
                      <span className="ml-2 w-12 text-xs">
                        {config.ativo ? 
                          <span className="text-green-600 flex items-center"><Check className="h-3 w-3 mr-1" /> Ativo</span> : 
                          <span className="text-gray-500 flex items-center"><X className="h-3 w-3 mr-1" /> Inativo</span>
                        }
                      </span>
                    </div>
                  </div>
                  
                  {config.ativo && (
                    <div className="flex items-center space-x-4 text-sm">
                      <Label className="text-xs text-gray-500">Frequência:</Label>
                      <div className="flex space-x-2">
                        <Button 
                          variant={config.frequencia === 'imediata' ? 'default' : 'outline'} 
                          size="sm"
                          className="h-7 px-2 text-xs"
                          onClick={() => handleFrequencyChange(config.id, 'imediata')}
                          disabled={saving}
                        >
                          Imediata
                        </Button>
                        <Button 
                          variant={config.frequencia === 'diaria' ? 'default' : 'outline'} 
                          size="sm"
                          className="h-7 px-2 text-xs"
                          onClick={() => handleFrequencyChange(config.id, 'diaria')}
                          disabled={saving}
                        >
                          Diária
                        </Button>
                        <Button 
                          variant={config.frequencia === 'semanal' ? 'default' : 'outline'} 
                          size="sm"
                          className="h-7 px-2 text-xs"
                          onClick={() => handleFrequencyChange(config.id, 'semanal')}
                          disabled={saving}
                        >
                          Semanal
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationConfigurations;
