
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { z } from 'zod';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Search, Trash, MessageSquarePlus, Download, Printer } from 'lucide-react';

// Schema for announcement validation
const announcementSchema = z.object({
  titulo: z.string().min(3, 'O título deve ter pelo menos 3 caracteres'),
  mensagem: z.string().min(10, 'A mensagem deve ter pelo menos 10 caracteres'),
  destinatarios: z.string().min(1, 'Informe os destinatários'),
});

const Announcements = () => {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentAnnouncement, setCurrentAnnouncement] = useState<any>(null);
  const [filter, setFilter] = useState('');
  const { user } = useAuth();

  const form = useForm<z.infer<typeof announcementSchema>>({
    resolver: zodResolver(announcementSchema),
    defaultValues: {
      titulo: '',
      mensagem: '',
      destinatarios: 'Todos',
    },
  });

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('comunicados')
        .select(`
          *,
          autor:autor_id(id, nome_completo, email)
        `)
        .order('data_envio', { ascending: false });
      
      if (error) throw error;
      setAnnouncements(data || []);
    } catch (error: any) {
      console.error('Erro ao carregar comunicados:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os comunicados',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAnnouncement = async (data: z.infer<typeof announcementSchema>) => {
    if (!user) return;
    
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('comunicados')
        .insert({
          titulo: data.titulo,
          mensagem: data.mensagem,
          destinatarios: data.destinatarios,
          autor_id: user.id,
          data_envio: new Date().toISOString(), // Ensure data_envio is set
        });
      
      if (error) throw error;
      
      toast({
        title: 'Comunicado enviado',
        description: 'O comunicado foi enviado com sucesso',
      });
      
      form.reset();
      setIsCreateDialogOpen(false);
      await fetchAnnouncements();
      
      // Notificar usuários - em um sistema real, isso poderia enviar emails ou notificações push
      try {
        await supabase
          .from('notificacoes')
          .insert({
            mensagem: `Novo comunicado: ${data.titulo}`,
            usuario_id: user.id, // No sistema real, isso seria para cada destinatário
            data: new Date().toISOString(),
            lida: false,
          });
      } catch (notifyError) {
        console.error('Erro ao criar notificação:', notifyError);
      }
    } catch (error: any) {
      console.error('Erro ao criar comunicado:', error);
      toast({
        title: 'Erro',
        description: error.message || 'Ocorreu um erro ao enviar o comunicado',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteAnnouncement = async () => {
    if (!currentAnnouncement) return;
    
    try {
      const { error } = await supabase
        .from('comunicados')
        .delete()
        .eq('id', currentAnnouncement.id);
      
      if (error) throw error;
      
      toast({
        title: 'Comunicado excluído',
        description: 'O comunicado foi excluído com sucesso',
      });
      
      setIsDeleteDialogOpen(false);
      setCurrentAnnouncement(null);
      await fetchAnnouncements();
    } catch (error: any) {
      console.error('Erro ao excluir comunicado:', error);
      toast({
        title: 'Erro',
        description: error.message || 'Ocorreu um erro ao excluir o comunicado',
        variant: 'destructive',
      });
    }
  };

  const handleExportCsv = () => {
    // Create CSV data
    const headers = ['Título', 'Mensagem', 'Destinatários', 'Autor', 'Data de Envio'];
    const csvData = filteredAnnouncements.map(announcement => [
      announcement.titulo,
      announcement.mensagem.replace(/\n/g, ' '),
      announcement.destinatarios,
      announcement.autor?.nome_completo || '',
      format(new Date(announcement.data_envio), 'dd/MM/yyyy HH:mm', { locale: pt })
    ]);
    
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.map(cell => {
        // Handle commas and quotes in CSV
        if (typeof cell === 'string' && (cell.includes(',') || cell.includes('"'))) {
          return `"${cell.replace(/"/g, '""')}"`;
        }
        return cell;
      }).join(','))
    ].join('\n');
    
    // Download CSV file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'comunicados.csv';
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const handlePrint = () => {
    window.print();
  };

  const filteredAnnouncements = announcements.filter(announcement => {
    const searchTerms = filter.toLowerCase();
    return (
      announcement.titulo?.toLowerCase().includes(searchTerms) ||
      announcement.mensagem?.toLowerCase().includes(searchTerms) ||
      announcement.destinatarios?.toLowerCase().includes(searchTerms) ||
      announcement.autor?.nome_completo?.toLowerCase().includes(searchTerms)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold">Comunicados</h2>
        
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-initial">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input 
              type="text" 
              placeholder="Buscar comunicados..." 
              value={filter} 
              onChange={(e) => setFilter(e.target.value)}
              className="pl-9 w-full"
            />
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={handleExportCsv} title="Exportar CSV">
              <Download className="h-4 w-4" />
            </Button>
            
            <Button variant="outline" size="icon" onClick={handlePrint} title="Imprimir">
              <Printer className="h-4 w-4" />
            </Button>
            
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <MessageSquarePlus className="h-4 w-4 mr-2" />
              Novo Comunicado
            </Button>
          </div>
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em]"></div>
          <p className="ml-2">Carregando comunicados...</p>
        </div>
      ) : filteredAnnouncements.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border">
          <p className="text-gray-500">
            {filter ? 'Nenhum comunicado encontrado para a busca' : 'Nenhum comunicado cadastrado'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAnnouncements.map((announcement) => (
            <Card key={announcement.id} className="overflow-hidden">
              <CardHeader className="bg-gray-50">
                <CardTitle className="flex justify-between items-start">
                  <span className="flex-1">{announcement.titulo}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => {
                      setCurrentAnnouncement(announcement);
                      setIsDeleteDialogOpen(true);
                    }}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </CardTitle>
                <CardDescription>
                  Para: {announcement.destinatarios}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="whitespace-pre-line">{announcement.mensagem}</p>
              </CardContent>
              <CardFooter className="flex justify-between text-sm text-gray-500 border-t bg-gray-50">
                <span>
                  Por: {announcement.autor?.nome_completo || 'Usuário desconhecido'}
                </span>
                <span>
                  {format(new Date(announcement.data_envio), 'dd/MM/yyyy HH:mm', { locale: pt })}
                </span>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
      
      {/* Create announcement dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Novo Comunicado</DialogTitle>
            <DialogDescription>
              Crie um novo comunicado para os usuários do sistema.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleCreateAnnouncement)} className="space-y-4">
              <FormField
                control={form.control}
                name="titulo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Título</FormLabel>
                    <FormControl>
                      <Input placeholder="Título do comunicado" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="mensagem"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mensagem</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Digite a mensagem do comunicado..." 
                        className="min-h-[200px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="destinatarios"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Destinatários</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Todos, Coordenação, etc." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    form.reset();
                    setIsCreateDialogOpen(false);
                  }}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Enviando...' : 'Enviar Comunicado'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Delete announcement dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Excluir Comunicado</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir este comunicado? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          
          {currentAnnouncement && (
            <div className="p-4 bg-gray-50 rounded-md">
              <p><strong>Título:</strong> {currentAnnouncement.titulo}</p>
              <p><strong>Para:</strong> {currentAnnouncement.destinatarios}</p>
              <p><strong>Data:</strong> {format(new Date(currentAnnouncement.data_envio), 'dd/MM/yyyy HH:mm', { locale: pt })}</p>
            </div>
          )}
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteAnnouncement}
            >
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Announcements;
