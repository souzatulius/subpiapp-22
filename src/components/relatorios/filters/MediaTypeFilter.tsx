
import React from 'react';
import { Select, SelectContent, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { FilterOptions } from '@/components/relatorios/types';

interface MediaTypeFilterProps {
  mediaTypes: FilterOptions['mediaTypes'];
  onMediaTypeChange: (mediaType: string) => void;
}

const MediaTypeFilter: React.FC<MediaTypeFilterProps> = ({ mediaTypes, onMediaTypeChange }) => {
  return (
    <div className="space-y-2">
      <Label>Tipo de Mídia</Label>
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Filtrar por mídia" />
        </SelectTrigger>
        <SelectContent>
          <div className="space-y-1 p-1">
            {['Todos', 'Jornal Impresso', 'Portal de Notícias', 'Jornal Online', 'Podcast', 'Rádio', 'TV'].map((type) => (
              <div key={type} className="flex items-center space-x-2">
                <Checkbox 
                  id={`media-${type}`} 
                  checked={mediaTypes.includes(type as any)}
                  onCheckedChange={() => onMediaTypeChange(type)}
                />
                <label 
                  htmlFor={`media-${type}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  {type}
                </label>
              </div>
            ))}
          </div>
        </SelectContent>
      </Select>
    </div>
  );
};

export default MediaTypeFilter;
