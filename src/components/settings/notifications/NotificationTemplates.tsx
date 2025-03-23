
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { MessageSquare, Plus, Save, Loader2, FileText } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface NotificationConfig {
  id: string;
  tipo: string;
  titulo: string;
  descricao: string;
}

interface NotificationTemplate {
  id: string;
  configuracao_id: string;
  conteudo: string;
  tipo_envio: string;
}

const NotificationTemplates: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [configurations, setConfigurations] = useState<NotificationConfig[]>([]);
  const [templates, setTemplates] = useState<NotificationTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTemplate, setActiveTemplate] = useState<NotificationTemplate | null>(null);
  const [editContent, setEditContent] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newTemplate, setNewTemplate] = useState({
    configuracao_id: '',
    conteudo: '',
    tipo_envio: 'app'
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch configurations
      const { data: configData, error: configError } = await supabase
        .from('configuracoes_notificacoes')
        .select('id, tipo, titulo, descricao')
        .order('titulo');
      
      if (configError) throw configError;
      
      // Fetch templates
      const { data: templateData, error: templateError } = await supabase
        .from('templates_notificacoes')
        .select('*');
      
      if (templateError) throw templateError;
      
      setConfigurations(configData || []);
      setTemplates(templateData || []);
      
      // Set active template if any exists
      if (templateData && templateData.length > 0) {
        setActiveTemplate(templateData[0]);
        setEditContent(templateData[0].conteudo);
      }
    } catch (error) {
      console.error('Erro ao carregar dados de templates:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os templates de notificações.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTemplateSelect = (template: NotificationTemplate) => {
    setActiveTemplate(template);
    setEditContent(template.conteudo);
    setIsEditing(false);
  };

  const startEditing = () => {
    setIsEditing(true);
  };

  const cancelEditing = () => {
    if (activeTemplate) {
      setEditContent(activeTemplate.conteudo);
    }
    setIsEditing(false);
  };

  const saveTemplate = async () => {
    if (!activeTemplate) return;
    
    try {
      setIsSaving(true);
      
      const { error } = await supabase
        .from('templates_notificacoes')
        .update({ 
          conteudo: editContent,
          atualizado_em: new Date().toISOString()
        })
        .eq('id', activeTemplate.id);
        
      if (error) throw error;
      
      // Update local state
      setTemplates(prev => 
        prev.map(t => 
          t.id === activeTemplate.id ? { ...t, conteudo: editContent } : t
        )
      );
      setActiveTemplate({ ...activeTemplate, conteudo: editContent });
      setIsEditing(false);
      
      toast({
        title: "Sucesso",
        description: "Template de notificação atualizado com sucesso.",
      });
    } catch (error) {
      console.error('Erro ao salvar template:', error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar o template de notificação.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const createNewTemplate = async () => {
    try {
      if (!newTemplate.configuracao_id || !newTemplate.conteudo) {
        toast({
          title: "Campos obrigatórios",
          description: "Preencha todos os campos obrigatórios.",
          variant: "destructive"
        });
        return;
      }
      
      setIsSaving(true);
      
      const { data, error } = await supabase
        .from('templates_notificacoes')
        .insert({
          configuracao_id: newTemplate.configuracao_id,
          conteudo: newTemplate.conteudo,
          tipo_envio: newTemplate.tipo_envio
        })
        .select();
        
      if (error) throw error;
      
      // Add to templates list
      if (data && data.length > 0) {
        setTemplates(prev => [...prev, data[0]]);
        setActiveTemplate(data[0]);
        setEditContent(data[0].conteudo);
      }
      
      // Reset form
      setNewTemplate({
        configuracao_id: '',
        conteudo: '',
        tipo_envio: 'app'
      });
      setIsDialogOpen(false);
      
      toast({
        title: "Sucesso",
        description: "Novo template de notificação criado com sucesso.",
      });
    } catch (error) {
      console.error('Erro ao criar template:', error);
      toast({
        title: "Erro",
        description: "Não foi possível criar o template de notificação.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const getConfigName = (configId: string) => {
    const config = configurations.find(c => c.id === configId);
    return config ? config.titulo : 'Desconhecido';
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
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Templates de Notificações</h3>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Novo Template
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[625px]">
            <DialogHeader>
              <DialogTitle>Criar Novo Template</DialogTitle>
              <DialogDescription>
                Crie um novo template para envio de notificações aos usuários.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="tipo">Tipo de Notificação</Label>
                <Select
                  value={newTemplate.configuracao_id}
                  onValueChange={(value) => setNewTemplate(prev => ({ ...prev, configuracao_id: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo..." />
                  </SelectTrigger>
                  <SelectContent>
                    {configurations.map(config => (
                      <SelectItem key={config.id} value={config.id}>
                        {config.titulo}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="tipoEnvio">Método de Envio</Label>
                <Select
                  value={newTemplate.tipo_envio}
                  onValueChange={(value) => setNewTemplate(prev => ({ ...prev, tipo_envio: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="app">App (Push)</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="sms">SMS</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="conteudo">Conteúdo</Label>
                <Textarea
                  id="conteudo"
                  rows={6}
                  value={newTemplate.conteudo}
                  onChange={(e) => setNewTemplate(prev => ({ ...prev, conteudo: e.target.value }))}
                  placeholder="Digite o conteúdo do template..."
                />
                <p className="text-xs text-muted-foreground">
                  Use {"{nome}"} para incluir o nome do usuário e {"{info}"} para informações específicas.
                </p>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
              <Button onClick={createNewTemplate} disabled={isSaving}>
                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Criar Template
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      {templates.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <MessageSquare className="h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-700">Nenhum template encontrado</h3>
          <p className="text-sm text-gray-500 mt-2 mb-4">
            Crie templates para diferentes tipos de notificações
          </p>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Criar Primeiro Template
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Templates</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ul className="divide-y">
                  {templates.map(template => (
                    <li
                      key={template.id}
                      className={`px-4 py-3 cursor-pointer hover:bg-muted transition-colors ${
                        activeTemplate?.id === template.id ? 'bg-muted' : ''
                      }`}
                      onClick={() => handleTemplateSelect(template)}
                    >
                      <p className="font-medium text-sm">
                        {getConfigName(template.configuracao_id)}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Via: {template.tipo_envio.toUpperCase()}
                      </p>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
          
          <div className="md:col-span-2">
            {activeTemplate ? (
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div>
                    <CardTitle className="text-base font-medium">
                      {getConfigName(activeTemplate.configuracao_id)}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Via {activeTemplate.tipo_envio.toUpperCase()}
                    </p>
                  </div>
                  
                  {!isEditing ? (
                    <Button variant="outline" size="sm" onClick={startEditing}>
                      Editar
                    </Button>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={cancelEditing}>
                        Cancelar
                      </Button>
                      <Button size="sm" onClick={saveTemplate} disabled={isSaving}>
                        {isSaving && <Loader2 className="mr-2 h-3 w-3 animate-spin" />}
                        Salvar
                      </Button>
                    </div>
                  )}
                </CardHeader>
                
                <CardContent>
                  {isEditing ? (
                    <div className="space-y-2">
                      <Label htmlFor="editContent">Conteúdo do Template</Label>
                      <Textarea
                        id="editContent"
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        rows={8}
                        className="font-mono text-sm"
                      />
                      <p className="text-xs text-muted-foreground">
                        Use {"{nome}"} para incluir o nome do usuário e {"{info}"} para informações específicas.
                      </p>
                    </div>
                  ) : (
                    <div className="rounded-md bg-muted p-4 font-mono text-sm whitespace-pre-wrap">
                      {activeTemplate.conteudo}
                    </div>
                  )}
                </CardContent>
                
                <CardFooter className="text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <FileText className="h-3 w-3" />
                    Última atualização: {new Date(activeTemplate.atualizado_em).toLocaleDateString('pt-BR')}
                  </div>
                </CardFooter>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-6 text-center text-muted-foreground">
                  Selecione um template para visualizar ou editar
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationTemplates;
