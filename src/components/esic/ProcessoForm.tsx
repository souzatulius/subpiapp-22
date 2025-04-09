
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ESICProcesso, ESICProcessoFormValues, situacaoLabels } from '@/types/esic';
import { Checkbox } from '@/components/ui/checkbox';

// Define the form schema
const formSchema = z.object({
  data_processo: z.date({
    required_error: 'A data do processo é obrigatória.',
  }),
  assunto: z.string().min(3, 'O assunto deve ter pelo menos 3 caracteres.'),
  solicitante: z.string().optional(),
  texto: z.string().min(10, 'A descrição deve ter pelo menos 10 caracteres.'),
  situacao: z.string({
    required_error: 'A situação é obrigatória.',
  }),
  coordenacao_id: z.string().optional(),
  prazo_resposta: z.date().optional(),
  sem_area_tecnica: z.boolean().default(false),
  sem_identificacao: z.boolean().default(false),
});

interface ProcessoFormProps {
  defaultValues?: Partial<ESICProcessoFormValues>;
  onSubmit: (values: ESICProcessoFormValues) => Promise<void>;
  isSubmitting?: boolean;
  onCancel?: () => void;
  coordenacoes?: { id: string; nome: string }[];
  isEditing?: boolean;
}

const ProcessoForm: React.FC<ProcessoFormProps> = ({
  defaultValues,
  onSubmit,
  isSubmitting = false,
  onCancel,
  coordenacoes = [],
  isEditing = false,
}) => {
  const form = useForm<ESICProcessoFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      data_processo: defaultValues?.data_processo ? new Date(defaultValues.data_processo) : new Date(),
      assunto: defaultValues?.assunto || '',
      solicitante: defaultValues?.solicitante || '',
      texto: defaultValues?.texto || '',
      situacao: defaultValues?.situacao || 'em_tramitacao',
      coordenacao_id: defaultValues?.coordenacao_id || undefined,
      prazo_resposta: defaultValues?.prazo_resposta ? new Date(defaultValues.prazo_resposta) : undefined,
      sem_area_tecnica: defaultValues?.coordenacao_id === null || false,
      sem_identificacao: defaultValues?.solicitante === 'Sem identificação' || false,
    },
  });

  const semAreaTecnica = form.watch('sem_area_tecnica');
  const semIdentificacao = form.watch('sem_identificacao');

  React.useEffect(() => {
    if (semAreaTecnica) {
      form.setValue('coordenacao_id', undefined);
    }
  }, [semAreaTecnica, form]);
  
  React.useEffect(() => {
    if (semIdentificacao) {
      form.setValue('solicitante', '');
    }
  }, [semIdentificacao, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Data do Processo */}
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
                        variant={'outline'}
                        className={cn(
                          'pl-3 text-left font-normal',
                          !field.value && 'text-muted-foreground'
                        )}
                      >
                        {field.value ? (
                          format(field.value, 'PPP', { locale: ptBR })
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
                      disabled={(date) =>
                        date > new Date() || date < new Date('1900-01-01')
                      }
                      locale={ptBR}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Prazo de Resposta */}
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
                        variant={'outline'}
                        className={cn(
                          'pl-3 text-left font-normal',
                          !field.value && 'text-muted-foreground'
                        )}
                      >
                        {field.value ? (
                          format(field.value, 'PPP', { locale: ptBR })
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
                      disabled={(date) =>
                        date < new Date()
                      }
                      locale={ptBR}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription>
                  Data limite para resposta ao munícipe.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Assunto */}
        <FormField
          control={form.control}
          name="assunto"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Assunto</FormLabel>
              <FormControl>
                <Input placeholder="Digite o assunto do processo" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Solicitante */}
        <div className="space-y-4">
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
                  <FormDescription>
                    Marque esta opção se o solicitante não se identificou.
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />

          {!semIdentificacao && (
            <FormField
              control={form.control}
              name="solicitante"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Solicitante</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Digite o nome do solicitante" 
                      {...field} 
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>

        {/* Coordenação */}
        <div className="space-y-4">
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
                  <FormLabel>Sem área técnica específica</FormLabel>
                  <FormDescription>
                    Marque esta opção se o processo não se destina a uma área técnica específica.
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />

          {!semAreaTecnica && (
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
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma coordenação" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">Nenhuma</SelectItem>
                      {coordenacoes.map((coord) => (
                        <SelectItem key={coord.id} value={coord.id}>
                          {coord.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Coordenação responsável pelo processo.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>

        {/* Situação */}
        <FormField
          control={form.control}
          name="situacao"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Situação</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a situação do processo" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
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

        {/* Texto */}
        <FormField
          control={form.control}
          name="texto"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Digite a descrição detalhada do processo"
                  className="min-h-[200px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-4">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
          )}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Salvando...' : isEditing ? 'Atualizar' : 'Criar Processo'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ProcessoForm;
