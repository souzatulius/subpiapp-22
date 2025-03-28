
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ValidationError, getErrorSummary } from '@/lib/formValidationUtils';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Paperclip, FileText } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';

interface ReviewStepProps {
  formData: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  problemas: any[];
  origens: any[];
  tiposMidia: any[];
  filteredBairros: any[];
  distritos?: any[]; // Added districts
  servicos?: any[];
  errors: ValidationError[];
  showValidationErrors?: boolean;
  onNavigateToStep?: (step: number) => void; // Added to navigate to specific steps
}

const ReviewStep: React.FC<ReviewStepProps> = ({
  formData,
  handleChange,
  problemas,
  origens,
  tiposMidia,
  filteredBairros,
  distritos = [],
  servicos = [],
  errors,
  showValidationErrors = false,
  onNavigateToStep
}) => {
  const selectedProblema = problemas.find(p => p.id === formData.problema_id);
  const selectedOrigem = origens.find(o => o.id === formData.origem_id);
  const selectedTipoMidia = tiposMidia.find(t => t.id === formData.tipo_midia_id);
  const selectedBairro = filteredBairros.find(b => b.id === formData.bairro_id);
  const selectedServico = servicos.find(s => s.id === formData.servico_id);
  const selectedDistrito = distritos.find(d => d.id === 
    filteredBairros.find(b => b.id === formData.bairro_id)?.distrito_id
  );

  // Field to step mapping for navigation
  const fieldToStepMap: Record<string, number> = {
    'origem_id': 0,
    'prazo_resposta': 0,
    'prioridade': 0,
    'tem_protocolo_156': 0,
    'numero_protocolo_156': 0,
    'tipo_midia_id': 1,
    'veiculo_imprensa': 1,
    'nome_solicitante': 1,
    'telefone_solicitante': 1,
    'email_solicitante': 1,
    'problema_id': 2,
    'servico_id': 2,
    'detalhes_solicitacao': 2,
    'bairro_id': 2,
    'endereco': 2,
    'titulo': 3,
    'perguntas': 3,
    'anexos': 3
  };

  const handleFieldClick = (field: string) => {
    if (onNavigateToStep && fieldToStepMap[field] !== undefined) {
      onNavigateToStep(fieldToStepMap[field]);
    }
  };

  const ReviewSection = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <div className="mb-4">
      <h3 className="text-md font-medium mb-2">{title}</h3>
      <Card>
        <CardContent className="p-4">
          {children}
        </CardContent>
      </Card>
    </div>
  );

  const ReviewItem = ({ label, value, error, field }: { label: string, value: string | undefined, error?: boolean, field?: string }) => (
    <div className="py-1">
      <span className={`text-sm font-medium ${error ? 'text-orange-500' : 'text-gray-500'}`}>{label}: </span>
      {value ? (
        <span className="text-sm">{value}</span>
      ) : (
        <span className="text-sm text-gray-400 italic">Não informado</span>
      )}
      {error && field && (
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => handleFieldClick(field)}
          className="ml-2 h-6 px-2 py-0 text-xs bg-orange-50 text-orange-800 border-orange-200 hover:bg-orange-100"
        >
          Preencher
        </Button>
      )}
    </div>
  );

  // Função para obter a extensão do arquivo a partir do nome ou URL
  const getFileExtension = (filename: string) => {
    if (!filename) return '';
    return filename.split('.').pop()?.toLowerCase() || '';
  };

  // Função para verificar se o arquivo é uma imagem
  const isImageFile = (url: string) => {
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'heic'];
    const ext = getFileExtension(url);
    return imageExtensions.includes(ext);
  };

  // Função para extrair o nome do arquivo da URL
  const getFileNameFromUrl = (url: string) => {
    if (!url) return '';
    return url.split('/').pop() || url;
  };

  // Função para obter nome curto do arquivo
  const getShortenedFileName = (url: string) => {
    const fileName = url.split('/').pop() || '';
    const fileExt = fileName.split('.').pop() || '';
    
    if (fileName.length <= 12) return fileName;
    
    return `${fileName.substring(0, 8)}...${fileExt ? `.${fileExt}` : ''}`;
  };

  return (
    <div className="space-y-4">
      {showValidationErrors && errors.length > 0 && (
        <Alert variant="destructive" className="mb-4 bg-orange-50 border-orange-200 text-orange-800">
          <AlertTriangle className="h-4 w-4 text-orange-500" />
          <AlertTitle>Campos obrigatórios não preenchidos</AlertTitle>
          <AlertDescription>
            {getErrorSummary(errors)}
          </AlertDescription>
        </Alert>
      )}

      <ReviewSection title="Origem e Protocolo">
        <ReviewItem 
          label="Origem da Demanda" 
          value={selectedOrigem?.descricao}
          error={errors.some(e => e.field === 'origem_id')}
          field="origem_id"
        />
        {formData.tem_protocolo_156 && (
          <ReviewItem 
            label="Protocolo 156" 
            value={formData.numero_protocolo_156}
            error={errors.some(e => e.field === 'numero_protocolo_156')}
            field="numero_protocolo_156"
          />
        )}
        {selectedTipoMidia && (
          <ReviewItem 
            label="Tipo de Mídia" 
            value={selectedTipoMidia.descricao}
            error={errors.some(e => e.field === 'tipo_midia_id')}
            field="tipo_midia_id"
          />
        )}
        {formData.veiculo_imprensa && (
          <ReviewItem 
            label="Veículo de Imprensa" 
            value={formData.veiculo_imprensa}
            error={errors.some(e => e.field === 'veiculo_imprensa')}
            field="veiculo_imprensa"
          />
        )}
        <ReviewItem 
          label="Prioridade" 
          value={formData.prioridade ? formData.prioridade.charAt(0).toUpperCase() + formData.prioridade.slice(1) : undefined}
          error={errors.some(e => e.field === 'prioridade')}
          field="prioridade"
        />
        <ReviewItem 
          label="Prazo para Resposta" 
          value={formData.prazo_resposta ? new Date(formData.prazo_resposta).toLocaleString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          }) : undefined}
          error={errors.some(e => e.field === 'prazo_resposta')}
          field="prazo_resposta"
        />
      </ReviewSection>

      <ReviewSection title="Problema e Serviço">
        <ReviewItem 
          label="Tema/Problema" 
          value={selectedProblema?.descricao}
          error={errors.some(e => e.field === 'problema_id')}
          field="problema_id"
        />
        {!formData.nao_sabe_servico && (
          <ReviewItem 
            label="Serviço" 
            value={selectedServico?.descricao}
            error={errors.some(e => e.field === 'servico_id')}
            field="servico_id"
          />
        )}
        <div className="mt-2">
          <span className="text-sm font-medium text-gray-500">Detalhes da Solicitação: </span>
          <div className="text-sm mt-1 p-2 bg-gray-50 rounded-md relative">
            {formData.detalhes_solicitacao ? 
              formData.detalhes_solicitacao : 
              <span className="text-gray-400 italic">Não informado</span>
            }
            {errors.some(e => e.field === 'detalhes_solicitacao') && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => handleFieldClick('detalhes_solicitacao')}
                className="absolute top-1 right-1 h-6 px-2 py-0 text-xs bg-orange-50 text-orange-800 border-orange-200 hover:bg-orange-100"
              >
                Preencher
              </Button>
            )}
          </div>
        </div>
      </ReviewSection>

      <ReviewSection title="Dados do Solicitante">
        <ReviewItem 
          label="Nome" 
          value={formData.nome_solicitante}
          error={errors.some(e => e.field === 'nome_solicitante')}
          field="nome_solicitante"
        />
        <ReviewItem 
          label="Telefone" 
          value={formData.telefone_solicitante}
          error={errors.some(e => e.field === 'telefone_solicitante')}
          field="telefone_solicitante"
        />
        <ReviewItem 
          label="E-mail" 
          value={formData.email_solicitante}
          error={errors.some(e => e.field === 'email_solicitante')}
          field="email_solicitante"
        />
      </ReviewSection>

      <ReviewSection title="Localização">
        <ReviewItem 
          label="Distrito" 
          value={selectedDistrito?.nome}
        />
        <ReviewItem 
          label="Bairro" 
          value={selectedBairro?.nome}
          error={errors.some(e => e.field === 'bairro_id')}
          field="bairro_id"
        />
        <ReviewItem 
          label="Endereço" 
          value={formData.endereco}
          error={errors.some(e => e.field === 'endereco')}
          field="endereco"
        />
      </ReviewSection>

      <ReviewSection title="Perguntas e Anexos">
        <ReviewItem 
          label="Título" 
          value={formData.titulo}
          error={errors.some(e => e.field === 'titulo')}
          field="titulo"
        />

        <Separator className="my-2" />

        <span className="text-sm font-medium text-gray-500">Perguntas para a Área Técnica:</span>
        <div className="mt-1 space-y-1">
          {formData.perguntas.filter((p: string) => p.trim() !== '').length > 0 ? (
            formData.perguntas.map((pergunta: string, index: number) => (
              pergunta.trim() !== '' && (
                <div key={index} className="p-2 bg-gray-50 rounded-md text-sm">
                  {index + 1}. {pergunta}
                </div>
              )
            ))
          ) : (
            <p className="text-sm text-gray-400 italic">Nenhuma pergunta adicionada</p>
          )}
        </div>

        <Separator className="my-2" />

        <span className="text-sm font-medium text-gray-500">Anexos:</span>
        <div className="mt-1">
          {formData.anexos && formData.anexos.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {formData.anexos.map((anexo: string, index: number) => {
                const fileName = getFileNameFromUrl(anexo);
                return (
                  <div key={index} className="p-2 bg-gray-50 rounded-md">
                    {isImageFile(anexo) ? (
                      <div className="space-y-1">
                        <div className="relative h-24 w-full overflow-hidden rounded border border-gray-200">
                          <img 
                            src={anexo} 
                            alt={fileName} 
                            className="h-full w-full object-contain"
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = '/placeholder.svg';
                            }}
                          />
                        </div>
                        <p className="text-xs truncate text-gray-600">{getShortenedFileName(anexo)}</p>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <FileText className="h-5 w-5 text-gray-400" />
                        <span className="text-sm truncate">{getShortenedFileName(fileName)}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-gray-400 italic">Nenhum anexo adicionado</p>
          )}
        </div>
      </ReviewSection>
    </div>
  );
};

export default ReviewStep;
