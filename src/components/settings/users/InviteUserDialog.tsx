
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { UserPlus, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Area, Cargo } from './types';
import EmailSuffix from '@/components/EmailSuffix';
import { toast } from '@/components/ui/use-toast';

const inviteUserSchema = z.object({
  email: z.string().min(1, 'Email é obrigatório'),
  nome_completo: z.string().min(3, 'Nome completo é obrigatório'),
  cargo_id: z.string().optional(),
  coordenacao_id: z.string().optional(),
  area_coordenacao_id: z.string().optional()
});

type FormValues = z.infer<typeof inviteUserSchema>;

interface InviteUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: FormValues) => Promise<void>;
  areas: Area[];
  cargos: Cargo[];
  coordenacoes: { coordenacao_id: string; coordenacao: string }[];
}

const InviteUserDialog: React.FC<InviteUserDialogProps> = ({
  open,
  onOpenChange,
  onSubmit,
  areas,
  cargos,
  coordenacoes
}) => {
  const [filteredAreas, setFilteredAreas] = useState<Area[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(inviteUserSchema),
    defaultValues: {
      email: '',
      nome_completo: '',
      cargo_id: undefined,
      coordenacao_id: undefined,
      area_coordenacao_id: undefined
    }
  });
  
  // Watch for coordenacao_id changes
  const coordenacaoId = form.watch('coordenacao_id');
  
  // Filter areas based on selected coordenação
  useEffect(() => {
    if (coordenacaoId && coordenacaoId !== 'select-coordenacao') {
      const filtered = areas.filter(area => area.coordenacao_id === coordenacaoId);
      setFilteredAreas(filtered);
      
      // Clear area selection if not in filtered list
      const currentAreaId = form.getValues('area_coordenacao_id');
      if (currentAreaId && !filtered.some(area => area.id === currentAreaId)) {
        form.setValue('area_coordenacao_id', undefined);
      }
    } else {
      setFilteredAreas([]);
    }
  }, [coordenacaoId, areas, form]);
  
  const handleSubmit = async (data: FormValues) => {
    try {
      setIsSubmitting(true);

      // Validate the selected values
      if (data.cargo_id === 'select-cargo') {
        data.cargo_id = undefined;
      }
      
      if (data.coordenacao_id === 'select-coordenacao') {
        data.coordenacao_id = undefined;
      }
      
      if (data.area_coordenacao_id === 'select-area') {
        data.area_coordenacao_id = undefined;
      }
      
      await onSubmit(data);
      form.reset();
      onOpenChange(false);
    } catch (error) {
      console.error('Erro ao convidar usuário:', error);
      toast({
        title: "Erro ao convidar usuário",
        description: "Ocorreu um erro ao enviar o convite. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-zinc-100">
        <DialogHeader>
          <DialogTitle>Convidar Novo Usuário</DialogTitle>
          <DialogDescription>
            Envie um convite para um novo usuário se juntar à plataforma.
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
                    <EmailSuffix 
                      value={field.value} 
                      onChange={field.onChange} 
                      suffix="@smsub.prefeitura.sp.gov.br" 
                      placeholder="email.usuario" 
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
                  <FormControl>
                    <select
                      className="flex h-12 w-full items-center justify-between rounded-xl border border-gray-300 bg-white px-4 py-3 text-base text-subpi-gray-text shadow-sm ring-offset-background placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-subpi-blue focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-300"
                      value={field.value}
                      onChange={field.onChange}
                    >
                      <option value="select-cargo">Selecione um cargo</option>
                      {cargos.map(cargo => (
                        <option key={cargo.id} value={cargo.id}>
                          {cargo.descricao}
                        </option>
                      ))}
                    </select>
                  </FormControl>
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
                  <FormControl>
                    <select
                      className="flex h-12 w-full items-center justify-between rounded-xl border border-gray-300 bg-white px-4 py-3 text-base text-subpi-gray-text shadow-sm ring-offset-background placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-subpi-blue focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-300"
                      value={field.value}
                      onChange={(e) => {
                        field.onChange(e);
                        // Clear area selection when coordenação changes
                        form.setValue('area_coordenacao_id', undefined);
                      }}
                    >
                      <option value="select-coordenacao">Selecione uma coordenação</option>
                      {coordenacoes.map(coord => (
                        <option key={coord.coordenacao_id} value={coord.coordenacao_id}>
                          {coord.coordenacao}
                        </option>
                      ))}
                    </select>
                  </FormControl>
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
                  <FormControl>
                    <select
                      className="flex h-12 w-full items-center justify-between rounded-xl border border-gray-300 bg-white px-4 py-3 text-base text-subpi-gray-text shadow-sm ring-offset-background placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-subpi-blue focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-300"
                      value={field.value}
                      onChange={field.onChange}
                      disabled={!form.getValues('coordenacao_id') || filteredAreas.length === 0 || form.getValues('coordenacao_id') === 'select-coordenacao'}
                    >
                      <option value="select-area">
                        {!form.getValues('coordenacao_id') || form.getValues('coordenacao_id') === 'select-coordenacao'
                          ? "Selecione uma coordenação primeiro"
                          : filteredAreas.length === 0
                          ? "Nenhuma supervisão técnica para esta coordenação"
                          : "Selecione uma supervisão técnica"}
                      </option>
                      {filteredAreas.map(area => (
                        <option key={area.id} value={area.id}>
                          {area.descricao}
                        </option>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} 
            />
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Convidando...
                  </>
                ) : (
                  <>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Convidar
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default InviteUserDialog;
