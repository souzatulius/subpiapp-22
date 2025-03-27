
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ValidationError, getErrorSummary } from '@/lib/formValidationUtils';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Paperclip, FileText } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface ReviewStepProps {
  formData: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  problemas: any[];
  origens: any[];
  tiposMidia: any[];
  filteredBairros: any[];
  servicos?: any[];
  errors: ValidationError[];
  showValidationErrors?: boolean;
}

const ReviewStep: React.FC<ReviewStepProps> = ({
  formData,
  handleChange,
  problemas,
  origens,
  tiposMidia,
  filteredBairros,
  servicos = [],
  errors,
  showValidationErrors = false
}) => {
  const selectedProblema = problemas.find(p => p.id === formData.problema_id);
  const selectedOrigem = origens.find(o => o.id === formData.origem_id);
  const selectedTipoMidia = tiposMidia.find(t => t.id === formData.tipo_midia_id);
  const selectedBairro = filteredBairros.find(b => b.id === formData.bairro_id);
  const selectedServico = servicos.find(s => s.id === formData.servico_id);

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

  const ReviewItem = ({ label, value, error }: { label: string, value: string | undefined, error?: boolean }) => (
    <div className="py-1">
      <span className={`text-sm font-medium ${error ? 'text-orange-500' : 'text-gray-500'}`}>{label}: </span>
      {value ? (
        <span className="text-sm">{value}</span>
      ) : (
        <span className="text-sm text-gray-400 italic">Não informado</span>
      )}
      {error && <Badge variant="outline" className="ml-2 bg-orange-50 text-orange-800 border-orange-200">Obrigatório</Badge>}
    </div>
  );

  // Função para obter a extensão do arquivo a partir do nome ou URL
  const getFileExtension = (filename: string) => {
    if (!filename) return '';
    return filename.split('.').pop()?.toLowerCase() || '';
  };

  // Função para verificar se o arquivo é uma imagem
  const isImageFile = (filename: string) => {
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'];
    const ext = getFileExtension(filename);
    return imageExtensions.includes(ext);
  };

  // Função para extrair o nome do arquivo da URL
  const getFileNameFromUrl = (url: string) => {
    if (!url) return '';
    return url.split('/').pop() || url;
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
        />
        {formData.tem_protocolo_156 && (
          <ReviewItem 
            label="Protocolo 156" 
            value={formData.numero_protocolo_156}
            error={errors.some(e => e.field === 'numero_protocolo_156')}
          />
        )}
        {selectedTipoMidia && (
          <ReviewItem 
            label="Tipo de Mídia" 
            value={selectedTipoMidia.descricao}
          />
        )}
        {formData.veiculo_imprensa && (
          <ReviewItem 
            label="Veículo de Imprensa" 
            value={formData.veiculo_imprensa}
          />
        )}
        <ReviewItem 
          label="Prioridade" 
          value={formData.prioridade ? formData.prioridade.charAt(0).toUpperCase() + formData.prioridade.slice(1) : undefined}
          error={errors.some(e => e.field === 'prioridade')}
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
        />
      </ReviewSection>

      <ReviewSection title="Problema e Serviço">
        <ReviewItem 
          label="Tema/Problema" 
          value={selectedProblema?.descricao}
          error={errors.some(e => e.field === 'problema_id')}
        />
        {!formData.nao_sabe_servico && (
          <ReviewItem 
            label="Serviço" 
            value={selectedServico?.descricao}
          />
        )}
        <div className="mt-2">
          <span className="text-sm font-medium text-gray-500">Detalhes da Solicitação: </span>
          <p className="text-sm mt-1 p-2 bg-gray-50 rounded-md">
            {formData.detalhes_solicitacao || <span className="text-gray-400 italic">Não informado</span>}
          </p>
        </div>
      </ReviewSection>

      <ReviewSection title="Dados do Solicitante">
        <ReviewItem 
          label="Nome" 
          value={formData.nome_solicitante}
          error={errors.some(e => e.field === 'nome_solicitante')}
        />
        <ReviewItem 
          label="Telefone" 
          value={formData.telefone_solicitante}
        />
        <ReviewItem 
          label="E-mail" 
          value={formData.email_solicitante}
        />
      </ReviewSection>

      <ReviewSection title="Localização">
        <ReviewItem 
          label="Bairro" 
          value={selectedBairro?.nome}
          error={errors.some(e => e.field === 'bairro_id')}
        />
        <ReviewItem 
          label="Endereço" 
          value={formData.endereco}
        />
      </ReviewSection>

      <ReviewSection title="Perguntas e Anexos">
        <ReviewItem 
          label="Título" 
          value={formData.titulo}
          error={errors.some(e => e.field === 'titulo')}
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
          {formData.anexos.length > 0 ? (
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
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <p className="text-xs truncate text-gray-600">{fileName}</p>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <FileText className="h-5 w-5 text-gray-400" />
                        <span className="text-sm truncate">{fileName}</span>
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
