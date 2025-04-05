
import React from 'react';
import { Problem } from '@/hooks/problems/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ProblemSelectorProps {
  value: string;
  onChange: (value: string) => void;
  problemas: Problem[];
  className?: string;
}

const ProblemSelector: React.FC<ProblemSelectorProps> = ({
  value,
  onChange,
  problemas,
  className,
}) => {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className={className}>
        <SelectValue placeholder="Selecione um problema" />
      </SelectTrigger>
      <SelectContent>
        {problemas.map((problema) => (
          <SelectItem key={problema.id} value={problema.id}>
            {problema.descricao}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default ProblemSelector;
