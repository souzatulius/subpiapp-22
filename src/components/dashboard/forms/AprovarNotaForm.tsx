
import React from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { NotaOficial } from '@/types/nota';

interface AprovarNotaFormProps {
  nota: NotaOficial;
  onApprove: () => void;
  onReject: () => void;
  loading: boolean;
  formatDate: (dateStr: string) => string;
}

const AprovarNotaForm: React.FC<AprovarNotaFormProps> = ({
  nota,
  onApprove,
  onReject,
  loading,
  formatDate
}) => {
  if (!nota) {
    return <div>Nota não encontrada</div>;
  }

  const formatNotaHistory = () => {
    if (!nota.historico_edicoes || nota.historico_edicoes.length === 0) {
      return <p className="text-gray-500 mt-2">Sem histórico de edições</p>;
    }

    return (
      <div className="space-y-3 mt-3">
        {nota.historico_edicoes.map((edit) => (
          <div key={edit.id} className="bg-gray-50 p-3 rounded-md text-sm">
            <p className="text-gray-700">
              <span className="font-semibold">
                {edit.editor?.nome_completo || 'Editor desconhecido'}
              </span>
              <span className="text-gray-500 mx-1">editou em</span>
              <span className="text-gray-600">
                {formatDate(edit.criado_em)}
              </span>
            </p>
            
            {edit.titulo_anterior !== edit.titulo_novo && (
              <div className="mt-2">
                <p className="text-gray-600 font-medium">Título alterado:</p>
                <p className="text-red-600 line-through">{edit.titulo_anterior}</p>
                <p className="text-green-600">{edit.titulo_novo}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold">{nota.titulo}</h2>
        <div className="flex items-center text-sm text-gray-500 mt-1">
          <span>Por {nota.autor?.nome_completo || 'Autor desconhecido'}</span>
          <span className="mx-2">•</span>
          <span>{formatDate(nota.criado_em)}</span>
        </div>
        {nota.aprovador && (
          <div className="text-sm text-gray-500 mt-1">
            Aprovado por {nota.aprovador?.nome_completo || 'Aprovador desconhecido'} em {formatDate(nota.atualizado_em)}
          </div>
        )}
      </div>
      
      <Separator />
      
      <div>
        <div className="font-medium mb-2">Conteúdo da Nota</div>
        <div className="bg-gray-50 p-4 rounded-md whitespace-pre-line">
          {nota.texto}
        </div>
      </div>
      
      {nota.historico_edicoes && nota.historico_edicoes.length > 0 && (
        <div>
          <div className="font-medium mb-1">Histórico de Edições</div>
          {formatNotaHistory()}
        </div>
      )}
      
      {nota.status === 'pendente' && (
        <div className="flex justify-end space-x-3 mt-4">
          <Button 
            variant="outline" 
            onClick={onReject}
            disabled={loading}
          >
            Rejeitar
          </Button>
          <Button 
            onClick={onApprove}
            disabled={loading}
          >
            Aprovar
          </Button>
        </div>
      )}
    </div>
  );
};

export default AprovarNotaForm;
