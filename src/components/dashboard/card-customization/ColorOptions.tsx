
import { useState } from "react";
import { CardColor } from "@/types/dashboard";
import { cn } from "@/lib/utils";
import { getColorClass } from "@/components/dashboard/card-customization/utils";

interface ColorOptionsProps {
  selectedColor: CardColor;
  onColorSelect: (color: CardColor) => void;
}

export default function ColorOptions({
  selectedColor,
  onColorSelect
}: ColorOptionsProps) {
  const colorOptions: { value: CardColor; displayName: string }[] = [
    { value: "blue-light", displayName: "Azul Claro" },
    { value: "blue-vivid", displayName: "Azul Vivo" },
    { value: "blue-dark", displayName: "Azul Escuro" },
    { value: "orange-light", displayName: "Laranja Claro" },
    { value: "orange-dark", displayName: "Laranja Escuro" },
    { value: "gray-light", displayName: "Cinza Claro" },
    { value: "gray-medium", displayName: "Cinza Médio" },
    { value: "green-neon", displayName: "Verde Neon" },
    { value: "green-dark", displayName: "Verde Escuro" },
    { value: "green-teal", displayName: "Verde Água" },
    { value: "deep-blue", displayName: "Azul Profundo" },
    { value: "bg-white", displayName: "Branco" },
    { value: "bg-blue-500", displayName: "Azul" },
    { value: "bg-orange-500", displayName: "Laranja" },
    { value: "bg-gray-500", displayName: "Cinza" },
    { value: "bg-green-500", displayName: "Verde" },
    { value: "bg-yellow-500", displayName: "Amarelo" },
    { value: "bg-teal-500", displayName: "Turquesa" },
    { value: "bg-red-500", displayName: "Vermelho" },
    { value: "bg-purple-500", displayName: "Roxo" },
  ];

  const handleColorSelect = (color: CardColor) => {
    onColorSelect(color);
  };

  return (
    <div className="grid grid-cols-5 gap-2">
      {colorOptions.map((color) => {
        const isSelected = color.value === selectedColor;
        const colorClass = getColorClass(color.value);
        
        return (
          <button
            key={color.value}
            type="button"
            className={cn(
              "h-10 rounded-md border relative",
              colorClass,
              isSelected ? "ring-2 ring-blue-600 ring-offset-2" : "hover:opacity-90"
            )}
            onClick={() => handleColorSelect(color.value)}
            title={color.displayName}
          >
            {isSelected && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-2 w-2 rounded-full bg-blue-600"></div>
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}
