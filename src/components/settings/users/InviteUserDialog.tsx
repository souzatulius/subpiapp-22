
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { UserPlus } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Area, Cargo } from './types';
import EmailSuffix from '@/components/EmailSuffix';
import { toast } from '@/components/ui/use-toast';
import { completeEmailWithDomain } from '@/lib/authUtils';
import { supabase } from '@/integrations/supabase/client';

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
  const [filteredAreas, setFilteredAreas] = useState<Area[]>(areas);
  
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
    if (coordenacaoId) {
      const filtered = areas.filter(area => area.coordenacao_id === coordenacaoId);
      setFilteredAreas(filtered);
      
      // Clear area selection if not in filtered list
      const currentAreaId = form.getValues('area_coordenacao_id');
      if (currentAreaId && !filtered.some(area => area.id === currentAreaId)) {
        form.setValue('area_coordenacao_id', undefined);
      }
    } else {
      setFilteredAreas(areas);
    }
  }, [coordenacaoId, areas, form]);
  
  const handleSubmit = async (data: FormValues) => {
    try {
      await onSubmit(data);
      form.reset();
    } catch (error) {
      console.error('Erro ao convidar usuário:', error);
      toast({
        title: "Erro ao convidar usuário",
        description: "Ocorreu um erro ao enviar o convite. Tente novamente.",
        variant: "destructive"
      });
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
                  <Select onValueChange={field.onChange} value={field.value}>
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
                      {coordenacoes.map(coord => (
                        <SelectItem key={coord.coordenacao_id} value={coord.coordenacao_id}>
                          {coord.coordenacao}
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
                    disabled={!form.getValues('coordenacao_id') || filteredAreas.length === 0}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={
                          form.getValues('coordenacao_id') 
                            ? filteredAreas.length === 0 
                              ? "Nenhuma supervisão técnica para esta coordenação" 
                              : "Selecione uma supervisão técnica"
                            : "Selecione uma coordenação primeiro"
                        } />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {filteredAreas.map(area => (
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
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit">
                <UserPlus className="h-4 w-4 mr-2" />
                Convidar
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default InviteUserDialog;
