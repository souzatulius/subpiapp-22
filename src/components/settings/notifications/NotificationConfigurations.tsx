import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Edit, Plus, Trash2, Loader2, ToggleLeft, Info } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";

interface NotificationConfig {
  id: string;
  titulo: string;
  tipo: string;
  descricao: string | null;
  frequencia: string;
  ativo: boolean;
}

interface ConfigFormData {
  id?: string;
  titulo: string;
  tipo: string;
  descricao: string;
  frequencia: string;
  ativo: boolean;
}

const NotificationConfigurations: React.FC = () => {
  const { toast } = useToast();
  const [configs, setConfigs] = useState<NotificationConfig[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<ConfigFormData>({
    titulo: '',
    tipo: 'demanda',
    descricao: '',
    frequencia: 'imediata',
    ativo: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchConfigurations();
  }, []);

  const fetchConfigurations = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('configuracoes_notificacoes')
        .select('*')
        .order('tipo', { ascending: true });
      
      if (error) throw error;
      
      setConfigs(data || []);
    } catch (error) {
      console.error('Erro ao buscar configurações:', error);
      toast({
        title: "Erro ao carregar configurações",
        description: "Não foi possível carregar as configurações de notificação.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (config: NotificationConfig) => {
    setFormData({
      id: config.id,
      titulo: config.titulo,
      tipo: config.tipo,
      descricao: config.descricao || '',
      frequencia: config.frequencia || 'imediata',
      ativo: config.ativo,
    });
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const handleToggleActive = async (id: string, currentActive: boolean) => {
    try {
      const { error } = await supabase
        .from('configuracoes_notificacoes')
        .update({ ativo: !currentActive })
        .eq('id', id);
      
      if (error) throw error;
      
      setConfigs(configs.map(config => 
        config.id === id ? { ...config, ativo: !currentActive } : config
      ));
      
      toast({
        title: `Notificação ${!currentActive ? 'ativada' : 'desativada'}`,
        description: `A notificação foi ${!currentActive ? 'ativada' : 'desativada'} com sucesso.`,
        variant: "success",
      });
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      toast({
        title: "Erro ao atualizar status",
        description: "Não foi possível atualizar o status da notificação.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('configuracoes_notificacoes')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setConfigs(configs.filter(config => config.id !== id));
      
      toast({
        title: "Configuração excluída",
        description: "A configuração de notificação foi excluída com sucesso.",
        variant: "success",
      });
    } catch (error) {
      console.error('Erro ao excluir configuração:', error);
      toast({
        title: "Erro ao excluir",
        description: "Não foi possível excluir a configuração de notificação.",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      
      if (!formData.titulo || !formData.tipo) {
        toast({
          title: "Campos obrigatórios",
          description: "Preencha todos os campos obrigatórios.",
          variant: "destructive",
        });
        return;
      }
      
      if (isEditing && formData.id) {
        const { error } = await supabase
          .from('configuracoes_notificacoes')
          .update({
            titulo: formData.titulo,
            tipo: formData.tipo,
            descricao: formData.descricao || null,
            frequencia: formData.frequencia,
            ativo: formData.ativo,
            atualizado_em: new Date().toISOString(),
          })
          .eq('id', formData.id);
        
        if (error) throw error;
        
        toast({
          title: "Configuração atualizada",
          description: "A configuração de notificação foi atualizada com sucesso.",
          variant: "success",
        });
      } else {
        const { error } = await supabase
          .from('configuracoes_notificacoes')
          .insert({
            titulo: formData.titulo,
            tipo: formData.tipo,
            descricao: formData.descricao || null,
            frequencia: formData.frequencia,
            ativo: formData.ativo,
          });
        
        if (error) throw error;
        
        toast({
          title: "Configuração criada",
          description: "A configuração de notificação foi criada com sucesso.",
          variant: "success",
        });
      }
      
      fetchConfigurations();
      
      resetForm();
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Erro ao salvar configuração:', error);
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar a configuração de notificação.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      titulo: '',
      tipo: 'demanda',
      descricao: '',
      frequencia: 'imediata',
      ativo: true,
    });
    setIsEditing(false);
  };

  const handleDialogClose = () => {
    resetForm();
    setIsDialogOpen(false);
  };

  const renderNotificationType = (type: string) => {
    switch (type) {
      case 'demanda':
        return <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100 border-green-200">Demanda</Badge>;
      case 'nota':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100 border-blue-200">Nota Oficial</Badge>;
      case 'sistema':
        return <Badge variant="outline" className="bg-purple-100 text-purple-800 hover:bg-purple-100 border-purple-200">Sistema</Badge>;
      case 'comunicado':
        return <Badge variant="outline" className="bg-amber-100 text-amber-800 hover:bg-amber-100 border-amber-200">Comunicado</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  const renderFrequency = (frequency: string) => {
    switch (frequency) {
      case 'imediata':
        return 'Imediata';
      case 'agrupada':
        return 'Agrupada (a cada hora)';
      case 'diaria':
        return 'Diária (resumo)';
      default:
        return frequency;
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
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle className="text-lg">Configurações de Notificações</CardTitle>
            <CardDescription>
              Gerencie os tipos de notificações que o sistema pode enviar
            </CardDescription>
          </div>
          <Button 
            onClick={() => {
              resetForm();
              setIsDialogOpen(true);
            }}
            className="flex items-center gap-1"
          >
            <Plus className="h-4 w-4" />
            Nova Configuração
          </Button>
        </CardHeader>
        <CardContent>
          {configs.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Info className="h-12 w-12 mx-auto text-gray-400 mb-2" />
              <p className="text-lg font-medium mb-1">Nenhuma configuração encontrada</p>
              <p className="text-sm">
                Clique em "Nova Configuração" para criar sua primeira configuração de notificação.
              </p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Título</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Frequência</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {configs.map((config) => (
                    <TableRow key={config.id}>
                      <TableCell className="font-medium">
                        {config.titulo}
                      </TableCell>
                      <TableCell>
                        {renderNotificationType(config.tipo)}
                      </TableCell>
                      <TableCell>
                        {renderFrequency(config.frequencia)}
                      </TableCell>
                      <TableCell>
                        <Switch 
                          checked={config.ativo} 
                          onCheckedChange={() => handleToggleActive(config.id, config.ativo)}
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleEdit(config)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleDelete(config.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <

