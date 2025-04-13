
import React from "react";
import { CardColor } from "@/types/dashboard";
import { cn } from "@/lib/utils";
import ColorOptions from "./ColorOptions";

interface ColorSelectorProps {
  value: CardColor;
  onChange: (color: CardColor) => void;
}

export function ColorSelector({ value, onChange }: ColorSelectorProps) {
  return (
    <div className="space-y-2">
      <ColorOptions selectedColor={value} onColorSelect={onChange} />
    </div>
  );
}

export default ColorSelector;
