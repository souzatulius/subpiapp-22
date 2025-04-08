
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ESICProcesso, ESICProcessoFormValues, situacaoLabels } from '@/types/esic';
import { cn } from '@/utils/cn';
import { useCoordenacoes } from '@/hooks/useCoordenacoes';
import { DatePicker } from '@/components/ui/date-picker';

const processoSchema = z.object({
  data_processo: z.date({
    required_error: "Data do processo é obrigatória",
  }),
  situacao: z.enum(['em_tramitacao', 'prazo_prorrogado', 'concluido'], {
    required_error: "Situação é obrigatória",
  }),
  texto: z.string().min(10, "O texto deve ter no mínimo 10 caracteres"),
  coordenacao_id: z.string().optional(),
  prazo_resposta: z.date().optional(),
  solicitante: z.string().optional(),
});

interface ProcessoFormProps {
  onSubmit: (values: ESICProcessoFormValues) => void;
  initialValues?: ESICProcesso;
  isLoading: boolean;
  mode?: 'create' | 'edit';
  onCancel?: () => void;
}

const ProcessoForm: React.FC<ProcessoFormProps> = ({ 
  onSubmit, 
  initialValues, 
  isLoading, 
  mode = 'create',
  onCancel
}) => {
  const { coordenacoes, isLoading: isLoadingCoordenacoes } = useCoordenacoes();
  
  const form = useForm<ESICProcessoFormValues>({
    resolver: zodResolver(processoSchema),
    defaultValues: initialValues 
      ? {
          data_processo: new Date(initialValues.data_processo),
          situacao: initialValues.situacao,
          texto: initialValues.texto,
          coordenacao_id: initialValues.coordenacao_id,
          prazo_resposta: initialValues.prazo_resposta ? new Date(initialValues.prazo_resposta) : undefined,
          solicitante: initialValues.solicitante,
        }
      : {
          data_processo: new Date(),
          situacao: 'em_tramitacao',
          texto: '',
          coordenacao_id: undefined,
          prazo_resposta: undefined,
          solicitante: '',
        },
  });

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>
          {mode === 'create' ? 'Novo Processo' : 'Editar Processo'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP", { locale: ptBR })
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
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                        locale={ptBR}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="solicitante"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Solicitante</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Nome do solicitante" 
                      {...field} 
                      value={field.value || ''}
                    />
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
                  <Select 
                    onValueChange={field.onChange} 
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma coordenação" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {coordenacoes.map((coordenacao) => (
                        <SelectItem key={coordenacao.id} value={coordenacao.id}>
                          {coordenacao.sigla ? `${coordenacao.sigla} - ${coordenacao.descricao}` : coordenacao.descricao}
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
              name="situacao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Situação</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma situação" />
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
            
            <FormField
              control={form.control}
              name="prazo_resposta"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prazo para Resposta</FormLabel>
                  <FormControl>
                    <DatePicker
                      date={field.value}
                      onSelect={field.onChange}
                      showTimeSelect={true}
                      useDropdownTimeSelect={false}
                      placeholder="Selecione o prazo para resposta"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="texto"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Texto do Processo</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Descreva o processo..." 
                      className="min-h-[150px]" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex justify-end gap-2 pt-2">
              {onCancel && (
                <Button type="button" variant="outline" onClick={onCancel}>
                  Cancelar
                </Button>
              )}
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Salvando...' : mode === 'create' ? 'Criar Processo' : 'Salvar Alterações'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ProcessoForm;
