
import React from 'react';
import { MessageSquare, MessageSquareReply, FileEdit, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import WelcomeCard from '@/components/shared/WelcomeCard';
import { useComunicacaoStats } from '@/hooks/comunicacao/useComunicacaoStats';
import { useNotasPendentes } from '@/hooks/comunicacao/useNotasPendentes';
import { useDemandasPendentes } from '@/hooks/comunicacao/useDemandasPendentes';
import { useOrigens } from '@/hooks/comunicacao/useOrigens';

const ComunicacaoDashboard = () => {
  const navigate = useNavigate();
  const statsData = useComunicacaoStats();
  const totalDemandas = statsData?.totalDemandas || 0;
  
  const { notasPendentes, isLoading: isLoadingNotas } = useNotasPendentes();
  const { demandasPendentes, isLoading: isLoadingDemandas } = useDemandasPendentes();
  const { origens, isLoading: isLoadingOrigens } = useOrigens();
  
  const handleOrigemSelect = (origemId: string) => {
    navigate('/dashboard/comunicacao/cadastrar', { 
      state: { selectedOrigemId: origemId } 
    });
  };
  
  // Get icon for origem
  const getOrigemIcon = (descricao: string) => {
    const lowerDesc = descricao.toLowerCase();
    if (lowerDesc.includes('email') || lowerDesc.includes('e-mail')) {
      return 'mail';
    } else if (lowerDesc.includes('imprensa') || lowerDesc.includes('jornal')) {
      return 'newspaper';
    } else if (lowerDesc.includes('whatsapp')) {
      return 'message-circle';
    } else if (lowerDesc.includes('telefone')) {
      return 'phone';
    } else if (lowerDesc.includes('redes')) {
      return 'share-2';
    }
    return 'message-square'; // default
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
        color="bg-gradient-to-r from-blue-800 to-blue-950"
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        {/* Card 1: Nova Solicitação */}
        <Card className="border border-gray-200 overflow-hidden transition-all hover:border-blue-300 hover:shadow-md">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
            <CardTitle className="flex items-center text-white">
              <MessageSquare className="h-5 w-5 mr-2 text-white" />
              Nova Solicitação
            </CardTitle>
            <CardDescription className="text-blue-100">
              De onde vem a solicitação?
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4">
            {isLoadingOrigens ? (
              <div className="flex justify-center p-8">
                <div className="h-8 w-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {origens?.map((origem) => {
                  const iconName = getOrigemIcon(origem.descricao);
                  // Dynamically import the icon
                  const IconComponent = require(`lucide-react`)[iconName.charAt(0).toUpperCase() + iconName.slice(1)];
                  
                  return (
                    <Button
                      key={origem.id}
                      variant="outline"
                      className="flex items-center justify-start p-3 h-auto text-left"
                      onClick={() => handleOrigemSelect(origem.id)}
                    >
                      {IconComponent ? (
                        <IconComponent className="h-5 w-5 mr-2 text-blue-600" />
                      ) : (
                        <MessageSquare className="h-5 w-5 mr-2 text-blue-600" />
                      )}
                      <span>{origem.descricao}</span>
                    </Button>
                  );
                })}
              </div>
            )}
          </CardContent>
          <CardFooter className="bg-gray-50 p-3 border-t border-gray-200">
            <Link 
              to="/dashboard/comunicacao/cadastrar" 
              className="text-sm text-blue-700 hover:text-blue-900 w-full text-center"
            >
              Ir para formulário completo
            </Link>
          </CardFooter>
        </Card>

        {/* Card 2: Responder Demandas */}
        <Card className="border border-gray-200 overflow-hidden transition-all hover:border-blue-300 hover:shadow-md">
          <CardHeader className="bg-gradient-to-r from-blue-700 to-blue-800 text-white">
            <CardTitle className="flex items-center text-white">
              <MessageSquareReply className="h-5 w-5 mr-2 text-white" />
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
            <Link to="/dashboard/comunicacao/responder" className="w-full">
              <Button variant="secondary" className="w-full text-blue-700">
                Ver todas as demandas
              </Button>
            </Link>
          </CardFooter>
        </Card>

        {/* Card 3: Notas Oficiais */}
        <Card className="border border-gray-200 overflow-hidden transition-all hover:border-blue-300 hover:shadow-md">
          <CardHeader className="bg-gradient-to-r from-blue-800 to-blue-900 text-white">
            <CardTitle className="flex items-center text-white">
              <FileEdit className="h-5 w-5 mr-2 text-white" />
              Notas Oficiais
            </CardTitle>
            <CardDescription className="text-blue-100">
              Gerenciamento de notas oficiais
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 flex flex-col h-64">
            <div className="mb-4 pb-4 border-b border-gray-200">
              <Link to="/dashboard/comunicacao/criar-nota" className="w-full">
                <Button className="w-full bg-blue-50 hover:bg-blue-100 text-blue-800">
                  <FileEdit className="h-4 w-4 mr-2" />
                  Criar nova nota oficial
                </Button>
              </Link>
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-2 flex items-center">
                <CheckCircle className="h-4 w-4 mr-1 text-blue-500" />
                Notas pendentes de aprovação
              </h4>
              
              {isLoadingNotas ? (
                <div className="flex justify-center p-4">
                  <div className="h-6 w-6 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                </div>
              ) : notasPendentes?.length > 0 ? (
                <ul className="space-y-2">
                  {notasPendentes.slice(0, 3).map((nota) => (
                    <li key={nota.id} className="p-2 hover:bg-blue-50 rounded flex justify-between items-center">
                      <div className="overflow-hidden">
                        <p className="font-medium text-sm truncate">{nota.titulo}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(nota.criado_em).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                      <div className="flex-shrink-0">
                        <Link to={`/dashboard/comunicacao/aprovar-nota/${nota.id}`}>
                          <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-800 hover:bg-blue-100 p-1 h-auto">
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
            <Link to="/dashboard/comunicacao/aprovar-nota" className="flex-1 mr-1">
              <Button variant="secondary" className="w-full text-blue-700">
                Aprovar notas
              </Button>
            </Link>
            <Link to="/dashboard/comunicacao/notas" className="flex-1 ml-1">
              <Button variant="secondary" className="w-full text-blue-700">
                Ver todas notas
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </motion.div>
  );
};

export default ComunicacaoDashboard;
