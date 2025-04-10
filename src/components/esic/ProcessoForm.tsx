import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarIcon, Info, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Checkbox } from '@/components/ui/checkbox';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ESICProcesso, ESICProcessoFormValues, situacaoLabels } from '@/types/esic';
import { cn } from '@/lib/utils';

const formSchema = z.object({
  protocolo: z.string().min(1, "Protocolo é obrigatório"),
  assunto: z.string().min(3, "Assunto deve ter pelo menos 3 caracteres"),
  solicitante: z.string().optional(),
  data_processo: z.date(),
  texto: z.string().min(10, "A descrição deve ter pelo menos 10 caracteres"),
  situacao: z.string().min(1, "Situação é obrigatória"),
  coordenacao_id: z.string().optional(),
  prazo_resposta: z.date().optional(),
  sem_area_tecnica: z.boolean().default(false).optional(),
  sem_identificacao: z.boolean().default(false).optional()
});

interface ProcessoFormProps {
  defaultValues?: Partial<ESICProcessoFormValues>;
  onSubmit: (values: ESICProcessoFormValues) => Promise<void>;
  onCancel: () => void;
  coordenacoes: { id: string; nome: string }[];
  isEditing?: boolean;
  isSubmitting?: boolean;
}

const ProcessoForm: React.FC<ProcessoFormProps> = ({
  onSubmit,
  onCancel,
  defaultValues,
  coordenacoes,
  isEditing = false,
  isSubmitting = false
}) => {
  const [showCoordenacoes, setShowCoordenacoes] = useState(!defaultValues?.sem_area_tecnica);
  
  const form = useForm<ESICProcessoFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      protocolo: defaultValues?.protocolo || '',
      assunto: defaultValues?.assunto || '',
      solicitante: defaultValues?.solicitante || '',
      data_processo: defaultValues?.data_processo ? 
        (typeof defaultValues.data_processo === 'string' ? 
          new Date(defaultValues.data_processo) : defaultValues.data_processo) : 
        new Date(),
      texto: defaultValues?.texto || '',
      situacao: defaultValues?.situacao || 'em_tramitacao',
      coordenacao_id: defaultValues?.coordenacao_id || '',
      prazo_resposta: defaultValues?.prazo_resposta ? 
        (typeof defaultValues.prazo_resposta === 'string' ? 
          new Date(defaultValues.prazo_resposta) : defaultValues.prazo_resposta) : 
        undefined,
      sem_area_tecnica: defaultValues?.sem_area_tecnica || false,
      sem_identificacao: defaultValues?.sem_identificacao || false
    }
  });

  const semAreaTecnica = form.watch('sem_area_tecnica');
  const semIdentificacao = form.watch('sem_identificacao');
  
  React.useEffect(() => {
    setShowCoordenacoes(!semAreaTecnica);
    if (semAreaTecnica) {
      form.setValue('coordenacao_id', undefined);
    }
  }, [semAreaTecnica, form]);
  
  React.useEffect(() => {
    if (semIdentificacao) {
      form.setValue('solicitante', undefined);
    }
  }, [semIdentificacao, form]);

  const handleSubmit = async (values: ESICProcessoFormValues) => {
    await onSubmit(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="protocolo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Protocolo e-SIC</FormLabel>
                <FormControl>
                  <Input placeholder="Digite o protocolo do processo" {...field} className="rounded-md" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="data_processo"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Data do Processo</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full pl-3 text-left font-normal rounded-xl border border-gray-300 shadow-sm",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(new Date(field.value), "PPP", { locale: ptBR })
                        ) : (
                          <span>Selecione uma data</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 rounded-xl shadow-md border border-gray-100" align="start">
                    <Calendar
                      mode="single"
                      selected={new Date(field.value)}
                      onSelect={(date) => field.onChange(date || new Date())}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                      className="rounded-xl"
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="assunto"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Assunto</FormLabel>
              <FormControl>
                <Input placeholder="Digite o assunto do processo" {...field} className="rounded-md" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex items-center space-x-2">
          <FormField
            control={form.control}
            name="sem_identificacao"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Sem identificação</FormLabel>
                </div>
              </FormItem>
            )}
          />
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-4 w-4 text-gray-400" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Marque esta opção se o solicitante não forneceu identificação</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        {!semIdentificacao && (
          <FormField
            control={form.control}
            name="solicitante"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Solicitante</FormLabel>
                <FormControl>
                  <Input placeholder="Nome do solicitante" {...field} className="rounded-md" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        
        <FormField
          control={form.control}
          name="texto"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Texto do Processo</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Digite o texto da solicitação"
                  className="min-h-[120px] rounded-md"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="situacao"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Situação</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="rounded-xl border border-gray-300 shadow-sm">
                      <SelectValue placeholder="Selecione uma situação" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="rounded-xl shadow-md border border-gray-100">
                    {Object.entries(situacaoLabels).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
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
            name="prazo_resposta"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Prazo de Resposta (opcional)</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full pl-3 text-left font-normal rounded-xl border border-gray-300 shadow-sm",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(new Date(field.value), "PPP", { locale: ptBR })
                        ) : (
                          <span>Selecione uma data</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 rounded-xl shadow-md border border-gray-100" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value ? new Date(field.value) : undefined}
                      onSelect={(date) => field.onChange(date)}
                      disabled={(date) =>
                        date < new Date()
                      }
                      initialFocus
                      className="rounded-xl"
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <FormField
            control={form.control}
            name="sem_area_tecnica"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Sem área técnica</FormLabel>
                </div>
              </FormItem>
            )}
          />
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-4 w-4 text-gray-400" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Marque esta opção se o processo não está associado a nenhuma coordenação</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        {showCoordenacoes && (
          <FormField
            control={form.control}
            name="coordenacao_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Coordenação</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="rounded-xl border border-gray-300 shadow-sm">
                      <SelectValue placeholder="Selecione uma coordenação" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="rounded-xl shadow-md border border-gray-100">
                    {coordenacoes.map((coordenacao) => (
                      <SelectItem key={coordenacao.id} value={coordenacao.id}>
                        {coordenacao.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        
        <div className="pt-4 flex justify-end">
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="rounded-xl shadow-sm"
          >
            {isSubmitting ? 'Salvando...' : isEditing ? 'Atualizar Processo' : 'Criar Processo'}
          </Button>
          <Button 
            variant="outline" 
            onClick={onCancel} 
            className="ml-2 rounded-xl shadow-sm"
          >
            Cancelar
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ProcessoForm;
