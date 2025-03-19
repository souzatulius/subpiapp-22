
import React, { useEffect, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
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
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { AnnouncementFormValues } from './types';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Check, ChevronsUpDown, X } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface CreateAnnouncementDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  form: UseFormReturn<AnnouncementFormValues>;
  isSubmitting: boolean;
  onSubmit: (data: AnnouncementFormValues) => Promise<void>;
  users: { id: string; nome_completo: string; }[];
  areas: { id: string; descricao: string; }[];
  cargos: { id: string; descricao: string; }[];
}

const CreateAnnouncementDialog: React.FC<CreateAnnouncementDialogProps> = ({
  open,
  setOpen,
  form,
  isSubmitting,
  onSubmit,
  users,
  areas,
  cargos,
}) => {
  const [destinationType, setDestinationType] = useState<'todos' | 'usuarios' | 'areas' | 'cargos'>('todos');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [commandOpen, setCommandOpen] = useState(false);

  // Efeito para atualizar o campo de destinatários ao mudar a seleção
  useEffect(() => {
    const destinatariosValue = 
      destinationType === 'todos' ? 'Todos' :
      destinationType === 'usuarios' ? JSON.stringify({ type: 'usuarios', ids: selectedUsers }) :
      destinationType === 'areas' ? form.getValues('area_id') ? 
        JSON.stringify({ type: 'areas', ids: [form.getValues('area_id')] }) : '' :
      form.getValues('cargo_id') ? 
        JSON.stringify({ type: 'cargos', ids: [form.getValues('cargo_id')] }) : '';

    form.setValue('destinatarios', destinatariosValue);
  }, [destinationType, selectedUsers, form]);

  // Função para lidar com a adição/remoção de usuários
  const toggleUser = (userId: string) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter(id => id !== userId));
    } else {
      setSelectedUsers([...selectedUsers, userId]);
    }
  };

  // Função para buscar o nome completo do usuário pelo ID
  const getUserName = (userId: string) => {
    const user = users.find(user => user.id === userId);
    return user ? user.nome_completo : userId;
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Novo Comunicado</DialogTitle>
          <DialogDescription>
            Crie um novo comunicado para os usuários do sistema.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
            
            <div className="space-y-2">
              <FormLabel>Destinatários</FormLabel>
              <div className="grid grid-cols-4 gap-2">
                <Button 
                  type="button" 
                  variant={destinationType === 'todos' ? "default" : "outline"}
                  className="col-span-1"
                  onClick={() => setDestinationType('todos')}
                >
                  Todos
                </Button>
                <Button 
                  type="button" 
                  variant={destinationType === 'usuarios' ? "default" : "outline"}
                  className="col-span-1"
                  onClick={() => setDestinationType('usuarios')}
                >
                  Usuários
                </Button>
                <Button 
                  type="button" 
                  variant={destinationType === 'areas' ? "default" : "outline"}
                  className="col-span-1"
                  onClick={() => setDestinationType('areas')}
                >
                  Áreas
                </Button>
                <Button 
                  type="button" 
                  variant={destinationType === 'cargos' ? "default" : "outline"}
                  className="col-span-1"
                  onClick={() => setDestinationType('cargos')}
                >
                  Cargos
                </Button>
              </div>
            </div>
            
            {destinationType === 'usuarios' && (
              <div className="space-y-2">
                <FormLabel>Selecionar Usuários</FormLabel>
                
                <div className="flex flex-wrap gap-1 mb-2">
                  {selectedUsers.map(userId => (
                    <Badge key={userId} variant="secondary" className="flex items-center gap-1">
                      {getUserName(userId)}
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm" 
                        className="h-4 w-4 p-0 ml-1" 
                        onClick={() => toggleUser(userId)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
                
                <Popover open={commandOpen} onOpenChange={setCommandOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={commandOpen}
                      className="w-full justify-between"
                    >
                      {selectedUsers.length > 0 
                        ? `${selectedUsers.length} usuário(s) selecionado(s)` 
                        : "Selecionar usuários"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="Buscar usuário..." />
                      <CommandEmpty>Nenhum usuário encontrado.</CommandEmpty>
                      <CommandGroup className="max-h-60 overflow-y-auto">
                        {users.map(user => (
                          <CommandItem
                            key={user.id}
                            value={user.nome_completo}
                            onSelect={() => {
                              toggleUser(user.id);
                              setCommandOpen(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                selectedUsers.includes(user.id) ? "opacity-100" : "opacity-0"
                              )}
                            />
                            {user.nome_completo}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
            )}
            
            {destinationType === 'areas' && (
              <FormField
                control={form.control}
                name="area_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Área de Coordenação</FormLabel>
                    <Select 
                      onValueChange={(value) => {
                        field.onChange(value);
                        form.setValue('destinatarios', JSON.stringify({ type: 'areas', ids: [value] }));
                      }} 
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma área" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {areas.map(area => (
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
            )}
            
            {destinationType === 'cargos' && (
              <FormField
                control={form.control}
                name="cargo_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cargo</FormLabel>
                    <Select 
                      onValueChange={(value) => {
                        field.onChange(value);
                        form.setValue('destinatarios', JSON.stringify({ type: 'cargos', ids: [value] }));
                      }} 
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um cargo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {cargos.map(cargo => (
                          <SelectItem key={cargo.id} value={cargo.id}>
                            {cargo.descricao}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            
            <FormField
              control={form.control}
              name="destinatarios"
              render={({ field }) => (
                <FormItem className="hidden">
                  <FormControl>
                    <Input {...field} />
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
                  setSelectedUsers([]);
                  setDestinationType('todos');
                  setOpen(false);
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
  );
};

export default CreateAnnouncementDialog;
