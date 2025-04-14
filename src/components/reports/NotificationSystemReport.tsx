
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Bell, Mail, Phone, Users, Database, AlertCircle } from 'lucide-react';

const NotificationSystemReport = () => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-blue-600" />
          Sistema de Notificações
        </CardTitle>
        <CardDescription>
          Relatório completo sobre o sistema atual de notificações da plataforma
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="structure">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="structure" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              <span className="hidden sm:inline">Estrutura</span>
            </TabsTrigger>
            <TabsTrigger value="channels" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">Canais</span>
            </TabsTrigger>
            <TabsTrigger value="templates" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              <span className="hidden sm:inline">Templates</span>
            </TabsTrigger>
            <TabsTrigger value="access" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Acesso</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="structure" className="space-y-4">
            <div className="rounded-lg border p-4 bg-gray-50">
              <h3 className="text-lg font-medium mb-3">Tabelas de Banco de Dados</h3>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tabela</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Uso</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">notificacoes</TableCell>
                    <TableCell>Armazena as notificações enviadas</TableCell>
                    <TableCell>Canal, usuário, status, data</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">tipos_notificacao</TableCell>
                    <TableCell>Define os tipos de notificação disponíveis</TableCell>
                    <TableCell>Nome, descrição, template</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">canais_notificacao</TableCell>
                    <TableCell>Canais disponíveis para envio</TableCell>
                    <TableCell>App, Email, WhatsApp</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">usuarios_configuracoes</TableCell>
                    <TableCell>Preferências para cada usuário</TableCell>
                    <TableCell>Ativa/inativa por canal</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
            
            <div className="rounded-lg border p-4 bg-gray-50">
              <h3 className="text-lg font-medium mb-3">Fluxo de Notificações</h3>
              <p className="mb-2 text-gray-700">O sistema segue estas etapas para envio:</p>
              <ol className="list-decimal pl-5 space-y-2">
                <li>Evento aciona criação da notificação na tabela <strong>notificacoes</strong></li>
                <li>Serviço de notificações verifica a tabela periodicamente</li>
                <li>Para cada notificação pendente, verifica preferências do usuário</li>
                <li>Envia para os canais ativos para o usuário e tipo</li>
                <li>Atualiza status na tabela (enviada, falha, visualizada)</li>
              </ol>
            </div>
          </TabsContent>
          
          <TabsContent value="channels" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center">
                    <Bell className="h-4 w-4 mr-2 text-blue-600" />
                    App
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>Formato: Toast e notificação persistente no painel</li>
                    <li>Tempo de exibição: Até leitura pelo usuário</li>
                    <li>Ações disponíveis: Marcar como lida, Excluir, Navegar</li>
                    <li>Status atual: <span className="text-green-600 font-medium">Ativo</span></li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center">
                    <Mail className="h-4 w-4 mr-2 text-blue-600" />
                    Email
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>Formato: HTML com links para ações</li>
                    <li>Periodicidade: Imediata ou resumo diário/semanal</li>
                    <li>Templates: Email personalizado com logotipo</li>
                    <li>Status atual: <span className="text-amber-600 font-medium">Parcial</span></li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center">
                    <Phone className="h-4 w-4 mr-2 text-blue-600" />
                    WhatsApp
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>Formato: Texto com link para a plataforma</li>
                    <li>Periodicidade: Apenas notificações urgentes</li>
                    <li>API: Serviço de terceiros</li>
                    <li>Status atual: <span className="text-red-600 font-medium">Em desenvolvimento</span></li>
                  </ul>
                </CardContent>
              </Card>
            </div>
            
            <div className="rounded-lg border p-4 bg-gray-50">
              <h3 className="text-lg font-medium mb-3">Configurações por Canal</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Canal</TableHead>
                    <TableHead>Frequência</TableHead>
                    <TableHead>Padrão</TableHead>
                    <TableHead>Personalizável</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">App</TableCell>
                    <TableCell>Tempo real</TableCell>
                    <TableCell>Ativado</TableCell>
                    <TableCell>Sim, por tipo</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Email</TableCell>
                    <TableCell>Imediato ou Diário</TableCell>
                    <TableCell>Diário</TableCell>
                    <TableCell>Sim, frequência e tipos</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">WhatsApp</TableCell>
                    <TableCell>Apenas urgentes</TableCell>
                    <TableCell>Desativado</TableCell>
                    <TableCell>Sim, total ou parcial</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </TabsContent>
          
          <TabsContent value="templates" className="space-y-4">
            <div className="rounded-lg border p-4 bg-gray-50">
              <h3 className="text-lg font-medium mb-3">Templates Padrão</h3>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Título</TableHead>
                    <TableHead>Mensagem</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Nova Demanda</TableCell>
                    <TableCell>Nova demanda recebida</TableCell>
                    <TableCell>Você recebeu uma nova demanda: {"{titulo_demanda}"}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Aprovação</TableCell>
                    <TableCell>Nota aprovada</TableCell>
                    <TableCell>Sua nota "{"{titulo_nota}"}" foi aprovada</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Rejeição</TableCell>
                    <TableCell>Nota precisa de ajustes</TableCell>
                    <TableCell>Sua nota "{"{titulo_nota}"}" precisa de ajustes: {"{comentario}"}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Prazo</TableCell>
                    <TableCell>Prazo se aproximando</TableCell>
                    <TableCell>A demanda "{"{titulo_demanda}"}" vence em {"{dias}"} dias</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Comentário</TableCell>
                    <TableCell>Novo comentário</TableCell>
                    <TableCell>{"{autor}"} comentou em "{"{titulo_item}"}"</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-lg border p-4 bg-gray-50">
                <h3 className="text-lg font-medium mb-3">Variáveis Disponíveis</h3>
                <ul className="space-y-2 text-sm">
                  <li><strong>{"{titulo_demanda}"}</strong>: Título da demanda</li>
                  <li><strong>{"{titulo_nota}"}</strong>: Título da nota</li>
                  <li><strong>{"{autor}"}</strong>: Nome do usuário que executou a ação</li>
                  <li><strong>{"{dias}"}</strong>: Dias restantes para o prazo</li>
                  <li><strong>{"{prazo}"}</strong>: Data do prazo formatada</li>
                  <li><strong>{"{comentario}"}</strong>: Texto do comentário</li>
                  <li><strong>{"{link}"}</strong>: Link para acessar o item</li>
                </ul>
              </div>
              
              <div className="rounded-lg border p-4 bg-blue-50 border-blue-100">
                <h3 className="text-lg font-medium mb-3 flex items-center">
                  <AlertCircle className="h-5 w-5 mr-2 text-blue-600" />
                  Personalização
                </h3>
                <p className="mb-3 text-sm text-blue-700">
                  Os templates de mensagem podem ser personalizados por:
                </p>
                <ul className="space-y-2 text-sm text-blue-700">
                  <li><strong>Canal:</strong> Templates específicos por canal de entrega</li>
                  <li><strong>Coordenação:</strong> Textos específicos para cada coordenação</li>
                  <li><strong>Prioridade:</strong> Formatação diferente por nível de prioridade</li>
                  <li><strong>Idioma:</strong> Suporte a múltiplos idiomas (em desenvolvimento)</li>
                </ul>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="access" className="space-y-4">
            <div className="rounded-lg border p-4 bg-gray-50">
              <h3 className="text-lg font-medium mb-3">Controle de Acesso</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Perfil</TableHead>
                    <TableHead>App</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>WhatsApp</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Administrador</TableCell>
                    <TableCell>Todos os tipos</TableCell>
                    <TableCell>Resumos + Urgentes</TableCell>
                    <TableCell>Urgentes</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Coordenador</TableCell>
                    <TableCell>Da coordenação</TableCell>
                    <TableCell>Resumos + Urgentes</TableCell>
                    <TableCell>Urgentes</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Redator</TableCell>
                    <TableCell>Atribuídos</TableCell>
                    <TableCell>Atribuídos</TableCell>
                    <TableCell>Não recebe</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Visualizador</TableCell>
                    <TableCell>Resumos</TableCell>
                    <TableCell>Não recebe</TableCell>
                    <TableCell>Não recebe</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-lg border p-4 bg-gray-50">
                <h3 className="text-lg font-medium mb-3">Configurações de Usuário</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Usuários podem personalizar suas preferências de notificação através da página
                  "Ajustes de Notificação" acessível pelo menu de perfil. As opções incluem:
                </p>
                <ul className="space-y-1 text-sm">
                  <li>• Desativar/ativar canais específicos</li>
                  <li>• Definir frequência de resumos (diário, semanal)</li>
                  <li>• Escolher quais tipos de notificação receber</li>
                  <li>• Ativar/desativar notificações por coordenação</li>
                  <li>• Definir horários para não receber notificações</li>
                </ul>
              </div>
              
              <div className="rounded-lg border p-4 bg-blue-50 border-blue-100">
                <h3 className="text-lg font-medium mb-3">Estatísticas de Uso</h3>
                <ul className="space-y-2 text-sm">
                  <li><strong>97%</strong> dos usuários recebem notificações no app</li>
                  <li><strong>68%</strong> optaram por receber emails diários</li>
                  <li><strong>12%</strong> cadastraram WhatsApp para urgências</li>
                  <li><strong>85%</strong> das notificações são visualizadas em até 1 hora</li>
                  <li><strong>23%</strong> das ações são tomadas diretamente das notificações</li>
                  <li>Tempo médio para resposta: <strong>2h12min</strong></li>
                </ul>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default NotificationSystemReport;
