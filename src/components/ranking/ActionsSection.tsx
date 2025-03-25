
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Printer, Share2 } from 'lucide-react';

const ActionsSection = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Ações</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Download size={16} />
            <span>Exportar Dados</span>
          </Button>
          
          <Button variant="outline" className="flex items-center gap-2">
            <Printer size={16} />
            <span>Imprimir Relatório</span>
          </Button>
          
          <Button variant="outline" className="flex items-center gap-2">
            <Share2 size={16} />
            <span>Compartilhar</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ActionsSection;
