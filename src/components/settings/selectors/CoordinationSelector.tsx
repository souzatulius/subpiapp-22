
import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Area } from '@/hooks/problems/types';

interface CoordinationSelectorProps {
  areas: Area[];
  field: any;
}

export function CoordinationSelector({ areas, field }: CoordinationSelectorProps) {
  return (
    <Select
      onValueChange={field.onChange}
      defaultValue={field.value}
      value={field.value}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Selecione uma coordenação" />
      </SelectTrigger>
      <SelectContent>
        {areas.map((area) => (
          <SelectItem key={area.id} value={area.id}>
            {area.descricao}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
