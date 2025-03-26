
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { AlertCircle, Clock, CheckCircle2, Archive, XCircle, MapPin, Phone, Mail, User, Calendar, FileText, MessageSquare, Loader2 } from 'lucide-react';

interface Demand {
  id: string;
  titulo: string;
  status: string;
  prioridade: string;
  horario_publicacao: string;
  prazo_resposta: string;
  area_coordenacao: {
    descricao: string;
  } | null;
  servico: {
    descricao: string;
  } | null;
  origem: {
    descricao: string;
  } | null;
  tipo_midia: {
    descricao: string;
  } | null;
  bairro: {
    nome: string;
  } | null;
  autor: {
    nome_completo: string;
  } | null;
  endereco: string | null;
  nome_solicitante: string | null;
  email_solicitante: string | null;
  telefone_solicitante: string | null;
  veiculo_imprensa: string | null;
  detalhes_solicitacao: string | null;
  perguntas: Record<string, string> | null;
}

interface DemandDetailProps {
  demand: Demand | null;
  isOpen: boolean;
  onClose: () => void;
}

interface Resposta {
  id: string;
  demanda_id: string;
  texto: string;
  respostas: Record<string, string> | null;
  usuario_id: string;
  criado_em: string;
  comentarios: string | null;
}

// Form schema for responses
const formSchema = z.object({
  responses: z.record(z.string().min(1, "A resposta é obrigatória"))
});

type FormValues = z.infer<typeof formSchema>;

const DemandDetail: React.FC<DemandDetailProps> = ({
  demand,
  isOpen,
  onClose
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resposta, setResposta] = useState<Resposta | null>(null);
  const [isLoadingResposta, setIsLoadingResposta] = useState(false);
  const queryClient = useQueryClient();

  // Set up the form with default values based on questions
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      responses: demand?.perguntas ? Object.keys(demand.perguntas).reduce((acc, key) => {
        acc[key] = "";
        return acc;
      }, {} as Record<string, string>) : {}
    }
  });

  // Fetch response data when demand changes
  useEffect(() => {
    const fetchResposta = async () => {
      if (!demand) return;
      
      setIsLoadingResposta(true);
      
      try {
        const { data, error } = await supabase
          .from('respostas_demandas')
          .select('*')
          .eq('demanda_id', demand.id)
          .maybeSingle();
          
        if (error) throw error;
        
        setResposta(data);
        
        // If there's a response with answer data, populate the form
        if (data && data.respostas) {
          form.reset({
            responses: data.respostas
          });
        }
      } catch (error) {
        console.error('Error fetching response:', error);
      } finally {
        setIsLoadingResposta(false);
      }
    };
    
    if (isOpen && demand) {
      fetchResposta();
    }
  }, [demand, isOpen, form]);

  // Reset form when demand changes
  useEffect(() => {
    if (demand?.perguntas && !resposta) {
      const defaultResponses = Object.keys(demand.perguntas).reduce((acc, key) => {
        acc[key] = "";
        return acc;
      }, {} as Record<string, string>);
      form.reset({
        responses: defaultResponses
      });
    }
  }, [demand, form, resposta]);

  const submitResponseMutation = useMutation({
    mutationFn: async (data: FormValues) => {
      if (!demand) throw new Error("Demanda não encontrada");
      
      // Format the response text with questions and answers
      const responseText = Object.entries(data.responses).map(([key, value]) => {
        const question = demand.perguntas?.[key] || key;
        return `Pergunta: ${question}\nResposta: ${value}`;
      }).join('\n\n');

      // If there's already a response, update it
      if (resposta) {
        const {
          error
        } = await supabase.from('respostas_demandas').update({
          texto: responseText,
          respostas: data.responses
        }).eq('id', resposta.id);
        
        if (error) throw error;
      } else {
        // Otherwise, create a new response
        const {
          error
        } = await supabase.from('respostas_demandas').insert({
          demanda_id: demand.id,
          texto: responseText,
          respostas: data.responses,
          usuario_id: (await supabase.auth.getUser()).data.user?.id
        });
        
        if (error) throw error;
      }

      // Update the demand status to 'em_andamento'
      const {
        error: updateError
      } = await supabase.from('demandas').update({
        status: 'em_andamento'
      }).eq('id', demand.id);
      
      if (updateError) throw updateError;
    },
    onSuccess: () => {
      toast({
        title: "Respostas enviadas",
        description: "As respostas foram salvas com sucesso",
        variant: "default"
      });
      queryClient.invalidateQueries({
        queryKey: ['demandas']
      });
      onClose();
    },
    onError: error => {
      console.error("Error submitting response:", error);
      toast({
        title: "Erro ao enviar respostas",
        description: error.message || "Ocorreu um erro ao enviar as respostas.",
        variant: "destructive"
      });
    },
    onSettled: () => {
      setIsSubmitting(false);
    }
  });

  const onSubmit = (data: FormValues) => {
    setIsSubmitting(true);
    submitResponseMutation.mutate(data);
  };

  // Helper function to get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pendente':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'em_andamento':
        return <AlertCircle className="h-5 w-5 text-blue-500" />;
      case 'concluida':
      case 'respondida':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'arquivada':
        return <Archive className="h-5 w-5 text-gray-500" />;
      case 'cancelada':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  // Helper function to get status text
  const formatStatus = (status: string) => {
    switch (status) {
      case 'pendente':
        return 'Pendente';
      case 'em_andamento':
        return 'Em Andamento';
      case 'respondida':
        return 'Respondida';
      case 'concluida':
        return 'Concluída';
      case 'arquivada':
        return 'Arquivada';
      case 'cancelada':
        return 'Cancelada';
      default:
        return status;
    }
  };

  // Helper function to get priority color
  const getPriorityColor = (prioridade: string) => {
    switch (prioridade) {
      case 'alta':
        return 'text-red-600';
      case 'media':
        return 'text-yellow-600';
      case 'baixa':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  // Helper function to format priority text
  const formatPriority = (prioridade: string) => {
    switch (prioridade) {
      case 'alta':
        return 'Alta';
      case 'media':
        return 'Média';
      case 'baixa':
        return 'Baixa';
      default:
        return prioridade;
    }
  };

  // Render previously saved responses
  const renderSavedResponses = () => {
    if (!resposta || !resposta.respostas || !demand?.perguntas) return null;
    
    return (
      <div className="space-y-4 mt-4">
        <h3 className="text-lg font-medium text-blue-700">Respostas Salvas</h3>
        {Object.entries(resposta.respostas).map(([key, answer]) => {
          const question = demand.perguntas?.[key] || key;
          return (
            <div key={key} className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <h4 className="font-medium text-blue-800">{question}</h4>
              <p className="mt-2 text-blue-900 whitespace-pre-line">{answer}</p>
            </div>
          );
        })}
        
        {resposta.comentarios && (
          <div className="mt-4">
            <h4 className="font-medium text-gray-700">Comentários Internos</h4>
            <p className="mt-1 text-gray-600 whitespace-pre-line bg-gray-50 p-3 rounded border border-gray-200">
              {resposta.comentarios}
            </p>
          </div>
        )}
      </div>
    );
  };

  if (!demand) return null;

  return (
    <Dialog open={isOpen} onOpenChange={open => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-slate-50">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">{demand.titulo}</DialogTitle>
          <DialogDescription className="flex items-center gap-2 text-base">
            {getStatusIcon(demand.status)}
            <span>{formatStatus(demand.status)}</span>
            <span className="mx-2">•</span>
            <span className={`font-medium ${getPriorityColor(demand.prioridade)}`}>
              Prioridade: {formatPriority(demand.prioridade)}
            </span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Main information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Área</h3>
              <p className="text-base">{demand.area_coordenacao?.descricao || 'Não especificado'}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">Serviço</h3>
              <p className="text-base">{demand.servico?.descricao || 'Não especificado'}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">Origem</h3>
              <p className="text-base">{demand.origem?.descricao || 'Não especificado'}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">Tipo de Mídia</h3>
              <p className="text-base">{demand.tipo_midia?.descricao || 'Não especificado'}</p>
            </div>
            
            <div className="flex items-start gap-2">
              <Calendar className="h-4 w-4 mt-0.5 text-gray-500" />
              <div>
                <h3 className="text-sm font-medium text-gray-500">Data de Criação</h3>
                <p className="text-base">
                  {demand.horario_publicacao ? format(new Date(demand.horario_publicacao), 'dd/MM/yyyy HH:mm', {
                  locale: ptBR
                }) : 'Não disponível'}
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-2">
              <Calendar className="h-4 w-4 mt-0.5 text-gray-500" />
              <div>
                <h3 className="text-sm font-medium text-gray-500">Prazo</h3>
                <p className="text-base">
                  {demand.prazo_resposta ? format(new Date(demand.prazo_resposta), 'dd/MM/yyyy', {
                  locale: ptBR
                }) : 'Sem prazo definido'}
                </p>
              </div>
            </div>
          </div>
          
          <Separator />
          
          {/* Location information */}
          <div className="space-y-4">
            <h3 className="text-base font-medium">Localização</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 text-gray-500" />
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Bairro</h3>
                  <p className="text-base">{demand.bairro?.nome || 'Não especificado'}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 text-gray-500" />
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Endereço</h3>
                  <p className="text-base">{demand.endereco || 'Não especificado'}</p>
                </div>
              </div>
            </div>
          </div>
          
          <Separator />
          
          {/* Requester information */}
          <div className="space-y-4">
            <h3 className="text-base font-medium">Informações do Solicitante</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-2">
                <User className="h-4 w-4 mt-0.5 text-gray-500" />
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Nome</h3>
                  <p className="text-base">{demand.nome_solicitante || 'Não especificado'}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <Mail className="h-4 w-4 mt-0.5 text-gray-500" />
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Email</h3>
                  <p className="text-base">{demand.email_solicitante || 'Não especificado'}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <Phone className="h-4 w-4 mt-0.5 text-gray-500" />
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Telefone</h3>
                  <p className="text-base">{demand.telefone_solicitante || 'Não especificado'}</p>
                </div>
              </div>
              
              {demand.veiculo_imprensa && (
                <div className="flex items-start gap-2">
                  <FileText className="h-4 w-4 mt-0.5 text-gray-500" />
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Veículo de Imprensa</h3>
                    <p className="text-base">{demand.veiculo_imprensa}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {demand.detalhes_solicitacao && (
            <>
              <Separator />
              <div className="space-y-2">
                <h3 className="text-base font-medium">Detalhes da Solicitação</h3>
                <p className="text-base whitespace-pre-line">{demand.detalhes_solicitacao}</p>
              </div>
            </>
          )}
          
          {/* Display Saved Responses */}
          {resposta && (
            <>
              <Separator />
              {renderSavedResponses()}
            </>
          )}
          
          {/* Questions & Responses Section */}
          {!resposta && demand.perguntas && Object.keys(demand.perguntas).length > 0 && (
            <>
              <Separator />
              <div className="space-y-4">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Perguntas e Respostas
                </h3>
                
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {Object.entries(demand.perguntas).map(([key, question]) => (
                      <FormField
                        key={key}
                        control={form.control}
                        name={`responses.${key}`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base font-medium">{question}</FormLabel>
                            <FormControl>
                              <Textarea
                                {...field}
                                placeholder="Digite sua resposta aqui..."
                                className="min-h-[100px] focus:border-[#003570] focus:ring-[#003570]"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    ))}
                    
                    <DialogFooter>
                      <Button type="button" variant="outline" onClick={onClose}>
                        Cancelar
                      </Button>
                      <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Enviando...
                          </>
                        ) : 'Enviar Respostas'}
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DemandDetail;
