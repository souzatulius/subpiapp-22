
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Save, Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

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
  onEditedTitleChange: (value: string) => void;
  onEditedContentChange: (value: string) => void;
  onCreateNote: () => void;
  isLoading?: boolean;
}

const GeneratedContentDialog: React.FC<GeneratedContentDialogProps> = ({
  open,
  onOpenChange,
  generatedContent,
  editedTitle,
  editedContent,
  onEditedTitleChange,
  onEditedContentChange,
  onCreateNote,
  isLoading = false
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-lg">Notícia Gerada com IA</DialogTitle>
        </DialogHeader>
        
        {isLoading ? (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full" />
            </div>
            
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-32 w-full" />
            </div>
            
            <div className="flex items-center justify-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
              <span className="ml-2 text-blue-500 font-medium">Gerando notícia...</span>
            </div>
          </div>
        ) : (
          <>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título da Notícia</Label>
                <Input
                  id="title"
                  value={editedTitle}
                  onChange={(e) => onEditedTitleChange(e.target.value)}
                  className="w-full"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="content">Conteúdo da Notícia</Label>
                <Textarea
                  id="content"
                  value={editedContent}
                  onChange={(e) => onEditedContentChange(e.target.value)}
                  className="min-h-[300px]"
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button onClick={onCreateNote} disabled={!editedTitle || !editedContent}>
                <Save className="h-4 w-4 mr-2" />
                Salvar Notícia
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default GeneratedContentDialog;
