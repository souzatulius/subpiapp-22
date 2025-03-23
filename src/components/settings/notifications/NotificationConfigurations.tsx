
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { useAdminCheck } from '@/components/dashboard/sidebar/useAdminCheck';
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { AlertCircle, Bell, Info, Loader2, SaveIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface NotificationConfig {
  id: string;
  tipo: string;
  titulo: string;
  descricao: string;
  ativo: boolean;
  frequencia: string;
}

const NotificationConfigurations: React.FC = () => {
  const { user } = useAuth();
  const { isAdmin } = useAdminCheck(user);
  const { toast } = useToast();
  const [configurations, setConfigurations] = useState<NotificationConfig[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchConfigurations();
  }, []);

  const fetchConfigurations = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('configuracoes_notificacoes')
        .select('*')
        .order('tipo');
      
      if (error) throw error;
      
      setConfigurations(data || []);
    } catch (error) {
      console.error('Erro ao carregar configurações de notificações:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as configurações de notificações.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleActive = (id: string, active: boolean) => {
    if (!isAdmin) return;
    
    setConfigurations(prev => 
      prev.map(config => 
        config.id === id ? { ...config, ativo: active } : config
      )
    );
  };

  const handleChangeFrequency = (id: string, frequency: string) => {
    if (!isAdmin) return;
    
    setConfigurations(prev => 
      prev.map(config => 
        config.id === id ? { ...config, frequencia: frequency } : config
      )
    );
  };

  const saveChanges = async () => {
    if (!isAdmin) return;
    
    try {
      setIsSaving(true);
      
      for (const config of configurations) {
        const { error } = await supabase
          .from('configuracoes_notificacoes')
          .update({ 
            ativo: config.ativo, 
            frequencia: config.frequencia,
            atualizado_em: new Date().toISOString()
          })
          .eq('id', config.id);
          
        if (error) throw error;
      }
      
      toast({
        title: "Sucesso",
        description: "Configurações de notificações atualizadas com sucesso.",
      });
    } catch (error) {
      console.error('Erro ao salvar configurações de notificações:', error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar as configurações de notificações.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {!isAdmin && (
        <Alert variant="warning">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Acesso Limitado</AlertTitle>
          <AlertDescription>
            Você está vendo as configurações atuais, mas apenas administradores podem alterá-las.
          </AlertDescription>
        </Alert>
      )}
      
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Tipos de Notificações</h3>
        
        {isAdmin && (
          <Button 
            onClick={saveChanges} 
            disabled={isSaving} 
            className="flex items-center gap-2"
          >
            {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <SaveIcon className="h-4 w-4" />}
            Salvar Alterações
          </Button>
        )}
      </div>
      
      <div className="grid grid-cols-1 gap-4">
        {configurations.map((config) => (
          <Card key={config.id} className="overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-base font-medium flex items-center gap-2">
                    {config.titulo}
                    <Badge variant={config.ativo ? "default" : "outline"}>
                      {config.ativo ? "Ativo" : "Inativo"}
                    </Badge>
                  </CardTitle>
                  <CardDescription className="mt-1">{config.descricao}</CardDescription>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id={`active-${config.id}`}
                    checked={config.ativo}
                    onCheckedChange={(checked) => handleToggleActive(config.id, checked)}
                    disabled={!isAdmin}
                  />
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="pt-2 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center space-x-2">
                  <Label htmlFor={`frequency-${config.id}`} className="text-sm">
                    Frequência:
                  </Label>
                  <Select
                    value={config.frequencia}
                    onValueChange={(value) => handleChangeFrequency(config.id, value)}
                    disabled={!isAdmin || !config.ativo}
                  >
                    <SelectTrigger className="w-[180px]" id={`frequency-${config.id}`}>
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="imediata">Imediata</SelectItem>
                      <SelectItem value="diaria">Diária</SelectItem>
                      <SelectItem value="semanal">Semanal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="text-xs text-muted-foreground flex items-center">
                  <Info className="h-3 w-3 mr-1" /> 
                  Tipo: <code className="ml-1 text-xs bg-muted p-1 rounded">{config.tipo}</code>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {configurations.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Bell className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-700">Nenhuma configuração encontrada</h3>
            <p className="text-sm text-gray-500 mt-2">
              Não há configurações de notificações disponíveis no momento
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationConfigurations;
