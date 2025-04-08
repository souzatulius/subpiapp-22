import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Edit, Trash2, Plus } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ESICJustificativa, ESICProcesso, situacaoLabels, statusLabels } from '@/types/esic';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface ProcessoViewProps {
  processo: ESICProcesso;
  justificativas: ESICJustificativa[];
  isJustificativasLoading: boolean;
  onEdit: (processo: ESICProcesso) => void;
  onAddJustificativa: () => void;
  onBack: () => void;
  onUpdateStatus: (status: 'novo_processo' | 'aguardando_justificativa' | 'aguardando_aprovacao' | 'concluido') => void;
  onUpdateSituacao: (situacao: 'em_tramitacao' | 'prazo_prorrogado' | 'concluido') => void;
  onDelete?: (id: string) => void;
}

const ProcessoView: React.FC<ProcessoViewProps> = ({
  processo,
  justificativas,
  isJustificativasLoading,
  onEdit,
  onAddJustificativa,
  onBack,
  onUpdateStatus,
  onUpdateSituacao,
  onDelete
}) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Button variant="ghost" size="sm" onClick={onBack} className="mr-2">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Voltar
          </Button>
          <h2 className="text-2xl font-semibold">Detalhes do Processo</h2>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={() => onEdit(processo)}>
            <Edit className="h-4 w-4 mr-1" />
            Editar
          </Button>
          {onDelete && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-red-600 hover:bg-red-50"
              onClick={() => onDelete(processo.id)}
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Excluir
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Informações do Processo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm text-gray-500">Data do Processo</Label>
              <p>
                {processo.data_processo 
                  ? format(new Date(processo.data_processo), 'PPP', { locale: ptBR })
                  : 'Não definida'}
              </p>
            </div>
            
            {processo.solicitante && (
              <div>
                <Label className="text-sm text-gray-500">Solicitante</Label>
                <p>{processo.solicitante}</p>
              </div>
            )}
            
            <div>
              <Label className="text-sm text-gray-500">Status</Label>
              <div className="flex items-center space-x-2">
                <Select
                  value={processo.status}
                  onValueChange={(value) => onUpdateStatus(value as any)}
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Selecione um status" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(statusLabels).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <Label className="text-sm text-gray-500">Situação</Label>
              <div className="flex items-center space-x-2">
                <Select
                  value={processo.situacao}
                  onValueChange={(value) => onUpdateSituacao(value as any)}
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Selecione uma situação" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(situacaoLabels).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Texto do Processo</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap text-gray-700">{processo.texto}</p>
          </CardContent>
        </Card>
      </div>
      
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold">Justificativas</h3>
          <Button 
            onClick={onAddJustificativa} 
            variant="outline" 
            size="sm" 
            disabled={processo.status === 'concluido'}
          >
            <Plus className="h-4 w-4 mr-1" />
            Adicionar Justificativa
          </Button>
        </div>
        
        <Separator className="mb-4" />
        
        {isJustificativasLoading ? (
          <div className="py-8 text-center">
            <p className="text-gray-500">Carregando justificativas...</p>
          </div>
        ) : justificativas.length === 0 ? (
          <div className="py-8 text-center bg-gray-50 rounded-lg">
            <p className="text-gray-500">Este processo ainda não possui justificativas.</p>
            {processo.status !== 'concluido' && (
              <Button 
                onClick={onAddJustificativa} 
                variant="outline" 
                className="mt-4"
              >
                <Plus className="h-4 w-4 mr-1" />
                Adicionar Justificativa
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {justificativas.map((justificativa) => (
              <Card key={justificativa.id}>
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <p className="text-sm text-gray-500">
                        Criado em {format(new Date(justificativa.criado_em), 'dd/MM/yyyy')}
                        {justificativa.autor?.nome_completo && ` por ${justificativa.autor.nome_completo}`}
                      </p>
                    </div>
                    {justificativa.gerado_por_ia && (
                      <Badge variant="outline" className="bg-purple-50 text-purple-600">
                        Gerado por IA
                      </Badge>
                    )}
                  </div>
                  <p className="whitespace-pre-wrap text-gray-700 mt-2">{justificativa.texto}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProcessoView;
