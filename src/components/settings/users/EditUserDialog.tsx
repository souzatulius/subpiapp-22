
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
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
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { formatPhone } from '@/lib/formValidation';
import { Area, Cargo, User } from './types';
import { supabase } from '@/integrations/supabase/client';

const editUserSchema = z.object({
  email: z.string().email('Email inválido'),
  nome_completo: z.string().min(3, 'Nome completo é obrigatório'),
  cargo_id: z.string().optional(),
  coordenacao_id: z.string().optional(),
  area_coordenacao_id: z.string().optional(),
  whatsapp: z.string().optional(),
  aniversario: z.date().optional(),
});

type FormValues = z.infer<typeof editUserSchema>;

interface EditUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
  onSubmit: (data: FormValues) => Promise<void>;
  areas: Area[];
  cargos: Cargo[];
}

interface Coordenacao {
  id: string;
  descricao: string;
}

const EditUserDialog: React.FC<EditUserDialogProps> = ({
  open,
  onOpenChange,
  user,
  onSubmit,
  areas,
  cargos,
}) => {
  const [coordenacoes, setCoordenacoes] = useState<Coordenacao[]>([]);
  const [filteredAreas, setFilteredAreas] = useState<Area[]>([]);
  const [loading, setLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(editUserSchema),
    defaultValues: {
      email: '',
      nome_completo: '',
      cargo_id: undefined,
      coordenacao_id: undefined,
      area_coordenacao_id: undefined,
      whatsapp: '',
      aniversario: undefined,
    },
  });

  // Fetch coordenações when dialog opens
  useEffect(() => {
    const fetchCoordenacoes = async () => {
      if (!open) return;
      
      setLoading(true);
      try {
        // Fetch coordenações (is_supervision = false)
        const { data, error } = await supabase
          .from('areas_coordenacao')
          .select('id, descricao')
          .eq('is_supervision', false)
          .order('descricao');
        
        if (error) {
          console.error('Error fetching coordenações:', error);
          return;
        }
        
        console.log('Coordenações loaded for user edit:', data?.length);
        setCoordenacoes(data || []);
      } catch (error) {
        console.error('Error in fetchCoordenacoes:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCoordenacoes();
  }, [open]);

  // Reset form when user data changes
  useEffect(() => {
    if (user) {
      const aniversario = user.aniversario ? new Date(user.aniversario) : undefined;
      
      form.reset({
        email: user.email,
        nome_completo: user.nome_completo,
        cargo_id: user.cargo_id || undefined,
        coordenacao_id: user.coordenacao_id || undefined,
        area_coordenacao_id: user.area_coordenacao_id || undefined,
        whatsapp: user.whatsapp || '',
        aniversario: aniversario,
      });
      
      // If the user has a coordination, fetch related supervisions
      if (user.coordenacao_id) {
        fetchFilteredAreas(user.coordenacao_id);
      }
    }
  }, [user, form]);

  // Function to fetch filtered areas by coordination
  const fetchFilteredAreas = async (coordenacaoId: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('areas_coordenacao')
        .select('*')
        .eq('is_supervision', true)
        .eq('coordenacao_id', coordenacaoId);
      
      if (error) throw error;
      
      console.log(`Found ${data?.length} supervisions for coordination ${coordenacaoId}`);
      setFilteredAreas(data || []);
    } catch (error) {
      console.error('Error fetching filtered areas:', error);
      setFilteredAreas([]);
    } finally {
      setLoading(false);
    }
  };

  // Watch for coordenacao_id changes to filter areas
  const coordenacaoId = form.watch('coordenacao_id');
  
  useEffect(() => {
    if (coordenacaoId) {
      fetchFilteredAreas(coordenacaoId);
      
      // Clear area selection if coordination changes
      const currentAreaId = form.getValues('area_coordenacao_id');
      if (currentAreaId) {
        // We'll check if this area belongs to the selected coordination in fetchFilteredAreas
      }
    } else {
      setFilteredAreas([]);
      form.setValue('area_coordenacao_id', undefined);
    }
  }, [coordenacaoId, form]);

  const handleSubmit = async (data: FormValues) => {
    await onSubmit(data);
  };

  const handleWhatsAppChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const formattedValue = formatPhone(value);
    form.setValue('whatsapp', formattedValue);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Usuário</DialogTitle>
          <DialogDescription>
            Atualize as informações do usuário.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="nome_completo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome Completo</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome do usuário" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="email@smsub.prefeitura.sp.gov.br" 
                      type="email" 
                      {...field} 
                      disabled 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="cargo_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cargo</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um cargo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="">Selecione um cargo</SelectItem>
                      {cargos.map((cargo) => (
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
            
            <FormField
              control={form.control}
              name="coordenacao_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Coordenação</FormLabel>
                  <Select 
                    onValueChange={(value) => {
                      field.onChange(value);
                      // Clear area selection when coordenação changes
                      form.setValue('area_coordenacao_id', undefined);
                    }} 
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma coordenação" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="">Selecione uma coordenação</SelectItem>
                      {coordenacoes.map((coord) => (
                        <SelectItem key={coord.id} value={coord.id}>
                          {coord.descricao}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="area_coordenacao_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Supervisão Técnica</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    value={field.value}
                    disabled={!form.getValues('coordenacao_id') || loading || filteredAreas.length === 0}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={
                          !form.getValues('coordenacao_id') 
                            ? "Selecione uma coordenação primeiro" 
                            : loading 
                              ? "Carregando..."
                              : filteredAreas.length === 0 
                                ? "Nenhuma supervisão técnica para esta coordenação" 
                                : "Selecione uma supervisão técnica"
                        } />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="">
                        {!form.getValues('coordenacao_id') 
                          ? "Selecione uma coordenação primeiro" 
                          : filteredAreas.length === 0 
                            ? "Nenhuma supervisão técnica para esta coordenação" 
                            : "Selecione uma supervisão técnica"}
                      </SelectItem>
                      {filteredAreas.map((area) => (
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
            
            <FormField
              control={form.control}
              name="whatsapp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>WhatsApp</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="(99) 99999-9999" 
                      {...field} 
                      onChange={(e) => handleWhatsAppChange(e)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="aniversario"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Data de Aniversário</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, 'dd/MM/yyyy', { locale: pt })
                          ) : (
                            <span>Selecione uma data</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                        locale={pt}
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  'Salvar Alterações'
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditUserDialog;
