
import React from 'react';
import { MessageSquare, PlusCircle, MessageSquareReply, FileEdit, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import WelcomeCard from '@/components/shared/WelcomeCard';
import { useComunicacaoStats } from '@/hooks/comunicacao/useComunicacaoStats';
import { useQuickDemand } from '@/hooks/comunicacao/useQuickDemand';
import { useNotasPendentes } from '@/hooks/comunicacao/useNotasPendentes';
import { useDemandasPendentes } from '@/hooks/comunicacao/useDemandasPendentes';

const ComunicacaoDashboard = () => {
  const navigate = useNavigate();
  const statsData = useComunicacaoStats();
  const totalDemandas = statsData?.totalDemandas || 0;
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: {
      titulo: '',
      detalhes: ''
    }
  });

  const { isLoading: isLoadingDemand, submitQuickDemand } = useQuickDemand();
  const { notasPendentes, isLoading: isLoadingNotas } = useNotasPendentes();
  const { demandasPendentes, isLoading: isLoadingDemandas } = useDemandasPendentes();
  
  const onSubmitQuickDemand = async (data) => {
    try {
      await submitQuickDemand(data);
      toast({
        title: 'Solicitação enviada',
        description: 'Você será redirecionado para continuar o cadastro',
        variant: 'success'
      });
      reset();
      
      // Navigate to the full form with the quick demand data
      setTimeout(() => {
        navigate('/dashboard/comunicacao/cadastrar', { 
          state: { quickDemandData: data } 
        });
      }, 1500);
    } catch (error) {
      toast({
        title: 'Erro ao enviar solicitação',
        description: error.message || 'Tente novamente mais tarde',
        variant: 'destructive'
      });
    }
  };
  
  return (
    <motion.div 
      className="max-w-7xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <WelcomeCard
        title="Central de Comunicação"
        description="Gerencie demandas e solicitações de comunicação"
        icon={<MessageSquare className="h-6 w-6 mr-2" />}
        statTitle="Demandas"
        statValue={totalDemandas}
        statDescription="Ver todas demandas"
        statSection="demandas"
        color="bg-gradient-to-r from-green-600 to-green-800"
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        {/* Card 1: Nova Solicitação */}
        <Card className="border border-gray-200 overflow-hidden transition-all hover:border-green-300 hover:shadow-md">
          <CardHeader className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardTitle className="flex items-center">
              <PlusCircle className="h-5 w-5 mr-2" />
              Nova Solicitação
            </CardTitle>
            <CardDescription className="text-green-100">
              Cadastre rapidamente uma solicitação
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4">
            <form onSubmit={handleSubmit(onSubmitQuickDemand)} className="space-y-4">
              <div>
                <Input
                  placeholder="Título da solicitação"
                  {...register('titulo', { required: 'Título é obrigatório' })}
                  className="w-full"
                />
                {errors.titulo && (
                  <p className="text-xs text-red-500 mt-1">{errors.titulo.message}</p>
                )}
              </div>
              <div>
                <Textarea
                  placeholder="Detalhes da solicitação"
                  rows={4}
                  className="resize-none w-full"
                  {...register('detalhes', { required: 'Detalhes são obrigatórios' })}
                />
                {errors.detalhes && (
                  <p className="text-xs text-red-500 mt-1">{errors.detalhes.message}</p>
                )}
              </div>
              <div className="pt-2">
                <Button 
                  type="submit" 
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                  disabled={isLoadingDemand}
                >
                  {isLoadingDemand ? 'Enviando...' : 'Continuar cadastro'}
                </Button>
              </div>
            </form>
          </CardContent>
          <CardFooter className="bg-gray-50 p-3 border-t border-gray-200">
            <Link 
              to="/dashboard/comunicacao/cadastrar" 
              className="text-sm text-green-600 hover:text-green-800 w-full text-center"
            >
              Ir para formulário completo
            </Link>
          </CardFooter>
        </Card>

        {/* Card 2: Responder Demandas */}
        <Card className="border border-gray-200 overflow-hidden transition-all hover:border-blue-300 hover:shadow-md">
          <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardTitle className="flex items-center">
              <MessageSquareReply className="h-5 w-5 mr-2" />
              Responder Demandas
            </CardTitle>
            <CardDescription className="text-blue-100">
              Demandas pendentes de resposta
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4">
            {isLoadingDemandas ? (
              <div className="flex justify-center p-8">
                <div className="h-8 w-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
              </div>
            ) : demandasPendentes?.length > 0 ? (
              <ul className="space-y-2">
                {demandasPendentes.slice(0, 5).map((demanda) => (
                  <li key={demanda.id} className="p-2 hover:bg-blue-50 rounded flex justify-between items-center">
                    <div className="overflow-hidden">
                      <p className="font-medium text-sm truncate">{demanda.titulo}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(demanda.prazo_resposta).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      <Link to={`/dashboard/comunicacao/responder/${demanda.id}`}>
                        <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-800 hover:bg-blue-100 p-1 h-auto">
                          Responder
                        </Button>
                      </Link>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <MessageSquareReply className="h-8 w-8 mx-auto mb-2 opacity-30" />
                <p>Nenhuma demanda pendente</p>
              </div>
            )}
          </CardContent>
          <CardFooter className="bg-gray-50 p-3 border-t border-gray-200">
            <Button 
              as={Link} 
              to="/dashboard/comunicacao/responder" 
              variant="secondary"
              className="w-full"
            >
              Ver todas as demandas
            </Button>
          </CardFooter>
        </Card>

        {/* Card 3: Notas Oficiais */}
        <Card className="border border-gray-200 overflow-hidden transition-all hover:border-orange-300 hover:shadow-md">
          <CardHeader className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <CardTitle className="flex items-center">
              <FileEdit className="h-5 w-5 mr-2" />
              Notas Oficiais
            </CardTitle>
            <CardDescription className="text-orange-100">
              Gerenciamento de notas oficiais
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 flex flex-col h-64">
            <div className="mb-4 pb-4 border-b border-gray-200">
              <Button 
                as={Link} 
                to="/dashboard/comunicacao/criar-nota" 
                className="w-full bg-orange-50 hover:bg-orange-100 text-orange-800"
              >
                <FileEdit className="h-4 w-4 mr-2" />
                Criar nova nota oficial
              </Button>
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-2 flex items-center">
                <CheckCircle className="h-4 w-4 mr-1 text-amber-500" />
                Notas pendentes de aprovação
              </h4>
              
              {isLoadingNotas ? (
                <div className="flex justify-center p-4">
                  <div className="h-6 w-6 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin"></div>
                </div>
              ) : notasPendentes?.length > 0 ? (
                <ul className="space-y-2">
                  {notasPendentes.slice(0, 3).map((nota) => (
                    <li key={nota.id} className="p-2 hover:bg-amber-50 rounded flex justify-between items-center">
                      <div className="overflow-hidden">
                        <p className="font-medium text-sm truncate">{nota.titulo}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(nota.criado_em).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                      <div className="flex-shrink-0">
                        <Link to={`/dashboard/comunicacao/aprovar-nota/${nota.id}`}>
                          <Button variant="ghost" size="sm" className="text-amber-600 hover:text-amber-800 hover:bg-amber-100 p-1 h-auto">
                            Revisar
                          </Button>
                        </Link>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-4 text-gray-500">
                  <p className="text-xs">Nenhuma nota pendente de aprovação</p>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="bg-gray-50 p-3 border-t border-gray-200 flex justify-between">
            <Button 
              as={Link} 
              to="/dashboard/comunicacao/aprovar-nota" 
              variant="secondary"
              className="flex-1 mr-1"
            >
              Aprovar notas
            </Button>
            <Button 
              as={Link} 
              to="/dashboard/comunicacao/notas" 
              variant="secondary"
              className="flex-1 ml-1"
            >
              Ver todas notas
            </Button>
          </CardFooter>
        </Card>
      </div>
    </motion.div>
  );
};

export default ComunicacaoDashboard;
