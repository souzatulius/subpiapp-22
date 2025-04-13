
import React from 'react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CardType } from "@/types/dashboard";

interface CardTypeSelectorProps {
  value: CardType;
  onChange: (value: CardType) => void;
}

export function CardTypeSelector({ value, onChange }: CardTypeSelectorProps) {
  const cardTypes = [
    { value: "standard", label: "Padrão" },
    { value: "data_dynamic", label: "Dados Dinâmicos" },
    { value: "in_progress_demands", label: "Demandas em Andamento" },
    { value: "recent_notes", label: "Notas Recentes" },
    { value: "origin_selection", label: "Seleção de Origem" },
    { value: "smart_search", label: "Busca Inteligente" },
    { value: "origin_demand_chart", label: "Gráfico de Demandas" },
    { value: "communications", label: "Comunicações" },
    { value: "pending_actions", label: "Ações Pendentes" },
  ];

  return (
    <RadioGroup
      value={value}
      onValueChange={onChange as (value: string) => void}
      className="grid grid-cols-2 gap-2"
    >
      {cardTypes.map((type) => (
        <div 
          key={type.value} 
          className="flex items-center space-x-2 border rounded-md p-2 hover:bg-gray-50"
        >
          <RadioGroupItem value={type.value} id={`type-${type.value}`} />
          <Label htmlFor={`type-${type.value}`}>{type.label}</Label>
        </div>
      ))}
    </RadioGroup>
  );
}

export default CardTypeSelector;
