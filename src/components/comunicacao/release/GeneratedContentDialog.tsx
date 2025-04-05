
import React from 'react';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';

interface NotaGerada {
  titulo: string;
  conteudo: string;
}

interface GeneratedContentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  generatedContent: NotaGerada | null;
  editedTitle: string;
  editedContent: string;
  onEditedTitleChange: (title: string) => void;
  onEditedContentChange: (content: string) => void;
  onCreateNote: () => void;
}

const GeneratedContentDialog: React.FC<GeneratedContentDialogProps> = ({
  open,
  onOpenChange,
  generatedContent,
  editedTitle,
  editedContent,
  onEditedTitleChange,
  onEditedContentChange,
  onCreateNote
}) => {
  if (!generatedContent) return null;
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Notícia Gerada</DialogTitle>
          <DialogDescription>
            Conteúdo gerado com base no release fornecido. Você pode editar o texto antes de salvar.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 my-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-lg">Título</h3>
              <Badge variant="warning">Edite conforme necessário</Badge>
            </div>
            <Textarea 
              value={editedTitle}
              onChange={(e) => onEditedTitleChange(e.target.value)}
              className="p-3 bg-gray-50 rounded-md"
            />
          </div>
          
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-lg">Conteúdo</h3>
              <Badge variant="warning">Edite conforme necessário</Badge>
            </div>
            <Textarea 
              value={editedContent}
              onChange={(e) => onEditedContentChange(e.target.value)}
              className="p-3 bg-gray-50 rounded-md min-h-[300px]"
            />
          </div>
        </div>
        
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Fechar
          </Button>
          <Button variant="action" onClick={onCreateNote}>
            Criar Nota Oficial
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default GeneratedContentDialog;
