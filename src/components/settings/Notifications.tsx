import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardFooter 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { AlertCircle, Bell, Check, Download, Filter, RefreshCw, Search, Trash2, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Notification {
  id: string;
  mensagem: string;
  usuario_id: string;
  data_envio: string;
  lida: boolean;
  tipo?: string;
  referencia_id?: string;
  excluida?: boolean;
}

const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filteredNotifications, setFilteredNotifications] = useState<Notification[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'all' | 'read' | 'unread'>('all');

  const fetchNotifications = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('notificacoes')
        .select('*')
        .eq('excluida', false)
        .order('data_envio', { ascending: false });
      
      if (error) throw error;
      
      setNotifications(data || []);
      applyFilters(data || [], searchTerm, statusFilter);
    } catch (error) {
      console.error('Erro ao carregar notificações:', error);
      toast({
        title: "Erro ao carregar notificações",
        description: "Não foi possível carregar as notificações.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const applyFilters = (
    data: Notification[], 
    search: string, 
    status: 'all' | 'read' | 'unread'
  ) => {
    let filtered = [...data];
    
    if (status === 'read') {
      filtered = filtered.filter(n => n.lida);
    } else if (status === 'unread') {
      filtered = filtered.filter(n => !n.lida);
    }
    
    if (search.trim()) {
      const term = search.toLowerCase();
      filtered = filtered.filter(n => 
        n.mensagem.toLowerCase().includes(term)
      );
    }
    
    setFilteredNotifications(filtered);
  };

  useEffect(() => {
    applyFilters(notifications, searchTerm, statusFilter);
  }, [searchTerm, statusFilter, notifications]);

  const handleMarkAsRead = async (notification: Notification) => {
    try {
      const { error } = await supabase
        .from('notificacoes')
        .update({ lida: true })
        .eq('id', notification.id);
      
      if (error) throw error;
      
      setNotifications(prevNotifications => 
        prevNotifications.map(n => 
          n.id === notification.id ? { ...n, lida: true } : n
        )
      );
      
      toast({
        title: "Notificação marcada como lida",
        description: "A notificação foi marcada como lida com sucesso.",
      });
    } catch (error) {
      console.error('Erro ao marcar notificação como lida:', error);
      toast({
        title: "Erro ao atualizar notificação",
        description: "Não foi possível marcar a notificação como lida.",
        variant: "destructive"
      });
    }
  };

  const handleMarkAsUnread = async (notification: Notification) => {
    try {
      const { error } = await supabase
        .from('notificacoes')
        .update({ lida: false })
        .eq('id', notification.id);
      
      if (error) throw error;
      
      setNotifications(prevNotifications => 
        prevNotifications.map(n => 
          n.id === notification.id ? { ...n, lida: false } : n
        )
      );
      
      toast({
        title: "Notificação marcada como não lida",
        description: "A notificação foi marcada como não lida com sucesso.",
      });
    } catch (error) {
      console.error('Erro ao marcar notificação como não lida:', error);
      toast({
        title: "Erro ao atualizar notificação",
        description: "Não foi possível marcar a notificação como não lida.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedNotification) return;
    
    try {
      const { error } = await supabase
        .from('notificacoes')
        .update({ excluida: true })
        .eq('id', selectedNotification.id);
      
      if (error) throw error;
      
      setNotifications(prevNotifications => 
        prevNotifications.filter(n => n.id !== selectedNotification.id)
      );
      
      toast({
        title: "Notificação excluída",
        description: "A notificação foi excluída com sucesso.",
      });
    } catch (error) {
      console.error('Erro ao excluir notificação:', error);
      toast({
        title: "Erro ao excluir notificação",
        description: "Não foi possível excluir a notificação.",
        variant: "destructive"
      });
    } finally {
      setDeleteDialogOpen(false);
      setSelectedNotification(null);
    }
  };

  const handleBulkDeleteConfirm = async () => {
    try {
      const idsToDelete = filteredNotifications.map(n => n.id);
      
      if (idsToDelete.length === 0) return;
      
      const { error } = await supabase
        .from('notificacoes')
        .update({ excluida: true })
        .in('id', idsToDelete);
      
      if (error) throw error;
      
      await fetchNotifications();
      
      toast({
        title: "Notificações excluídas",
        description: "As notificações foram excluídas com sucesso.",
      });
    } catch (error) {
      console.error('Erro ao excluir notificações em massa:', error);
      toast({
        title: "Erro ao excluir notificações",
        description: "Não foi possível excluir as notificações.",
        variant: "destructive"
      });
    } finally {
      setBulkDeleteDialogOpen(false);
    }
  };

  const exportToCSV = () => {
    try {
      const csvData = filteredNotifications.map(notification => ({
        Mensagem: notification.mensagem,
        Status: notification.lida ? 'Lida' : 'Não lida',
        'Data de Envio': format(new Date(notification.data_envio), 'dd/MM/yyyy HH:mm')
      }));
      
      const headers = Object.keys(csvData[0]).join(',');
      const rows = csvData.map(row => Object.values(row).join(','));
      const csv = [headers, ...rows].join('\n');
      
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', 'notificacoes.csv');
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Exportação concluída",
        description: "As notificações foram exportadas com sucesso.",
      });
    } catch (error) {
      console.error('Erro ao exportar notificações:', error);
      toast({
        title: "Erro ao exportar",
        description: "Não foi possível exportar as notificações.",
        variant: "destructive"
      });
    }
  };

  const markAllAsRead = async () => {
    try {
      const unreadIds = filteredNotifications
        .filter(n => !n.lida)
        .map(n => n.id);
        
      if (unreadIds.length === 0) {
        toast({
          title: "Informação",
          description: "Não há notificações não lidas para marcar.",
        });
        return;
      }
      
      const { error } = await supabase
        .from('notificacoes')
        .update({ lida: true })
        .in('id', unreadIds);
      
      if (error) throw error;
      
      setNotifications(prevNotifications => 
        prevNotifications.map(n => 
          unreadIds.includes(n.id) ? { ...n, lida: true } : n
        )
      );
      
      toast({
        title: "Notificações marcadas como lidas",
        description: `${unreadIds.length} notificações foram marcadas como lidas.`,
      });
    } catch (error) {
      console.error('Erro ao marcar notificações como lidas:', error);
      toast({
        title: "Erro ao atualizar notificações",
        description: "Não foi possível marcar as notificações como lidas.",
        variant: "destructive"
      });
    }
  };

  const renderEmptyState = () => (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <Bell className="h-12 w-12 text-gray-400 mb-4" />
      <h3 className="text-lg font-medium text-gray-700">Nenhuma notificação encontrada</h3>
      <p className="text-sm text-gray-500 mt-2">
        {searchTerm.trim()
          ? "Tente ajustar os filtros ou critérios de busca"
          : "Não há notificações disponíveis no momento"}
      </p>
    </div>
  );

  return (
    <Card className="min-h-[calc(100vh-16rem)]">
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle className="text-xl font-bold">Gerenciamento de Notificações</CardTitle>
            <CardDescription>
              Visualize, gerencie e configure as notificações enviadas aos usuários
            </CardDescription>
          </div>
          
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchNotifications}
              disabled={isLoading}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Atualizar
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={exportToCSV}
              disabled={isLoading || filteredNotifications.length === 0}
            >
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setBulkDeleteDialogOpen(true)}
              disabled={isLoading || filteredNotifications.length === 0}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Excluir {filteredNotifications.length > 0 && `(${filteredNotifications.length})`}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={markAllAsRead}
              disabled={isLoading || !filteredNotifications.some(n => !n.lida)}
            >
              <Check className="h-4 w-4 mr-2" />
              Marcar como lidas
            </Button>
          </div>
        </div>
        
        <Separator className="my-2" />
        
        <div className="flex flex-col sm:flex-row gap-4 items-end">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Buscar notificações..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Tabs 
            defaultValue="all" 
            value={statusFilter} 
            onValueChange={(value) => setStatusFilter(value as 'all' | 'read' | 'unread')}
            className="w-full sm:w-auto"
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">Todas</TabsTrigger>
              <TabsTrigger value="unread">Não lidas</TabsTrigger>
              <TabsTrigger value="read">Lidas</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-800"></div>
          </div>
        ) : filteredNotifications.length === 0 ? (
          renderEmptyState()
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50%]">Mensagem</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Data de Envio</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredNotifications.map((notification) => (
                  <TableRow key={notification.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-start gap-2">
                        {!notification.lida && (
                          <div className="relative flex-shrink-0 mt-1">
                            <span className="absolute h-2 w-2 rounded-full bg-blue-600"></span>
                          </div>
                        )}
                        <span className={!notification.lida ? "pl-3" : ""}>
                          {notification.mensagem}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={notification.lida ? "outline" : "default"}>
                        {notification.lida ? "Lida" : "Não lida"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {format(new Date(notification.data_envio), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {notification.lida ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleMarkAsUnread(notification)}
                          >
                            <X className="h-4 w-4" />
                            <span className="sr-only">Marcar como não lida</span>
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleMarkAsRead(notification)}
                          >
                            <Check className="h-4 w-4" />
                            <span className="sr-only">Marcar como lida</span>
                          </Button>
                        )}
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedNotification(notification);
                            setDeleteDialogOpen(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Excluir</span>
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
      
      <CardFooter className="flex justify-between">
        <div className="text-sm text-gray-500">
          {filteredNotifications.length > 0 && (
            <>
              Exibindo {filteredNotifications.length} de {notifications.length} notificações.
              {' '}
              <span className="font-medium">
                {notifications.filter(n => !n.lida).length} não lidas
              </span>
            </>
          )}
        </div>
      </CardFooter>
      
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir notificação</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta notificação? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      <AlertDialog open={bulkDeleteDialogOpen} onOpenChange={setBulkDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir notificações</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir {filteredNotifications.length} notificações? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleBulkDeleteConfirm}>
              Excluir todas
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};

export default Notifications;
