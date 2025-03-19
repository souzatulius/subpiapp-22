
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { z } from 'zod';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import DataTable from './DataTable';
import DataEntryForm from './DataEntryForm';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const districtSchema = z.object({
  nome: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres'),
});

const neighborhoodSchema = z.object({
  nome: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres'),
  distrito_id: z.string().min(1, 'Selecione um distrito'),
});

const DistrictsAndNeighborhoods = () => {
  const [activeTab, setActiveTab] = useState('districts');
  const [districts, setDistricts] = useState<any[]>([]);
  const [neighborhoods, setNeighborhoods] = useState<any[]>([]);
  const [loadingDistricts, setLoadingDistricts] = useState(true);
  const [loadingNeighborhoods, setLoadingNeighborhoods] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // District edit state
  const [isEditDistrictOpen, setIsEditDistrictOpen] = useState(false);
  const [editingDistrict, setEditingDistrict] = useState<any>(null);
  
  // Neighborhood edit state
  const [isEditNeighborhoodOpen, setIsEditNeighborhoodOpen] = useState(false);
  const [editingNeighborhood, setEditingNeighborhood] = useState<any>(null);
  
  // Forms
  const editDistrictForm = useForm<z.infer<typeof districtSchema>>({
    resolver: zodResolver(districtSchema),
    defaultValues: {
      nome: '',
    },
  });
  
  const editNeighborhoodForm = useForm<z.infer<typeof neighborhoodSchema>>({
    resolver: zodResolver(neighborhoodSchema),
    defaultValues: {
      nome: '',
      distrito_id: '',
    },
  });

  useEffect(() => {
    fetchDistricts();
    fetchNeighborhoods();
  }, []);
  
  useEffect(() => {
    if (editingDistrict) {
      editDistrictForm.reset({
        nome: editingDistrict.nome,
      });
    }
  }, [editingDistrict, editDistrictForm]);
  
  useEffect(() => {
    if (editingNeighborhood) {
      editNeighborhoodForm.reset({
        nome: editingNeighborhood.nome,
        distrito_id: editingNeighborhood.distrito_id,
      });
    }
  }, [editingNeighborhood, editNeighborhoodForm]);

  const fetchDistricts = async () => {
    setLoadingDistricts(true);
    try {
      const { data, error } = await supabase
        .from('distritos')
        .select('*')
        .order('nome', { ascending: true });
      
      if (error) throw error;
      setDistricts(data || []);
    } catch (error: any) {
      console.error('Erro ao carregar distritos:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os distritos',
        variant: 'destructive',
      });
    } finally {
      setLoadingDistricts(false);
    }
  };
  
  const fetchNeighborhoods = async () => {
    setLoadingNeighborhoods(true);
    try {
      const { data, error } = await supabase
        .from('bairros')
        .select(`
          *,
          distritos(id, nome)
        `)
        .order('nome', { ascending: true });
      
      if (error) throw error;
      setNeighborhoods(data || []);
    } catch (error: any) {
      console.error('Erro ao carregar bairros:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os bairros',
        variant: 'destructive',
      });
    } finally {
      setLoadingNeighborhoods(false);
    }
  };

  // District handlers
  const handleAddDistrict = async (data: any) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('distritos')
        .insert({
          nome: data.nome,
        });
      
      if (error) throw error;
      
      await fetchDistricts();
      return Promise.resolve();
    } catch (error: any) {
      console.error('Erro ao adicionar distrito:', error);
      return Promise.reject(error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleEditDistrict = async (data: z.infer<typeof districtSchema>) => {
    if (!editingDistrict) return;
    
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('distritos')
        .update({
          nome: data.nome,
        })
        .eq('id', editingDistrict.id);
      
      if (error) throw error;
      
      toast({
        title: 'Distrito atualizado',
        description: 'O distrito foi atualizado com sucesso',
      });
      
      setIsEditDistrictOpen(false);
      await fetchDistricts();
      await fetchNeighborhoods(); // Refresh to update district names in neighborhoods
    } catch (error: any) {
      console.error('Erro ao editar distrito:', error);
      toast({
        title: 'Erro',
        description: error.message || 'Ocorreu um erro ao atualizar o distrito',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleDeleteDistrict = async (district: any) => {
    try {
      // Check if there are dependent neighborhoods
      const { count, error: countError } = await supabase
        .from('bairros')
        .select('*', { count: 'exact', head: true })
        .eq('distrito_id', district.id);
        
      if (countError) throw countError;
        
      if ((count || 0) > 0) {
        toast({
          title: 'Não é possível excluir',
          description: 'Existem bairros associados a este distrito',
          variant: 'destructive',
        });
        return;
      }
      
      const { error } = await supabase
        .from('distritos')
        .delete()
        .eq('id', district.id);
      
      if (error) throw error;
      
      toast({
        title: 'Distrito excluído',
        description: 'O distrito foi excluído com sucesso',
      });
      
      await fetchDistricts();
    } catch (error: any) {
      console.error('Erro ao excluir distrito:', error);
      toast({
        title: 'Erro',
        description: error.message || 'Ocorreu um erro ao excluir o distrito',
        variant: 'destructive',
      });
    }
  };
  
  // Neighborhood handlers
  const handleAddNeighborhood = async (data: any) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('bairros')
        .insert({
          nome: data.nome,
          distrito_id: data.distrito_id,
        });
      
      if (error) throw error;
      
      await fetchNeighborhoods();
      return Promise.resolve();
    } catch (error: any) {
      console.error('Erro ao adicionar bairro:', error);
      return Promise.reject(error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleEditNeighborhood = async (data: z.infer<typeof neighborhoodSchema>) => {
    if (!editingNeighborhood) return;
    
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('bairros')
        .update({
          nome: data.nome,
          distrito_id: data.distrito_id,
        })
        .eq('id', editingNeighborhood.id);
      
      if (error) throw error;
      
      toast({
        title: 'Bairro atualizado',
        description: 'O bairro foi atualizado com sucesso',
      });
      
      setIsEditNeighborhoodOpen(false);
      await fetchNeighborhoods();
    } catch (error: any) {
      console.error('Erro ao editar bairro:', error);
      toast({
        title: 'Erro',
        description: error.message || 'Ocorreu um erro ao atualizar o bairro',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleDeleteNeighborhood = async (neighborhood: any) => {
    try {
      // Check if there are dependent records
      const { count, error: countError } = await supabase
        .from('demandas')
        .select('*', { count: 'exact', head: true })
        .eq('bairro_id', neighborhood.id);
        
      if (countError) throw countError;
        
      if ((count || 0) > 0) {
        toast({
          title: 'Não é possível excluir',
          description: 'Existem demandas associadas a este bairro',
          variant: 'destructive',
        });
        return;
      }
      
      const { error } = await supabase
        .from('bairros')
        .delete()
        .eq('id', neighborhood.id);
      
      if (error) throw error;
      
      toast({
        title: 'Bairro excluído',
        description: 'O bairro foi excluído com sucesso',
      });
      
      await fetchNeighborhoods();
    } catch (error: any) {
      console.error('Erro ao excluir bairro:', error);
      toast({
        title: 'Erro',
        description: error.message || 'Ocorreu um erro ao excluir o bairro',
        variant: 'destructive',
      });
    }
  };
  
  // Districts table configuration
  const districtColumns = [
    {
      key: 'nome',
      header: 'Nome',
    },
    {
      key: 'criado_em',
      header: 'Data de Criação',
      render: (row: any) => new Date(row.criado_em).toLocaleDateString('pt-BR'),
    },
  ];
  
  // Neighborhoods table configuration
  const neighborhoodColumns = [
    {
      key: 'nome',
      header: 'Nome',
    },
    {
      key: 'distritos',
      header: 'Distrito',
      render: (row: any) => row.distritos?.nome || '-',
    },
    {
      key: 'criado_em',
      header: 'Data de Criação',
      render: (row: any) => new Date(row.criado_em).toLocaleDateString('pt-BR'),
    },
  ];
  
  // Render district form
  const renderDistrictForm = (onClose: () => void) => (
    <DataEntryForm
      schema={districtSchema}
      onSubmit={handleAddDistrict}
      onCancel={onClose}
      defaultValues={{
        nome: '',
      }}
      renderFields={() => (
        <div className="space-y-4">
          <div className="grid gap-2">
            <label htmlFor="nome" className="text-sm font-medium">
              Nome
            </label>
            <input
              id="nome"
              name="nome"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Nome do distrito"
            />
          </div>
        </div>
      )}
      isSubmitting={isSubmitting}
    />
  );
  
  // Render neighborhood form
  const renderNeighborhoodForm = (onClose: () => void) => (
    <DataEntryForm
      schema={neighborhoodSchema}
      onSubmit={handleAddNeighborhood}
      onCancel={onClose}
      defaultValues={{
        nome: '',
        distrito_id: '',
      }}
      renderFields={(form) => (
        <div className="space-y-4">
          <div className="grid gap-2">
            <label htmlFor="nome" className="text-sm font-medium">
              Nome
            </label>
            <input
              id="nome"
              {...form.register('nome')}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Nome do bairro"
            />
            {form.formState.errors.nome && (
              <p className="text-sm font-medium text-destructive">
                {form.formState.errors.nome.message}
              </p>
            )}
          </div>
          
          <div className="grid gap-2">
            <label htmlFor="distrito_id" className="text-sm font-medium">
              Distrito
            </label>
            <select
              id="distrito_id"
              {...form.register('distrito_id')}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">Selecione um distrito</option>
              {districts.map((district) => (
                <option key={district.id} value={district.id}>
                  {district.nome}
                </option>
              ))}
            </select>
            {form.formState.errors.distrito_id && (
              <p className="text-sm font-medium text-destructive">
                {form.formState.errors.distrito_id.message}
              </p>
            )}
          </div>
        </div>
      )}
      isSubmitting={isSubmitting}
    />
  );

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="districts">Distritos</TabsTrigger>
          <TabsTrigger value="neighborhoods">Bairros</TabsTrigger>
        </TabsList>
        
        <TabsContent value="districts" className="pt-4">
          <DataTable
            title="Distritos"
            data={districts}
            columns={districtColumns}
            onAdd={() => {}}
            onEdit={(district) => {
              setEditingDistrict(district);
              setIsEditDistrictOpen(true);
            }}
            onDelete={handleDeleteDistrict}
            filterPlaceholder="Filtrar distritos..."
            renderForm={renderDistrictForm}
            isLoading={loadingDistricts}
          />
        </TabsContent>
        
        <TabsContent value="neighborhoods" className="pt-4">
          <DataTable
            title="Bairros"
            data={neighborhoods}
            columns={neighborhoodColumns}
            onAdd={() => {}}
            onEdit={(neighborhood) => {
              setEditingNeighborhood(neighborhood);
              setIsEditNeighborhoodOpen(true);
            }}
            onDelete={handleDeleteNeighborhood}
            filterPlaceholder="Filtrar bairros..."
            renderForm={renderNeighborhoodForm}
            isLoading={loadingNeighborhoods}
          />
        </TabsContent>
      </Tabs>
      
      {/* Edit District Dialog */}
      <Dialog open={isEditDistrictOpen} onOpenChange={setIsEditDistrictOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Distrito</DialogTitle>
          </DialogHeader>
          
          <Form {...editDistrictForm}>
            <form onSubmit={editDistrictForm.handleSubmit(handleEditDistrict)} className="space-y-4">
              <FormField
                control={editDistrictForm.control}
                name="nome"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome do distrito" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsEditDistrictOpen(false)}
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
      
      {/* Edit Neighborhood Dialog */}
      <Dialog open={isEditNeighborhoodOpen} onOpenChange={setIsEditNeighborhoodOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Bairro</DialogTitle>
          </DialogHeader>
          
          <Form {...editNeighborhoodForm}>
            <form onSubmit={editNeighborhoodForm.handleSubmit(handleEditNeighborhood)} className="space-y-4">
              <FormField
                control={editNeighborhoodForm.control}
                name="nome"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome do bairro" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={editNeighborhoodForm.control}
                name="distrito_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Distrito</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um distrito" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {districts.map((district) => (
                          <SelectItem key={district.id} value={district.id}>
                            {district.nome}
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
                  onClick={() => setIsEditNeighborhoodOpen(false)}
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

export default DistrictsAndNeighborhoods;
