
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, X, Edit } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { NotaOficial } from '@/types/nota';
import { Badge } from '@/components/ui/badge';

export interface NotaDetailProps {
  nota: NotaOficial;
  onBack: () => void;
  onAprovar: () => Promise<void>;
  onRejeitar: () => Promise<void>;
  onEditar: () => void;
  isSubmitting: boolean;
}

const NotaDetail: React.FC<NotaDetailProps> = ({
  nota,
  onBack,
  onAprovar,
  onRejeitar,
  onEditar,
  isSubmitting
}) => {
  // Format the creation date
  const formattedDate = nota.criado_em
    ? format(new Date(nota.criado_em), "dd 'de' MMMM 'de' yyyy, HH:mm", { locale: ptBR })
    : 'Data não disponível';

  return (
    <Card className="shadow-sm mb-4 rounded-xl">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start mb-2">
          <Button 
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="px-2 py-1 h-auto"
          >
            ← Voltar
          </Button>
          
          <Badge variant={
            nota.status === 'pendente' ? 'outline' : 
            nota.status === 'aprovado' ? 'success' :
            nota.status === 'rejeitado' ? 'destructive' : 
            'default'
          }>
            {nota.status === 'pendente' ? 'Pendente' : 
             nota.status === 'aprovado' ? 'Aprovada' :
             nota.status === 'rejeitado' ? 'Rejeitada' : 
             nota.status}
          </Badge>
        </div>
        
        <CardTitle>{nota.titulo}</CardTitle>
        <CardDescription>
          <span>Criado em {formattedDate}</span>
          {nota.autor && (
            <span> por {nota.autor.nome_completo}</span>
          )}
          {nota.problema && nota.problema.coordenacao && (
            <div className="mt-1">
              Coordenação: {nota.problema.coordenacao.descricao}
            </div>
          )}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="whitespace-pre-wrap text-justify bg-slate-50 p-4 rounded-md border">
          {nota.texto}
        </div>
      </CardContent>
      
      <CardFooter>
        <div className="flex flex-wrap gap-2 w-full justify-end">
          <Button 
            variant="outline"
            onClick={onEditar}
            disabled={isSubmitting}
          >
            <Edit className="h-4 w-4 mr-2" />
            Editar
          </Button>
          
          <Button 
            variant="destructive"
            onClick={onRejeitar}
            disabled={isSubmitting || nota.status !== 'pendente'}
          >
            <X className="h-4 w-4 mr-2" />
            Rejeitar
          </Button>
          
          <Button 
            variant="default"
            onClick={onAprovar}
            disabled={isSubmitting || nota.status !== 'pendente'}
          >
            <Check className="h-4 w-4 mr-2" />
            Aprovar
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default NotaDetail;
