import React from 'react';
import { Badge } from '@/components/ui/badge';

interface DemandaMetadataSectionProps {
  selectedDemanda: any;
}

const DemandaMetadataSection: React.FC<DemandaMetadataSectionProps> = ({
  selectedDemanda
}) => {
  if (!selectedDemanda) return null;

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap gap-2 items-center">
        {selectedDemanda.problema?.descricao && (
          <Badge className="rounded-full bg-gray-100 text-gray-800 border border-gray-300">
            {selectedDemanda.problema.descricao}
          </Badge>
        )}

        {selectedDemanda.prioridade && (
          <Badge className="rounded-full bg-orange-100 text-orange-800 border border-orange-300">
            {selectedDemanda.prioridade}
          </Badge>
        )}

        {selectedDemanda.status && (
          <Badge className="rounded-full bg-green-100 text-green-800 border border-green-300">
            {selectedDemanda.status}
          </Badge>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-muted-foreground">Endereço</p>
          <p>{selectedDemanda.endereco}</p>
        </div>

        {selectedDemanda.bairro?.descricao && (
          <div>
            <p className="text-muted-foreground">Bairro</p>
            <p>{selectedDemanda.bairro.descricao}</p>
          </div>
        )}

        {selectedDemanda.distrito?.descricao && (
          <div>
            <p className="text-muted-foreground">Distrito</p>
            <p>{selectedDemanda.distrito.descricao}</p>
          </div>
        )}

        {selectedDemanda.protocolo && (
          <div>
            <p className="text-muted-foreground">Protocolo</p>
            <p>{selectedDemanda.protocolo}</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default DemandaMetadataSection;
