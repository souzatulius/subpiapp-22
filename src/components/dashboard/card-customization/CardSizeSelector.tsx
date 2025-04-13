
import React from 'react';
import { CardWidth, CardHeight } from "@/types/dashboard";
import DimensionOptions from "./DimensionOptions";

interface CardSizeSelectorProps {
  type: "width" | "height";
  value: string;
  onChange: (value: CardWidth | CardHeight) => void;
}

export function CardSizeSelector({ type, value, onChange }: CardSizeSelectorProps) {
  return (
    <DimensionOptions
      type={type}
      selectedValue={value}
      onValueSelect={onChange}
    />
  );
}

export default CardSizeSelector;
