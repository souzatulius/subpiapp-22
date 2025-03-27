import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
interface RespostaFormHeaderProps {
  selectedDemanda: any;
  onBack: () => void;
}
const RespostaFormHeader: React.FC<RespostaFormHeaderProps> = ({
  selectedDemanda,
  onBack
}) => {
  return <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
      
    </div>;
};
export default RespostaFormHeader;