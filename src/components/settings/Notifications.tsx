
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Bell, Search, Trash, Download, Printer, CheckCircle, XCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Notifications = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentNotification, setCurrentNotification] = useState<any>(null);
  const [filter, setFilter] = useState('');
  
  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('notificacoes')
        .select(`
          *,
          usuarios(id, nome_completo, email)
        `)
        .order('data_envio', { ascending: false });
      
      if (error) throw error;
      setNotifications(data || []);
    } catch (error: any) {
      console.error('Erro ao carregar notificações:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar as notificações',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notification: any) => {
    try {
      const { error } = await supabase
        .from('notificacoes')
        .update({ lida: true })
        .eq('id', notification.id);
      
      if (error) throw error;
      
      toast({
        title: 'Notificação atualizada',
        description: 'A notificação foi marcada como lida',
      });
      
      await fetchNotifications();
    } catch (error: any) {
      console.error('Erro ao atualizar notificação:', error);
      toast({
        title: 'Erro',
        description: error.message || 'Ocorreu um erro ao atualizar a notificação',
        variant: 'destructive',
      });
    }
  };
  
  const handleMarkAsUnread = async (notification: any) => {
    try {
      const { error } = await supabase
        .from('notificacoes')
        .update({ lida: false })
        .eq('id', notification.id);
      
      if (error) throw error;
      
      toast({
        title: 'Notificação atualizada',
        description: 'A notificação foi marcada como não lida',
      });
      
      await fetchNotifications();
    } catch (error: any) {
      console.error('Erro ao atualizar notificação:', error);
      toast({
        title: 'Erro',
        description: error.message || 'Ocorreu um erro ao atualizar a notificação',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteNotification = async () => {
    if (!currentNotification) return;
    
    try {
      const { error } = await supabase
        .from('notificacoes')
        .delete()
        .eq('id', currentNotification.id);
      
      if (error) throw error;
      
      toast({
        title: 'Notificação excluída',
        description: 'A notificação foi excluída com sucesso',
      });
      
      setIsDeleteDialogOpen(false);
      setCurrentNotification(null);
      await fetchNotifications();
    } catch (error: any) {
      console.error('Erro ao excluir notificação:', error);
      toast({
        title: 'Erro',
        description: error.message || 'Ocorreu um erro ao excluir a notificação',
        variant: 'destructive',
      });
    }
  };

  const handleExportCsv = () => {
    // Create CSV data
    const headers = ['Mensagem', 'Usuário', 'Status', 'Data de Envio'];
    const csvData = filteredNotifications.map(notification => [
      notification.mensagem,
      notification.usuarios?.nome_completo || '',
      notification.lida ? 'Lida' : 'Não lida',
      format(new Date(notification.data_envio), 'dd/MM/yyyy HH:mm', { locale: pt })
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
    link.download = 'notificacoes.csv';
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const handlePrint = () => {
    window.print();
  };
  
  const handleClearAllRead = async () => {
    try {
      const { error } = await supabase
        .from('notificacoes')
        .delete()
        .eq('lida', true);
      
      if (error) throw error;
      
      toast({
        title: 'Notificações limpas',
        description: 'Todas as notificações lidas foram removidas',
      });
      
      await fetchNotifications();
    } catch (error: any) {
      console.error('Erro ao limpar notificações:', error);
      toast({
        title: 'Erro',
        description: error.message || 'Ocorreu um erro ao limpar as notificações',
        variant: 'destructive',
      });
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    const searchTerms = filter.toLowerCase();
    return (
      notification.mensagem?.toLowerCase().includes(searchTerms) ||
      notification.usuarios?.nome_completo?.toLowerCase().includes(searchTerms) ||
      notification.usuarios?.email?.toLowerCase().includes(searchTerms)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Notificações</h2>
          <p className="text-gray-500">Gerencie as notificações do sistema</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-initial">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input 
              type="text" 
              placeholder="Buscar notificações..." 
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
            
            <Button variant="outline" onClick={handleClearAllRead}>
              Limpar Lidas
            </Button>
          </div>
        </div>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Status</TableHead>
              <TableHead>Mensagem</TableHead>
              <TableHead>Usuário</TableHead>
              <TableHead>Data de Envio</TableHead>
              <TableHead className="w-[100px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em]" />
                  <p className="mt-2">Carregando notificações...</p>
                </TableCell>
              </TableRow>
            ) : filteredNotifications.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                  {filter ? 'Nenhuma notificação encontrada para a busca' : 'Nenhuma notificação registrada'}
                </TableCell>
              </TableRow>
            ) : (
              filteredNotifications.map((notification) => (
                <TableRow key={notification.id} className={notification.lida ? "" : "bg-blue-50"}>
                  <TableCell>
                    {notification.lida ? (
                      <div className="flex items-center text-green-600">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        <span>Lida</span>
                      </div>
                    ) : (
                      <div className="flex items-center text-blue-600">
                        <Bell className="h-4 w-4 mr-1" />
                        <span>Não lida</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>{notification.mensagem}</TableCell>
                  <TableCell>
                    <div>
                      <p>{notification.usuarios?.nome_completo || 'Usuário desconhecido'}</p>
                      <p className="text-xs text-gray-500">{notification.usuarios?.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    {format(new Date(notification.data_envio), 'dd/MM/yyyy HH:mm', { locale: pt })}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          Ações
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {notification.lida ? (
                          <DropdownMenuItem onClick={() => handleMarkAsUnread(notification)}>
                            <Bell className="h-4 w-4 mr-2" />
                            Marcar como não lida
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem onClick={() => handleMarkAsRead(notification)}>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Marcar como lida
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem 
                          onClick={() => {
                            setCurrentNotification(notification);
                            setIsDeleteDialogOpen(true);
                          }}
                          className="text-red-600"
                        >
                          <Trash className="h-4 w-4 mr-2" />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* Delete notification dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Excluir Notificação</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir esta notificação? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          
          {currentNotification && (
            <div className="p-4 bg-gray-50 rounded-md">
              <p><strong>Mensagem:</strong> {currentNotification.mensagem}</p>
              <p><strong>Usuário:</strong> {currentNotification.usuarios?.nome_completo || 'Usuário desconhecido'}</p>
              <p><strong>Data:</strong> {format(new Date(currentNotification.data_envio), 'dd/MM/yyyy HH:mm', { locale: pt })}</p>
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
              onClick={handleDeleteNotification}
            >
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Notifications;
