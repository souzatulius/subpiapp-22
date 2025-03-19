
import React from 'react';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';
import { Trash } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface AnnouncementCardProps {
  announcement: any;
  onDelete: (announcement: any) => void;
}

const AnnouncementCard: React.FC<AnnouncementCardProps> = ({
  announcement,
  onDelete,
}) => {
  return (
    <Card key={announcement.id} className="overflow-hidden">
      <CardHeader className="bg-gray-50">
        <CardTitle className="flex justify-between items-start">
          <span className="flex-1">{announcement.titulo}</span>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => onDelete(announcement)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        </CardTitle>
        <CardDescription>
          Para: {announcement.destinatarios}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        <p className="whitespace-pre-line">{announcement.mensagem}</p>
      </CardContent>
      <CardFooter className="flex justify-between text-sm text-gray-500 border-t bg-gray-50">
        <span>
          Por: {announcement.autor?.nome_completo || 'Usuário desconhecido'}
        </span>
        <span>
          {format(new Date(announcement.data_envio), 'dd/MM/yyyy HH:mm', { locale: pt })}
        </span>
      </CardFooter>
    </Card>
  );
};

export default AnnouncementCard;
