
import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Info } from 'lucide-react';

interface CommentsSectionProps {
  comentarios: string;
  onChange: (value: string) => void;
}

const CommentsSection: React.FC<CommentsSectionProps> = ({ comentarios, onChange }) => {
  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center gap-2 mb-2">
        <h3 className="text-lg font-semibold text-blue-700">Comentários Internos</h3>
      </div>
      
      <Card className="bg-blue-50/50 border border-blue-100 shadow-sm hover:shadow transition-all duration-300">
        <CardContent className="p-4">
          <div className="flex items-start gap-3 text-sm text-blue-600 mb-3">
            <Info className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <p>
              Estes comentários são apenas para uso interno e <span className="font-semibold">não serão enviados ao solicitante</span>.
              Utilize este espaço para registrar observações, esclarecimentos ou contexto adicional sobre esta demanda.
            </p>
          </div>
        </CardContent>
      </Card>
      
      <Textarea 
        id="comentarios"
        placeholder="Adicione comentários internos sobre esta demanda"
        className="min-h-[180px] w-full transition-all duration-300 focus:border-subpi-blue"
        value={comentarios}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

export default CommentsSection;
