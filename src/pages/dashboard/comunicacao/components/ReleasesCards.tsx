import React, { useState } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, Trash2, ArrowRightSquare } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface Release {
  id: string;
  tipo: 'release' | 'noticia';
  conteudo: string;
  release_origem_id?: string | null;
  criado_em: string;
  autor_id: string;
}

interface ReleasesCardsProps {
  releases: Release[];
  formatDate: (dateString: string) => string;
  onDelete: (id: string, tipo: 'release' | 'noticia') => Promise<void>;
  navigateToCreateNews: (releaseId: string) => void;
  navigateToViewNews: (newsId: string) => void;
}

const ReleasesCards: React.FC<ReleasesCardsProps> = ({
  releases,
  formatDate,
  onDelete,
  navigateToCreateNews,
  navigateToViewNews
}) => {
  const [selectedRelease, setSelectedRelease] = useState<Release | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleView = (release: Release) => {
    setSelectedRelease(release);
    setIsViewDialogOpen(true);
  };

  const handleDelete = (release: Release) => {
    setSelectedRelease(release);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedRelease) return;
    
    setIsLoading(true);
    try {
      await onDelete(selectedRelease.id, 'release');
      setIsDeleteDialogOpen(false);
    } finally {
      setIsLoading(false);
      setSelectedRelease(null);
    }
  };

  const getPreviewContent = (content: string) => {
    // Return first 150 characters
    return content.length > 150 
      ? content.substring(0, 150) + '...' 
      : content;
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {releases.map((release) => (
          <Card key={release.id} className="flex flex-col hover:shadow-md transition-shadow">
            <CardContent className="flex-grow p-4">
              <div className="text-sm text-gray-500 mb-3">
                {formatDate(release.criado_em)}
              </div>
              <div className="text-sm text-gray-700 line-clamp-4">
                {getPreviewContent(release.conteudo)}
              </div>
            </CardContent>
            <CardFooter className="p-3 pt-0 flex justify-between">
              <div className="flex space-x-2">
                <Button variant="ghost" size="sm" onClick={() => handleView(release)}>
                  <Eye className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="text-red-500" onClick={() => handleDelete(release)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <Button variant="outline" size="sm" onClick={() => navigateToCreateNews(release.id)}>
                <ArrowRightSquare className="h-4 w-4 mr-2" />
                Gerar Notícia
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* View Dialog */}
      {selectedRelease && (
        <AlertDialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <AlertDialogContent className="max-w-3xl">
            <AlertDialogHeader>
              <AlertDialogTitle>
                Release
              </AlertDialogTitle>
              <div className="text-sm text-gray-500 mb-2">
                Recebido em: {selectedRelease.criado_em ? formatDate(selectedRelease.criado_em) : '-'}
              </div>
            </AlertDialogHeader>
            <ScrollArea className="max-h-[60vh]">
              <div className="p-2 whitespace-pre-wrap">
                {selectedRelease.conteudo}
              </div>
            </ScrollArea>
            <AlertDialogFooter>
              <AlertDialogCancel>Fechar</AlertDialogCancel>
              <Button onClick={() => {
                setIsViewDialogOpen(false);
                navigateToCreateNews(selectedRelease.id);
              }}>
                <ArrowRightSquare className="h-4 w-4 mr-2" />
                Gerar Notícia
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}

      {/* Delete Confirmation Dialog */}
      {selectedRelease && (
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja excluir este release? Esta ação não pode ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isLoading}>Cancelar</AlertDialogCancel>
              <Button 
                onClick={confirmDelete} 
                disabled={isLoading}
                className="bg-red-500 hover:bg-red-600"
              >
                {isLoading ? "Excluindo..." : "Excluir"}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
};

export default ReleasesCards;
