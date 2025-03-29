import React from 'react';

interface MultiSelectProps {
  selected: string[];
  onChange: (value: string[]) => void;
  options: { label: string; value: string }[];
  placeholder?: string;
}

export const MultiSelect: React.FC<MultiSelectProps> = ({
  selected,
  onChange,
  options,
  placeholder = 'Selecione...',
}) => {
  const toggleOption = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  return (
    <div className="border rounded-md p-2 bg-white">
      <p className="text-sm mb-1 text-gray-600">{placeholder}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            className={`px-2 py-1 text-sm rounded border ${
              selected.includes(opt.value)
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-gray-100 text-gray-700'
            }`}
            onClick={() => toggleOption(opt.value)}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default MultiSelect;
