
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import DataTable from './DataTable';
import DataEntryForm from './DataEntryForm';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const serviceSchema = z.object({
  descricao: z.string().min(3, 'A descrição deve ter pelo menos 3 caracteres'),
  area_coordenacao_id: z.string().min(1, 'Selecione uma área de coordenação'),
});

const Services = () => {
  const [services, setServices] = useState<any[]>([]);
  const [areas, setAreas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<any>(null);

  const editForm = useForm<z.infer<typeof serviceSchema>>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      descricao: '',
      area_coordenacao_id: '',
    },
  });

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (editingService) {
      editForm.reset({
        descricao: editingService.descricao,
        area_coordenacao_id: editingService.area_coordenacao_id,
      });
    }
  }, [editingService, editForm]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch services
      const { data: servicesData, error: servicesError } = await supabase
        .from('servicos')
        .select(`
          *,
          areas_coordenacao(id, descricao)
        `)
        .order('descricao', { ascending: true });
      
      if (servicesError) throw servicesError;
      
      // Fetch areas
      const { data: areasData, error: areasError } = await supabase
        .from('areas_coordenacao')
        .select('*')
        .order('descricao', { ascending: true });
      
      if (areasError) throw areasError;
      
      setServices(servicesData || []);
      setAreas(areasData || []);
    } catch (error: any) {
      console.error('Erro ao carregar dados:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os dados',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (data: z.infer<typeof serviceSchema>) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('servicos')
        .insert({
          descricao: data.descricao,
          area_coordenacao_id: data.area_coordenacao_id,
        });
      
      if (error) throw error;
      
      await fetchData();
      return Promise.resolve();
    } catch (error: any) {
      console.error('Erro ao adicionar serviço:', error);
      return Promise.reject(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = async (data: z.infer<typeof serviceSchema>) => {
    if (!editingService) return;
    
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('servicos')
        .update({
          descricao: data.descricao,
          area_coordenacao_id: data.area_coordenacao_id,
        })
        .eq('id', editingService.id);
      
      if (error) throw error;
      
      toast({
        title: 'Serviço atualizado',
        description: 'O serviço foi atualizado com sucesso',
      });
      
      setIsEditDialogOpen(false);
      await fetchData();
    } catch (error: any) {
      console.error('Erro ao editar serviço:', error);
      toast({
        title: 'Erro',
        description: error.message || 'Ocorreu um erro ao atualizar o serviço',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (service: any) => {
    try {
      // Check if there are dependent records
      const { count, error: countError } = await supabase
        .from('demandas')
        .select('*', { count: 'exact', head: true })
        .eq('servico_id', service.id);
        
      if (countError) throw countError;
        
      if ((count || 0) > 0) {
        toast({
          title: 'Não é possível excluir',
          description: 'Existem demandas associadas a este serviço',
          variant: 'destructive',
        });
        return;
      }
      
      const { error } = await supabase
        .from('servicos')
        .delete()
        .eq('id', service.id);
      
      if (error) throw error;
      
      toast({
        title: 'Serviço excluído',
        description: 'O serviço foi excluído com sucesso',
      });
      
      await fetchData();
    } catch (error: any) {
      console.error('Erro ao excluir serviço:', error);
      toast({
        title: 'Erro',
        description: error.message || 'Ocorreu um erro ao excluir o serviço',
        variant: 'destructive',
      });
    }
  };

  const openEditDialog = (service: any) => {
    setEditingService(service);
    setIsEditDialogOpen(true);
  };

  const columns = [
    {
      key: 'descricao',
      header: 'Descrição',
    },
    {
      key: 'areas_coordenacao',
      header: 'Área de Coordenação',
      render: (row: any) => row.areas_coordenacao?.descricao || '-',
    },
    {
      key: 'criado_em',
      header: 'Data de Criação',
      render: (row: any) => new Date(row.criado_em).toLocaleDateString('pt-BR'),
    },
  ];

  const renderForm = (onClose: () => void) => (
    <DataEntryForm
      schema={serviceSchema}
      onSubmit={handleAdd}
      onCancel={onClose}
      defaultValues={{
        descricao: '',
        area_coordenacao_id: '',
      }}
      renderFields={(form) => (
        <div className="space-y-4">
          <div className="grid gap-2">
            <label htmlFor="descricao" className="text-sm font-medium">
              Descrição
            </label>
            <input
              id="descricao"
              {...form.register('descricao')}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Nome do serviço"
            />
            {form.formState.errors.descricao && (
              <p className="text-sm font-medium text-destructive">
                {form.formState.errors.descricao.message}
              </p>
            )}
          </div>
          
          <div className="grid gap-2">
            <label htmlFor="area_coordenacao_id" className="text-sm font-medium">
              Área de Coordenação
            </label>
            <select
              id="area_coordenacao_id"
              {...form.register('area_coordenacao_id')}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">Selecione uma área</option>
              {areas.map((area) => (
                <option key={area.id} value={area.id}>
                  {area.descricao}
                </option>
              ))}
            </select>
            {form.formState.errors.area_coordenacao_id && (
              <p className="text-sm font-medium text-destructive">
                {form.formState.errors.area_coordenacao_id.message}
              </p>
            )}
          </div>
        </div>
      )}
      isSubmitting={isSubmitting}
    />
  );

  return (
    <div>
      <DataTable
        title="Serviços"
        data={services}
        columns={columns}
        onAdd={() => {}}
        onEdit={openEditDialog}
        onDelete={handleDelete}
        filterPlaceholder="Filtrar serviços..."
        renderForm={renderForm}
        isLoading={loading}
      />
      
      {/* Edit dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Serviço</DialogTitle>
          </DialogHeader>
          
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(handleEdit)} className="space-y-4">
              <FormField
                control={editForm.control}
                name="descricao"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome do serviço" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={editForm.control}
                name="area_coordenacao_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Área de Coordenação</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma área" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {areas.map((area) => (
                          <SelectItem key={area.id} value={area.id}>
                            {area.descricao}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsEditDialogOpen(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Services;
