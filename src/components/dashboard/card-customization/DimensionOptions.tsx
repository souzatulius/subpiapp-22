
import { CardWidth, CardHeight } from "@/types/dashboard";
import { cn } from "@/lib/utils";

interface DimensionOptionsProps {
  type: "width" | "height";
  selectedValue: string;
  onValueSelect: (value: any) => void;
}

export default function DimensionOptions({
  type,
  selectedValue,
  onValueSelect
}: DimensionOptionsProps) {
  const widthOptions: { value: CardWidth; display: string }[] = [
    { value: "25", display: "25%" },
    { value: "50", display: "50%" },
    { value: "75", display: "75%" },
    { value: "100", display: "100%" },
  ];

  const heightOptions: { value: CardHeight; display: string }[] = [
    { value: "0.5", display: "Mini" },
    { value: "1", display: "P" },
    { value: "2", display: "M" },
    { value: "3", display: "G" },
    { value: "4", display: "XG" },
  ];

  const options = type === "width" ? widthOptions : heightOptions;

  return (
    <div className="grid grid-cols-4 gap-1">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onValueSelect(option.value)}
          className={cn(
            "px-2 py-1 text-sm rounded-md border border-gray-300 hover:bg-gray-50 transition-colors",
            selectedValue === option.value 
              ? "bg-blue-100 text-blue-700 border-blue-400 font-medium" 
              : "bg-white"
          )}
        >
          {option.display}
        </button>
      ))}
    </div>
  );
}
