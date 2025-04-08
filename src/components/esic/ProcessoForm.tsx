
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Form, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormMessage 
} from '@/components/ui/form';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/components/ui/use-toast';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from '@/lib/utils';
import { ESICProcesso, ESICProcessoFormValues } from '@/types/esic';

// Form validation schema using zod
const formSchema = z.object({
  data_processo: z.date({
    required_error: "A data do processo é obrigatória.",
  }),
  texto: z.string().min(10, {
    message: "O texto deve ter pelo menos 10 caracteres.",
  }),
  situacao: z.string().min(1, {
    message: "A situação é obrigatória.",
  }),
  assunto: z.string().optional(),
  solicitante: z.string().optional(),
  coordenacao_id: z.string().optional(),
  prazo_resposta: z.date().optional(),
});

interface ProcessoFormProps {
  processo?: ESICProcesso;
  onSubmit: (values: ESICProcessoFormValues) => Promise<void>;
  isSubmitting: boolean;
  onCancel: () => void;
  mode?: 'create' | 'edit';
  coordenacoes?: { id: string; nome: string }[];
}

const ProcessoForm: React.FC<ProcessoFormProps> = ({
  processo,
  onSubmit,
  isSubmitting,
  onCancel,
  mode = 'create',
  coordenacoes = []
}) => {
  const { toast } = useToast();
  const [prazoPredefinido, setPrazoPredefinido] = useState<string | null>(null);
  
  // Form initialization
  const form = useForm<ESICProcessoFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      data_processo: new Date(),
      texto: '',
      situacao: 'em_tramitacao',
      assunto: '',
      solicitante: '',
      coordenacao_id: '',
      prazo_resposta: undefined,
    },
  });

  // Update form with processo data if provided (edit mode)
  useEffect(() => {
    if (processo && mode === 'edit') {
      form.reset({
        data_processo: processo.data_processo ? new Date(processo.data_processo) : new Date(),
        texto: processo.texto || '',
        situacao: processo.situacao || 'em_tramitacao',
        assunto: processo.assunto || '',
        solicitante: processo.solicitante || '',
        coordenacao_id: processo.coordenacao_id || '',
        prazo_resposta: processo.prazo_resposta ? new Date(processo.prazo_resposta) : undefined,
      });
    }
  }, [processo, form, mode]);

  // Handle form submission
  const handleSubmit = async (values: ESICProcessoFormValues) => {
    try {
      await onSubmit(values);
      toast({
        title: mode === 'create' ? "Processo criado" : "Processo atualizado",
        description: mode === 'create' 
          ? "O processo foi criado com sucesso." 
          : "O processo foi atualizado com sucesso.",
      });
    } catch (error) {
      console.error("Erro ao processar formulário:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Ocorreu um erro ao salvar o processo.",
      });
    }
  };

  // Calculate predefined deadlines based on selected date
  const handleCalculateDeadline = (option: string) => {
    setPrazoPredefinido(option);
    const baseDate = form.getValues('data_processo');
    
    if (!baseDate) return;
    
    const deadline = new Date(baseDate);
    
    switch (option) {
      case '5dias':
        deadline.setDate(deadline.getDate() + 5);
        break;
      case '10dias':
        deadline.setDate(deadline.getDate() + 10);
        break;
      case '20dias':
        deadline.setDate(deadline.getDate() + 20);
        break;
      case '30dias':
        deadline.setDate(deadline.getDate() + 30);
        break;
      default:
        break;
    }
    
    form.setValue('prazo_resposta', deadline);
  };

  return (
    <Card className="w-full border-none shadow-none">
      <CardHeader className="px-0">
        <CardTitle>
          {mode === 'create' ? 'Novo Processo' : 'Editar Processo'}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="px-0">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "dd/MM/yyyy", { locale: ptBR })
                            ) : (
                              <span>Selecione a data</span>
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
                          locale={ptBR}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Situação */}
              <FormField
                control={form.control}
                name="situacao"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Situação</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a situação" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="em_tramitacao">Em Tramitação</SelectItem>
                        <SelectItem value="prazo_prorrogado">Prazo Prorrogado</SelectItem>
                        <SelectItem value="concluido">Concluído</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Assunto */}
              <FormField
                control={form.control}
                name="assunto"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assunto</FormLabel>
                    <FormControl>
                      <Input placeholder="Assunto do processo" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Solicitante */}
              <FormField
                control={form.control}
                name="solicitante"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Solicitante</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome do solicitante" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            {/* Coordenação */}
            <FormField
              control={form.control}
              name="coordenacao_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Coordenação Responsável</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a coordenação" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="">Não atribuído</SelectItem>
                      {coordenacoes.map((coord) => (
                        <SelectItem key={coord.id} value={coord.id}>
                          {coord.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Prazo para Resposta */}
            <div>
              <FormField
                control={form.control}
                name="prazo_resposta"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <div className="flex justify-between items-center">
                      <FormLabel>Prazo para Resposta</FormLabel>
                      <div className="flex space-x-2 text-xs">
                        <button 
                          type="button"
                          className={`px-2 py-1 rounded ${prazoPredefinido === '5dias' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100'}`}
                          onClick={() => handleCalculateDeadline('5dias')}
                        >
                          5 dias
                        </button>
                        <button 
                          type="button"
                          className={`px-2 py-1 rounded ${prazoPredefinido === '10dias' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100'}`}
                          onClick={() => handleCalculateDeadline('10dias')}
                        >
                          10 dias
                        </button>
                        <button 
                          type="button"
                          className={`px-2 py-1 rounded ${prazoPredefinido === '20dias' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100'}`}
                          onClick={() => handleCalculateDeadline('20dias')}
                        >
                          20 dias
                        </button>
                        <button 
                          type="button"
                          className={`px-2 py-1 rounded ${prazoPredefinido === '30dias' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100'}`}
                          onClick={() => handleCalculateDeadline('30dias')}
                        >
                          30 dias
                        </button>
                      </div>
                    </div>
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
                              format(field.value, "dd/MM/yyyy", { locale: ptBR })
                            ) : (
                              <span>Selecione a data</span>
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
                          locale={ptBR}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            {/* Texto/Descrição */}
            <FormField
              control={form.control}
              name="texto"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Texto/Descrição</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Descreva o processo" 
                      className="min-h-[150px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </CardContent>
      
      <CardFooter className="px-0 flex justify-end space-x-2">
        <Button variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancelar
        </Button>
        <Button 
          onClick={form.handleSubmit(handleSubmit)}
          disabled={isSubmitting}
        >
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {mode === 'create' ? 'Criar Processo' : 'Salvar Alterações'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProcessoForm;
