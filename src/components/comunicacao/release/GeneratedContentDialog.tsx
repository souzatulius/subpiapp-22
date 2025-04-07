
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Save, X } from 'lucide-react';

interface GeneratedContentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  generatedContent: {
    titulo: string;
    conteudo: string;
  } | null;
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
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div>
            <p className="text-sm font-medium mb-2">Título</p>
            <Input 
              value={editedTitle}
              onChange={(e) => onEditedTitleChange(e.target.value)}
              placeholder="Título da notícia"
            />
          </div>
          
          <div>
            <p className="text-sm font-medium mb-2">Conteúdo</p>
            <Textarea 
              value={editedContent}
              onChange={(e) => onEditedContentChange(e.target.value)}
              placeholder="Conteúdo da notícia"
              className="min-h-[300px]"
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            <X className="h-4 w-4 mr-2" />
            Cancelar
          </Button>
          <Button onClick={onCreateNote}>
            <Save className="h-4 w-4 mr-2" />
            Salvar Notícia
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default GeneratedContentDialog;
