import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { UserPlus, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { SupervisaoTecnica, Cargo } from './types';
import EmailSuffix from '@/components/EmailSuffix';
import { toast } from '@/components/ui/use-toast';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

const inviteUserSchema = z.object({
  email: z.string().min(1, 'Email é obrigatório'),
  nome_completo: z.string().min(3, 'Nome completo é obrigatório'),
  cargo_id: z.string().optional(),
  coordenacao_id: z.string().optional(),
  supervisao_tecnica_id: z.string().optional()
});

type FormValues = z.infer<typeof inviteUserSchema>;

interface InviteUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: FormValues) => Promise<void>;
  areas: SupervisaoTecnica[];
  cargos: Cargo[];
  coordenacoes: { coordenacao_id: string; coordenacao: string; sigla?: string }[];
}

const InviteUserDialog: React.FC<InviteUserDialogProps> = ({
  open,
  onOpenChange,
  onSubmit,
  areas,
  cargos,
  coordenacoes
}) => {
  const [filteredAreas, setFilteredAreas] = useState<SupervisaoTecnica[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(inviteUserSchema),
    defaultValues: {
      email: '',
      nome_completo: '',
      cargo_id: undefined,
      coordenacao_id: undefined,
      supervisao_tecnica_id: undefined
    }
  });
  
  const coordenacaoId = form.watch('coordenacao_id');
  
  useEffect(() => {
    if (coordenacaoId && coordenacaoId !== 'no-select-coord') {
      const filtered = areas.filter(area => area.coordenacao_id === coordenacaoId);
      setFilteredAreas(filtered);
      
      const currentAreaId = form.getValues('supervisao_tecnica_id');
      if (currentAreaId && !filtered.some(area => area.id === currentAreaId)) {
        form.setValue('supervisao_tecnica_id', undefined);
      }
    } else {
      setFilteredAreas([]);
    }
  }, [coordenacaoId, areas, form]);
  
  const handleSubmit = async (data: FormValues) => {
    try {
      setIsSubmitting(true);

      if (data.cargo_id === 'no-select-cargo') {
        data.cargo_id = undefined;
      }
      
      if (data.coordenacao_id === 'no-select-coord') {
        data.coordenacao_id = undefined;
      }
      
      if (data.supervisao_tecnica_id === 'no-select-area') {
        data.supervisao_tecnica_id = undefined;
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

  const getCoordDisplayText = (coord: { coordenacao_id: string; coordenacao: string; sigla?: string }) => {
    return coord.sigla || coord.coordenacao;
  };
  
  const getAreaDisplayText = (area: SupervisaoTecnica) => {
    return area.sigla || area.descricao;
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-50 rounded-xl">
        <DialogHeader>
          <DialogTitle className="text-xl text-subpi-blue font-semibold">Convidar Novo Usuário</DialogTitle>
          <DialogDescription>
            Envie um convite para um novo usuário se juntar à plataforma.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="bg-white p-5 rounded-xl space-y-4">
              <FormField 
                control={form.control} 
                name="nome_completo" 
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-subpi-gray-text">Nome Completo</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Nome do usuário" 
                        {...field} 
                        className="rounded-xl border-gray-300 focus:border-subpi-blue focus:ring-subpi-blue"
                      />
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
                    <FormLabel className="text-subpi-gray-text">Email</FormLabel>
                    <FormControl>
                      <EmailSuffix 
                        value={field.value} 
                        onChange={field.onChange} 
                        suffix="@smsub.prefeitura.sp.gov.br" 
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
                    <FormLabel className="text-subpi-gray-text">Cargo</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="h-12 rounded-xl border-gray-300">
                          <SelectValue placeholder="Selecione um cargo" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                          <SelectItem value="no-select-cargo">Selecione um cargo</SelectItem>
                          {cargos.map(cargo => (
                            <SelectItem key={cargo.id} value={cargo.id}>
                              {cargo.descricao}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
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
                    <FormLabel className="text-subpi-gray-text">Coordenação</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={(value) => {
                          field.onChange(value);
                          form.setValue('supervisao_tecnica_id', undefined);
                        }}
                      >
                        <SelectTrigger className="h-12 rounded-xl border-gray-300">
                          <SelectValue placeholder="Selecione uma coordenação" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                          <SelectItem value="no-select-coord">Selecione uma coordenação</SelectItem>
                          {coordenacoes.map(coord => (
                            <SelectItem key={coord.coordenacao_id} value={coord.coordenacao_id}>
                              {getCoordDisplayText(coord)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} 
              />
              
              <FormField 
                control={form.control} 
                name="supervisao_tecnica_id" 
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-subpi-gray-text">Supervisão Técnica</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={!form.getValues('coordenacao_id') || filteredAreas.length === 0 || form.getValues('coordenacao_id') === 'no-select-coord'}
                      >
                        <SelectTrigger className="h-12 rounded-xl border-gray-300">
                          <SelectValue placeholder={
                            !form.getValues('coordenacao_id') || form.getValues('coordenacao_id') === 'no-select-coord'
                              ? "Selecione uma coordenação primeiro"
                              : filteredAreas.length === 0
                              ? "Nenhuma supervisão técnica para esta coordenação"
                              : "Selecione uma supervisão técnica"
                          } />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                          {!form.getValues('coordenacao_id') || form.getValues('coordenacao_id') === 'no-select-coord' ? (
                            <SelectItem value="no-coord-selected">
                              Selecione uma coordenação primeiro
                            </SelectItem>
                          ) : filteredAreas.length === 0 ? (
                            <SelectItem value="no-areas-available">
                              Nenhuma supervisão técnica para esta coordenação
                            </SelectItem>
                          ) : (
                            <>
                              <SelectItem value="no-select-area">Selecione uma supervisão técnica</SelectItem>
                              {filteredAreas.map(area => (
                                <SelectItem key={area.id} value={area.id}>
                                  {getAreaDisplayText(area)}
                                </SelectItem>
                              ))}
                            </>
                          )}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} 
              />
            </div>
            
            <DialogFooter className="mt-6">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)} 
                disabled={isSubmitting}
                className="rounded-xl"
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="rounded-xl bg-subpi-blue hover:bg-subpi-blue-dark"
              >
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
