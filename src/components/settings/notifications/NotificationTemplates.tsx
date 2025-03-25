
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Edit, Plus, Trash2, AlertTriangle, Info, X, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Template {
  id: string;
  conteudo: string;
  tipo_envio: string;
  configuracao_id?: string;
  configuracao?: {
    titulo: string;
    tipo: string;
  };
}

interface TemplateFormData {
  id?: string;
  conteudo: string;
  tipo_envio: string;
  configuracao_id?: string;
}

const NotificationTemplates: React.FC = () => {
  const { toast } = useToast();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<TemplateFormData>({
    conteudo: '',
    tipo_envio: 'app',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [configurations, setConfigurations] = useState<Array<{id: string, titulo: string, tipo: string}>>([]);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchTemplates();
    fetchConfigurations();
  }, []);

  const fetchTemplates = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('templates_notificacoes')
        .select(`
          *,
          configuracao:configuracao_id (
            titulo,
            tipo
          )
        `)
        .order('criado_em', { ascending: false });
      
      if (error) throw error;
      
      setTemplates(data || []);
    } catch (error) {
      console.error('Erro ao buscar templates:', error);
      toast({
        title: "Erro ao carregar templates",
        description: "Não foi possível carregar os templates de notificação.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchConfigurations = async () => {
    try {
      const { data, error } = await supabase
        .from('configuracoes_notificacoes')
        .select('id, titulo, tipo')
        .eq('ativo', true);
      
      if (error) throw error;
      
      setConfigurations(data || []);
    } catch (error) {
      console.error('Erro ao buscar configurações:', error);
    }
  };

  const handleEdit = (template: Template) => {
    setFormData({
      id: template.id,
      conteudo: template.conteudo,
      tipo_envio: template.tipo_envio,
      configuracao_id: template.configuracao_id,
    });
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('templates_notificacoes')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setTemplates(templates.filter(template => template.id !== id));
      
      toast({
        title: "Template excluído",
        description: "O template de notificação foi excluído com sucesso.",
        variant: "success",
      });
    } catch (error) {
      console.error('Erro ao excluir template:', error);
      toast({
        title: "Erro ao excluir template",
        description: "Não foi possível excluir o template de notificação.",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      
      if (!formData.conteudo) {
        toast({
          title: "Conteúdo obrigatório",
          description: "O conteúdo do template não pode estar vazio.",
          variant: "destructive",
        });
        return;
      }
      
      if (isEditing && formData.id) {
        // Update existing template
        const { error } = await supabase
          .from('templates_notificacoes')
          .update({
            conteudo: formData.conteudo,
            tipo_envio: formData.tipo_envio,
            configuracao_id: formData.configuracao_id,
            atualizado_em: new Date().toISOString(),
          })
          .eq('id', formData.id);
        
        if (error) throw error;
        
        toast({
          title: "Template atualizado",
          description: "O template de notificação foi atualizado com sucesso.",
          variant: "success",
        });
      } else {
        // Create new template
        const { error } = await supabase
          .from('templates_notificacoes')
          .insert({
            conteudo: formData.conteudo,
            tipo_envio: formData.tipo_envio,
            configuracao_id: formData.configuracao_id,
          });
        
        if (error) throw error;
        
        toast({
          title: "Template criado",
          description: "O template de notificação foi criado com sucesso.",
          variant: "success",
        });
      }
      
      // Refresh templates
      fetchTemplates();
      
      // Reset form and close dialog
      resetForm();
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Erro ao salvar template:', error);
      toast({
        title: "Erro ao salvar template",
        description: "Não foi possível salvar o template de notificação.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      conteudo: '',
      tipo_envio: 'app',
    });
    setIsEditing(false);
  };

  const handleDialogClose = () => {
    resetForm();
    setIsDialogOpen(false);
  };

  const renderTemplateType = (type: string) => {
    switch (type) {
      case 'app':
        return 'Aplicativo';
      case 'email':
        return 'E-mail';
      default:
        return type;
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
            <CardTitle className="text-lg">Templates de Notificação</CardTitle>
            <CardDescription>
              Gerencie os templates utilizados para enviar notificações
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
            Novo Template
          </Button>
        </CardHeader>
        <CardContent>
          {templates.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Info className="h-12 w-12 mx-auto text-gray-400 mb-2" />
              <p className="text-lg font-medium mb-1">Nenhum template encontrado</p>
              <p className="text-sm">
                Clique em "Novo Template" para criar seu primeiro template de notificação.
              </p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[40%]">Conteúdo</TableHead>
                    <TableHead>Tipo de Notificação</TableHead>
                    <TableHead>Canal</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {templates.map((template) => (
                    <TableRow key={template.id}>
                      <TableCell className="font-medium">
                        {template.conteudo.length > 70
                          ? template.conteudo.substring(0, 70) + '...'
                          : template.conteudo}
                      </TableCell>
                      <TableCell>
                        {template.configuracao?.titulo || 'Sem configuração'}
                      </TableCell>
                      <TableCell>
                        {renderTemplateType(template.tipo_envio)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleEdit(template)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleDelete(template.id)}
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

      {/* Template Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? 'Editar Template' : 'Novo Template de Notificação'}
            </DialogTitle>
            <DialogDescription>
              Customize a mensagem enviada para cada tipo de notificação.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="configuracao">Tipo de Notificação</Label>
                <Select
                  value={formData.configuracao_id || 'select-config'}
                  onValueChange={(value) => 
                    setFormData({ ...formData, configuracao_id: value === 'select-config' ? undefined : value })
                  }
                >
                  <SelectTrigger id="configuracao">
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="select-config">Selecione...</SelectItem>
                    {configurations.map((config) => (
                      <SelectItem key={config.id} value={config.id}>
                        {config.titulo} ({config.tipo})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="tipo_envio">Canal de Envio</Label>
                <Select
                  value={formData.tipo_envio}
                  onValueChange={(value) => 
                    setFormData({ ...formData, tipo_envio: value })
                  }
                >
                  <SelectTrigger id="tipo_envio">
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="app">Aplicativo</SelectItem>
                    <SelectItem value="email">E-mail</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="conteudo">Conteúdo da Mensagem</Label>
              <Textarea
                id="conteudo"
                value={formData.conteudo}
                onChange={(e) => setFormData({ ...formData, conteudo: e.target.value })}
                rows={6}
                placeholder="Digite o conteúdo do template..."
              />
              <p className="text-xs text-gray-500">
                Você pode usar as variáveis: {'{usuario_nome}'}, {'{demanda_titulo}'}, {'{nota_titulo}'}
              </p>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" onClick={handleDialogClose}>
                Cancelar
              </Button>
            </DialogClose>
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditing ? 'Atualizar' : 'Criar'} Template
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NotificationTemplates;
