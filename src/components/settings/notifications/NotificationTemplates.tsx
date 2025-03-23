
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle, Edit, Plus, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';

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
  criado_em: string;
  atualizado_em: string;
  configuracao?: NotificationConfig;
}

interface TemplateFormData {
  id?: string;
  configuracao_id: string;
  conteudo: string;
  tipo_envio: string;
}

const NotificationTemplates = () => {
  const [templates, setTemplates] = useState<NotificationTemplate[]>([]);
  const [configs, setConfigs] = useState<NotificationConfig[]>([]);
  const [selectedEnvio, setSelectedEnvio] = useState<string>('app');
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentTemplate, setCurrentTemplate] = useState<NotificationTemplate | null>(null);
  const [formData, setFormData] = useState<TemplateFormData>({
    configuracao_id: '',
    conteudo: '',
    tipo_envio: 'app'
  });
  const { toast } = useToast();
  const { user } = useAuth();

  // Fetch templates and configurations
  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        
        // Fetch notification configurations
        const { data: configsData, error: configsError } = await supabase
          .from('configuracoes_notificacoes')
          .select('id, tipo, titulo, descricao')
          .order('titulo');
          
        if (configsError) throw configsError;
        setConfigs(configsData || []);
        
        // Fetch templates
        const { data: templatesData, error: templatesError } = await supabase
          .from('templates_notificacoes')
          .select(`
            *,
            configuracao:configuracao_id(id, tipo, titulo, descricao)
          `)
          .order('tipo_envio');
          
        if (templatesError) throw templatesError;
        setTemplates(templatesData || []);
      } catch (error: any) {
        console.error('Erro ao carregar templates de notificações:', error);
        toast({
          title: 'Erro',
          description: 'Não foi possível carregar os templates de notificações.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [user, toast]);

  // Filter templates by tipo_envio
  const filteredTemplates = templates.filter(template => 
    template.tipo_envio === selectedEnvio
  );

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.configuracao_id || !formData.conteudo) {
      toast({
        title: 'Campos obrigatórios',
        description: 'Preencha todos os campos obrigatórios.',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      if (formData.id) {
        // Update existing template
        const { error } = await supabase
          .from('templates_notificacoes')
          .update({
            configuracao_id: formData.configuracao_id,
            conteudo: formData.conteudo,
            tipo_envio: formData.tipo_envio,
            atualizado_em: new Date().toISOString()
          })
          .eq('id', formData.id);
          
        if (error) throw error;
        
        toast({
          title: 'Template atualizado',
          description: 'O template foi atualizado com sucesso.',
        });
      } else {
        // Create new template
        const { error } = await supabase
          .from('templates_notificacoes')
          .insert({
            configuracao_id: formData.configuracao_id,
            conteudo: formData.conteudo,
            tipo_envio: formData.tipo_envio
          });
          
        if (error) throw error;
        
        toast({
          title: 'Template criado',
          description: 'O novo template foi criado com sucesso.',
        });
      }
      
      // Refresh templates
      const { data, error } = await supabase
        .from('templates_notificacoes')
        .select(`
          *,
          configuracao:configuracao_id(id, tipo, titulo, descricao)
        `)
        .order('tipo_envio');
        
      if (error) throw error;
      setTemplates(data || []);
      
      // Reset form and close dialog
      resetForm();
      setIsFormOpen(false);
    } catch (error: any) {
      console.error('Erro ao salvar template:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível salvar o template.',
        variant: 'destructive',
      });
    }
  };

  // Handle edit template
  const handleEditTemplate = (template: NotificationTemplate) => {
    setFormData({
      id: template.id,
      configuracao_id: template.configuracao_id,
      conteudo: template.conteudo,
      tipo_envio: template.tipo_envio
    });
    setIsFormOpen(true);
  };

  // Handle delete template
  const handleDeleteTemplate = async () => {
    if (!currentTemplate) return;
    
    try {
      const { error } = await supabase
        .from('templates_notificacoes')
        .delete()
        .eq('id', currentTemplate.id);
        
      if (error) throw error;
      
      // Update templates list
      setTemplates(templates.filter(t => t.id !== currentTemplate.id));
      
      toast({
        title: 'Template excluído',
        description: 'O template foi excluído com sucesso.',
      });
      
      setIsDeleteDialogOpen(false);
      setCurrentTemplate(null);
    } catch (error: any) {
      console.error('Erro ao excluir template:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível excluir o template.',
        variant: 'destructive',
      });
    }
  };

  // Reset form data
  const resetForm = () => {
    setFormData({
      configuracao_id: '',
      conteudo: '',
      tipo_envio: 'app'
    });
  };

  // Handle new template button click
  const handleNewTemplate = () => {
    resetForm();
    setFormData(prev => ({
      ...prev,
      tipo_envio: selectedEnvio
    }));
    setIsFormOpen(true);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="space-y-2">
                <div className="h-6 w-40 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-20 bg-gray-200 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardContent className="pt-6">
          <Tabs value={selectedEnvio} onValueChange={setSelectedEnvio} className="w-full">
            <div className="flex justify-between items-center mb-4">
              <TabsList>
                <TabsTrigger value="app">App</TabsTrigger>
                <TabsTrigger value="email">Email</TabsTrigger>
                <TabsTrigger value="push">Push</TabsTrigger>
              </TabsList>
              
              <Button onClick={handleNewTemplate} className="flex items-center">
                <Plus className="h-4 w-4 mr-2" />
                Novo Template
              </Button>
            </div>
            
            <TabsContent value="app" className="space-y-4">
              {renderTemplatesList(filteredTemplates)}
            </TabsContent>
            
            <TabsContent value="email" className="space-y-4">
              {renderTemplatesList(filteredTemplates)}
            </TabsContent>
            
            <TabsContent value="push" className="space-y-4">
              {renderTemplatesList(filteredTemplates)}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      {/* Template Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {formData.id ? 'Editar Template' : 'Novo Template'}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="tipo">Tipo de Notificação</Label>
              <Select 
                value={formData.configuracao_id} 
                onValueChange={(value) => setFormData({...formData, configuracao_id: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo de notificação" />
                </SelectTrigger>
                <SelectContent>
                  {configs.map(config => (
                    <SelectItem key={config.id} value={config.id}>
                      {config.titulo}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="tipo_envio">Forma de Envio</Label>
              <Select 
                value={formData.tipo_envio} 
                onValueChange={(value) => setFormData({...formData, tipo_envio: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a forma de envio" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="app">App</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="push">Push</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="conteudo">
                Conteúdo do Template
                <span className="text-xs text-gray-500 ml-2">
                  Use {'{nome}'}, {'{data}'} etc. como variáveis
                </span>
              </Label>
              <Textarea
                id="conteudo"
                value={formData.conteudo}
                onChange={(e) => setFormData({...formData, conteudo: e.target.value})}
                rows={6}
                placeholder="Digite o conteúdo do template..."
              />
            </div>
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsFormOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="submit">
                {formData.id ? 'Atualizar' : 'Criar'} Template
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
          </DialogHeader>
          <p>
            Tem certeza que deseja excluir este template? Esta ação não pode ser desfeita.
          </p>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteTemplate}
            >
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );

  // Helper function to render templates list
  function renderTemplatesList(templates: NotificationTemplate[]) {
    if (templates.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <AlertCircle className="h-10 w-10 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900">Nenhum template encontrado</h3>
          <p className="text-gray-500 mt-1 mb-4">
            Não existem templates de {selectedEnvio === 'app' ? 'aplicativo' : 
              selectedEnvio === 'email' ? 'email' : 'notificações push'} definidos.
          </p>
          <Button onClick={handleNewTemplate}>
            Criar Novo Template
          </Button>
        </div>
      );
    }
    
    return templates.map(template => (
      <div key={template.id} className="border rounded-md p-4 space-y-2">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium">{template.configuracao?.titulo || 'Template sem título'}</h3>
            <p className="text-xs text-gray-500">
              Última atualização: {template.atualizado_em ? 
                format(new Date(template.atualizado_em), 'dd/MM/yyyy HH:mm', {locale: pt}) : 
                'Data desconhecida'}
            </p>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => handleEditTemplate(template)}
            >
              <Edit className="h-4 w-4" />
              <span className="sr-only">Editar</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
              onClick={() => {
                setCurrentTemplate(template);
                setIsDeleteDialogOpen(true);
              }}
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Excluir</span>
            </Button>
          </div>
        </div>
        <pre className="bg-gray-50 p-3 rounded text-sm whitespace-pre-wrap">
          {template.conteudo}
        </pre>
      </div>
    ));
  }
};

export default NotificationTemplates;
