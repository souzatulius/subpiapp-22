
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { supabase } from '@/integrations/supabase/client';
import { ToggleLeft } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface NotificationConfig {
  id: string;
  titulo: string;
  tipo: string;
  descricao: string;
  ativo: boolean;
  frequencia: string;
}

interface NotificationTemplate {
  id: string;
  configuracao_id: string;
  tipo_envio: string;
  conteudo: string;
}

const NotificationConfigurations = () => {
  const [configs, setConfigs] = useState<NotificationConfig[]>([]);
  const [templates, setTemplates] = useState<{ [key: string]: NotificationTemplate[] }>({});
  const [loading, setLoading] = useState(true);
  const [editingConfig, setEditingConfig] = useState<NotificationConfig | null>(null);
  const [editingTemplate, setEditingTemplate] = useState<NotificationTemplate | null>(null);
  
  // Form states
  const [title, setTitle] = useState('');
  const [type, setType] = useState('');
  const [description, setDescription] = useState('');
  const [active, setActive] = useState(true);
  const [frequency, setFrequency] = useState('imediata');
  const [templateContent, setTemplateContent] = useState('');
  const [templateType, setTemplateType] = useState('app');
  
  const [isConfigDialogOpen, setIsConfigDialogOpen] = useState(false);
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isTemplateDeleteDialogOpen, setIsTemplateDeleteDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchConfigurations();
  }, []);

  const fetchConfigurations = async () => {
    setLoading(true);
    try {
      // Fetch notification configurations
      const { data: configsData, error: configsError } = await supabase
        .from('configuracoes_notificacoes')
        .select('*')
        .order('titulo');

      if (configsError) throw configsError;
      setConfigs(configsData || []);

      // Fetch templates for each configuration
      const templatesMap: { [key: string]: NotificationTemplate[] } = {};
      
      for (const config of configsData || []) {
        const { data: templatesData, error: templatesError } = await supabase
          .from('templates_notificacoes')
          .select('*')
          .eq('configuracao_id', config.id);
          
        if (templatesError) throw templatesError;
        templatesMap[config.id] = templatesData || [];
      }
      
      setTemplates(templatesMap);
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar as configurações. Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const openConfigDialog = (config?: NotificationConfig) => {
    if (config) {
      // Edit existing config
      setEditingConfig(config);
      setTitle(config.titulo);
      setType(config.tipo);
      setDescription(config.descricao || '');
      setActive(config.ativo);
      setFrequency(config.frequencia || 'imediata');
    } else {
      // New config
      setEditingConfig(null);
      setTitle('');
      setType('');
      setDescription('');
      setActive(true);
      setFrequency('imediata');
    }
    setIsConfigDialogOpen(true);
  };

  const openTemplateDialog = (configId: string, template?: NotificationTemplate) => {
    if (template) {
      // Edit existing template
      setEditingTemplate(template);
      setTemplateContent(template.conteudo);
      setTemplateType(template.tipo_envio);
    } else {
      // New template
      setEditingTemplate(null);
      setTemplateContent('');
      setTemplateType('app');
    }
    // Set the associated config ID
    const config = configs.find(c => c.id === configId);
    if (config) {
      setEditingConfig(config);
    }
    setIsTemplateDialogOpen(true);
  };

  const handleSaveConfig = async () => {
    setIsSubmitting(true);
    try {
      const configData = {
        titulo: title,
        tipo: type,
        descricao: description,
        ativo: active,
        frequencia: frequency,
      };

      let result;
      if (editingConfig) {
        // Update existing config
        const { data, error } = await supabase
          .from('configuracoes_notificacoes')
          .update(configData)
          .eq('id', editingConfig.id)
          .select();
          
        if (error) throw error;
        result = data?.[0];
        
        // Update in state
        setConfigs(configs.map(c => 
          c.id === editingConfig.id ? { ...c, ...configData } : c
        ));
      } else {
        // Insert new config
        const { data, error } = await supabase
          .from('configuracoes_notificacoes')
          .insert(configData)
          .select();
          
        if (error) throw error;
        result = data?.[0];
        
        // Add to state
        if (result) {
          setConfigs([...configs, result]);
          setTemplates({
            ...templates,
            [result.id]: []
          });
        }
      }

      toast({
        title: editingConfig ? 'Configuração atualizada' : 'Configuração criada',
        description: editingConfig 
          ? 'A configuração foi atualizada com sucesso.'
          : 'Uma nova configuração foi criada com sucesso.',
      });
      
      setIsConfigDialogOpen(false);
    } catch (error) {
      console.error('Erro ao salvar configuração:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível salvar a configuração. Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveTemplate = async () => {
    if (!editingConfig) return;
    
    setIsSubmitting(true);
    try {
      const templateData = {
        configuracao_id: editingConfig.id,
        tipo_envio: templateType,
        conteudo: templateContent,
      };

      let result;
      if (editingTemplate) {
        // Update existing template
        const { data, error } = await supabase
          .from('templates_notificacoes')
          .update(templateData)
          .eq('id', editingTemplate.id)
          .select();
          
        if (error) throw error;
        result = data?.[0];
        
        // Update in state
        const updatedTemplates = { ...templates };
        updatedTemplates[editingConfig.id] = (updatedTemplates[editingConfig.id] || []).map(t => 
          t.id === editingTemplate.id ? { ...t, ...templateData } : t
        );
        setTemplates(updatedTemplates);
      } else {
        // Insert new template
        const { data, error } = await supabase
          .from('templates_notificacoes')
          .insert(templateData)
          .select();
          
        if (error) throw error;
        result = data?.[0];
        
        // Add to state
        if (result) {
          const updatedTemplates = { ...templates };
          updatedTemplates[editingConfig.id] = [
            ...(updatedTemplates[editingConfig.id] || []),
            result
          ];
          setTemplates(updatedTemplates);
        }
      }

      toast({
        title: editingTemplate ? 'Template atualizado' : 'Template criado',
        description: editingTemplate 
          ? 'O template foi atualizado com sucesso.'
          : 'Um novo template foi criado com sucesso.',
      });
      
      setIsTemplateDialogOpen(false);
    } catch (error) {
      console.error('Erro ao salvar template:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível salvar o template. Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfig = async () => {
    if (!editingConfig) return;
    
    setIsSubmitting(true);
    try {
      // First, delete all associated templates
      await supabase
        .from('templates_notificacoes')
        .delete()
        .eq('configuracao_id', editingConfig.id);
      
      // Then delete the config
      const { error } = await supabase
        .from('configuracoes_notificacoes')
        .delete()
        .eq('id', editingConfig.id);
        
      if (error) throw error;
      
      // Update state
      setConfigs(configs.filter(c => c.id !== editingConfig.id));
      
      // Remove templates for this config
      const updatedTemplates = { ...templates };
      delete updatedTemplates[editingConfig.id];
      setTemplates(updatedTemplates);

      toast({
        title: 'Configuração excluída',
        description: 'A configuração foi excluída com sucesso.',
      });
      
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error('Erro ao excluir configuração:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível excluir a configuração. Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteTemplate = async () => {
    if (!editingTemplate) return;
    
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('templates_notificacoes')
        .delete()
        .eq('id', editingTemplate.id);
        
      if (error) throw error;
      
      // Update state
      if (editingConfig) {
        const updatedTemplates = { ...templates };
        updatedTemplates[editingConfig.id] = (updatedTemplates[editingConfig.id] || [])
          .filter(t => t.id !== editingTemplate.id);
        setTemplates(updatedTemplates);
      }

      toast({
        title: 'Template excluído',
        description: 'O template foi excluído com sucesso.',
      });
      
      setIsTemplateDeleteDialogOpen(false);
    } catch (error) {
      console.error('Erro ao excluir template:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível excluir o template. Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleConfigActive = async (config: NotificationConfig) => {
    try {
      const newActiveState = !config.ativo;
      
      const { error } = await supabase
        .from('configuracoes_notificacoes')
        .update({ ativo: newActiveState })
        .eq('id', config.id);
        
      if (error) throw error;
      
      // Update state
      setConfigs(configs.map(c => 
        c.id === config.id ? { ...c, ativo: newActiveState } : c
      ));

      toast({
        title: newActiveState ? 'Configuração ativada' : 'Configuração desativada',
        description: `A configuração "${config.titulo}" foi ${newActiveState ? 'ativada' : 'desativada'} com sucesso.`,
      });
    } catch (error) {
      console.error('Erro ao alterar status da configuração:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível alterar o status da configuração. Tente novamente.',
        variant: 'destructive',
      });
    }
  };

  const getFrequencyLabel = (value: string): string => {
    switch (value) {
      case 'imediata':
        return 'Imediata';
      case 'diario':
        return 'Diário';
      case 'semanal':
        return 'Semanal';
      default:
        return value;
    }
  };

  const getTemplateTypeLabel = (value: string): string => {
    switch (value) {
      case 'app':
        return 'Aplicativo';
      case 'email':
        return 'Email';
      case 'sms':
        return 'SMS';
      default:
        return value;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Configurações de Notificações</h2>
        <Button onClick={() => openConfigDialog()}>Nova Configuração</Button>
      </div>

      {loading ? (
        <div className="text-center py-10">Carregando configurações...</div>
      ) : configs.length === 0 ? (
        <Card>
          <CardContent className="text-center py-10">
            <p className="text-muted-foreground">Nenhuma configuração encontrada.</p>
            <Button 
              onClick={() => openConfigDialog()} 
              className="mt-4"
            >
              Criar primeira configuração
            </Button>
          </CardContent>
        </Card>
      ) : (
        configs.map((config) => (
          <Card key={config.id} className={!config.ativo ? 'opacity-70' : ''}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {config.titulo}
                    <span className="text-sm font-normal bg-slate-100 px-2 py-1 rounded">
                      {config.tipo}
                    </span>
                    {!config.ativo && (
                      <span className="text-sm font-normal bg-red-100 text-red-800 px-2 py-1 rounded">
                        Desativado
                      </span>
                    )}
                  </CardTitle>
                  {config.descricao && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {config.descricao}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={config.ativo}
                    onCheckedChange={() => toggleConfigActive(config)}
                  />
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => openConfigDialog(config)}
                  >
                    Editar
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => {
                      setEditingConfig(config);
                      setIsDeleteDialogOpen(true);
                    }}
                  >
                    Excluir
                  </Button>
                </div>
              </div>
              <div className="flex gap-4 mt-2 text-sm">
                <span className="text-muted-foreground">
                  Frequência: {getFrequencyLabel(config.frequencia || 'imediata')}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-4 flex justify-between items-center">
                <h3 className="font-medium">Templates</h3>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => openTemplateDialog(config.id)}
                >
                  Adicionar Template
                </Button>
              </div>
              
              {templates[config.id]?.length > 0 ? (
                <div className="space-y-4">
                  {templates[config.id].map((template) => (
                    <div 
                      key={template.id} 
                      className="p-4 border rounded-lg"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 text-sm rounded">
                          {getTemplateTypeLabel(template.tipo_envio)}
                        </span>
                        <div className="flex gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => openTemplateDialog(config.id, template)}
                          >
                            Editar
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="text-red-600 hover:text-red-800 hover:bg-red-50"
                            onClick={() => {
                              setEditingTemplate(template);
                              setEditingConfig(config);
                              setIsTemplateDeleteDialogOpen(true);
                            }}
                          >
                            Excluir
                          </Button>
                        </div>
                      </div>
                      <div className="whitespace-pre-wrap bg-slate-50 p-2 rounded-md text-sm">
                        {template.conteudo}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  Nenhum template definido para esta configuração.
                </div>
              )}
            </CardContent>
          </Card>
        ))
      )}

      {/* Configuration Dialog */}
      <Dialog open={isConfigDialogOpen} onOpenChange={setIsConfigDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingConfig ? 'Editar Configuração' : 'Nova Configuração'}</DialogTitle>
            <DialogDescription>
              {editingConfig 
                ? 'Edite os detalhes da configuração de notificação.'
                : 'Defina os detalhes para a nova configuração de notificação.'
              }
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Título</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="ex: Nova Demanda Criada"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="type">Tipo</Label>
              <Input
                id="type"
                value={type}
                onChange={(e) => setType(e.target.value)}
                placeholder="ex: demanda_criada"
              />
              <p className="text-xs text-muted-foreground">
                Identificador único para este tipo de notificação (sem espaços ou caracteres especiais)
              </p>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description">Descrição (opcional)</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Descrição detalhada desta configuração..."
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="frequency">Frequência</Label>
              <Select
                value={frequency}
                onValueChange={setFrequency}
              >
                <SelectTrigger id="frequency">
                  <SelectValue placeholder="Selecione a frequência" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="imediata">Imediata</SelectItem>
                  <SelectItem value="diario">Diário</SelectItem>
                  <SelectItem value="semanal">Semanal</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center gap-2">
              <Switch
                id="active"
                checked={active}
                onCheckedChange={setActive}
              />
              <Label htmlFor="active">Ativo</Label>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsConfigDialogOpen(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleSaveConfig}
              disabled={isSubmitting || !title || !type}
            >
              {isSubmitting ? 'Salvando...' : 'Salvar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Template Dialog */}
      <Dialog open={isTemplateDialogOpen} onOpenChange={setIsTemplateDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingTemplate ? 'Editar Template' : 'Novo Template'}
              {editingConfig && (
                <span className="ml-2 font-normal text-base">
                  para "{editingConfig.titulo}"
                </span>
              )}
            </DialogTitle>
            <DialogDescription>
              {editingTemplate 
                ? 'Edite o conteúdo do template para este tipo de notificação.'
                : 'Defina o conteúdo para o novo template de notificação.'
              }
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="templateType">Tipo de Envio</Label>
              <Select
                value={templateType}
                onValueChange={setTemplateType}
              >
                <SelectTrigger id="templateType">
                  <SelectValue placeholder="Selecione o tipo de envio" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="app">Aplicativo</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="sms">SMS</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="templateContent">Conteúdo do Template</Label>
              <Textarea
                id="templateContent"
                value={templateContent}
                onChange={(e) => setTemplateContent(e.target.value)}
                placeholder="Conteúdo do template..."
                className="min-h-[200px]"
              />
              <p className="text-xs text-muted-foreground">
                Use placeholders como {'{nome_usuario}'}, {'{titulo_demanda}'}, etc. para dados dinâmicos.
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsTemplateDialogOpen(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleSaveTemplate}
              disabled={isSubmitting || !templateContent}
            >
              {isSubmitting ? 'Salvando...' : 'Salvar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Configuration Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Excluir Configuração</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir esta configuração de notificação?
              {editingConfig?.titulo && (
                <span className="font-semibold block mt-2">
                  "{editingConfig.titulo}"
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          
          <p className="text-sm text-red-600">
            Atenção: Esta ação não pode ser desfeita. Todos os templates associados também serão excluídos.
          </p>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button 
              variant="destructive"
              onClick={handleDeleteConfig}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Excluindo...' : 'Excluir Permanentemente'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Template Dialog */}
      <Dialog open={isTemplateDeleteDialogOpen} onOpenChange={setIsTemplateDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Excluir Template</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir este template de notificação?
              {editingConfig?.titulo && (
                <span className="block mt-2">
                  Tipo: <span className="font-semibold">{editingTemplate?.tipo_envio}</span>
                  <br />
                  Configuração: <span className="font-semibold">{editingConfig.titulo}</span>
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          
          <p className="text-sm text-red-600">
            Atenção: Esta ação não pode ser desfeita.
          </p>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsTemplateDeleteDialogOpen(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button 
              variant="destructive"
              onClick={handleDeleteTemplate}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Excluindo...' : 'Excluir Permanentemente'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NotificationConfigurations;
