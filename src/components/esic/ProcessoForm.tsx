
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
import { useCoordenacoes } from '@/hooks/useCoordenacoes';

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
  assunto: z.string().min(3, {
    message: "O assunto deve ter pelo menos 3 caracteres.",
  }).max(100, {
    message: "O assunto não pode ter mais de 100 caracteres."
  }),
  solicitante: z.string().optional(),
  coordenacao_id: z.string().optional(),
  prazo_resposta: z.date().optional(),
});

interface ProcessoFormProps {
  initialValues?: ESICProcesso;
  onSubmit: (values: ESICProcessoFormValues) => Promise<void>;
  isLoading: boolean;
  onCancel: () => void;
  mode?: 'create' | 'edit';
  coordenacoes?: { id: string; nome: string }[];
}

const ProcessoForm: React.FC<ProcessoFormProps> = ({
  initialValues,
  onSubmit,
  isLoading,
  onCancel,
  mode = 'create'
}) => {
  const { toast } = useToast();
  const [prazoPredefinido, setPrazoPredefinido] = useState<string | null>(null);
  const { coordenacoes, isLoading: coordenacoesLoading } = useCoordenacoes();
  
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

  useEffect(() => {
    if (initialValues && mode === 'edit') {
      form.reset({
        data_processo: initialValues.data_processo ? new Date(initialValues.data_processo) : new Date(),
        texto: initialValues.texto || '',
        situacao: initialValues.situacao || 'em_tramitacao',
        assunto: initialValues.assunto || '',
        solicitante: initialValues.solicitante || '',
        coordenacao_id: initialValues.coordenacao_id || '',
        prazo_resposta: initialValues.prazo_resposta ? new Date(initialValues.prazo_resposta) : undefined,
      });
    }
  }, [initialValues, form, mode]);

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

  // Transform coordenacoes data to the format expected by the SelectItem components
  const formattedCoordenacoes = coordenacoes?.map(coord => ({
    id: coord.id,
    nome: coord.descricao
  })) || [];

  return (
    <Card className="w-full border rounded-xl shadow-md">
      <CardHeader className="px-6">
        <CardTitle className="text-2xl font-semibold text-subpi-blue">
          {mode === 'create' ? 'Novo Processo' : 'Editar Processo'}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="px-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                              "w-full pl-3 text-left font-normal rounded-xl",
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
                      <PopoverContent className="w-auto p-0 rounded-xl" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                          locale={ptBR}
                          className="rounded-xl"
                        />
                      </PopoverContent>
                    </Popover>
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
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="rounded-xl">
                          <SelectValue placeholder="Selecione a situação" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="rounded-xl">
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
              <FormField
                control={form.control}
                name="assunto"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assunto</FormLabel>
                    <FormControl>
                      <Input placeholder="Assunto do processo" className="rounded-xl" {...field} />
                    </FormControl>
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
                      <Input placeholder="Nome do solicitante" className="rounded-xl" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
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
                    disabled={coordenacoesLoading}
                  >
                    <FormControl>
                      <SelectTrigger className="rounded-xl">
                        <SelectValue placeholder={coordenacoesLoading ? "Carregando..." : "Selecione a coordenação"} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="none">Não atribuído</SelectItem>
                      {formattedCoordenacoes.map((coord) => (
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
                          className={`px-2 py-1 rounded-xl ${prazoPredefinido === '5dias' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100'}`}
                          onClick={() => handleCalculateDeadline('5dias')}
                        >
                          5 dias
                        </button>
                        <button 
                          type="button"
                          className={`px-2 py-1 rounded-xl ${prazoPredefinido === '10dias' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100'}`}
                          onClick={() => handleCalculateDeadline('10dias')}
                        >
                          10 dias
                        </button>
                        <button 
                          type="button"
                          className={`px-2 py-1 rounded-xl ${prazoPredefinido === '20dias' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100'}`}
                          onClick={() => handleCalculateDeadline('20dias')}
                        >
                          20 dias
                        </button>
                        <button 
                          type="button"
                          className={`px-2 py-1 rounded-xl ${prazoPredefinido === '30dias' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100'}`}
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
                              "w-full pl-3 text-left font-normal rounded-xl",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(new Date(field.value), "dd/MM/yyyy", { locale: ptBR })
                            ) : (
                              <span>Selecione a data</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 rounded-xl" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value ? new Date(field.value) : undefined}
                          onSelect={field.onChange}
                          initialFocus
                          locale={ptBR}
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
              name="texto"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Texto/Descrição</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Descreva o processo" 
                      className="min-h-[150px] rounded-xl"
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
      
      <CardFooter className="px-6 flex justify-end space-x-2">
        <Button variant="outline" onClick={onCancel} disabled={isLoading} className="rounded-xl">
          Cancelar
        </Button>
        <Button 
          onClick={form.handleSubmit(handleSubmit)}
          disabled={isLoading}
          className="rounded-xl"
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {mode === 'create' ? 'Criar Processo' : 'Salvar Alterações'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProcessoForm;
