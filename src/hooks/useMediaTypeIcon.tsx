
import React from 'react';
import { Book, Newspaper, Monitor, MousePointer, Globe, HelpCircle, Mic, Tv, Radio } from 'lucide-react';
import * as LucideIcons from 'lucide-react';

export const useMediaTypeIcon = (tipoMidia: any, className = "h-5 w-5") => {
  // Se o registro tiver um ícone definido, usá-lo
  if (tipoMidia && tipoMidia.icone) {
    // Verificar se é um ícone do Lucide
    if (Object.keys(LucideIcons).includes(tipoMidia.icone)) {
      const IconComponent = LucideIcons[tipoMidia.icone as keyof typeof LucideIcons] as React.ElementType;
      return <IconComponent className={className} />;
    }
    
    // Se não for um ícone do Lucide, pode ser uma URL de imagem
    return (
      <img 
        src={tipoMidia.icone} 
        alt="Ícone" 
        className={className}
        onError={(e) => {
          // Fallback para ícone padrão se a imagem falhar
          e.currentTarget.style.display = 'none';
        }}
      />
    );
  }
  
  // Mapeamento padrão baseado na descrição
  const iconMap: Record<string, React.ReactNode> = {
    "Revista": <Book className={className} />,
    "Impresso": <Newspaper className={className} />,
    "Jornal Online": <Monitor className={className} />,
    "Portal": <MousePointer className={className} />,
    "Blog": <Globe className={className} />,
    "Podcast": <Mic className={className} />,
    "TV": <Tv className={className} />,
    "Rádio": <Radio className={className} />,
  };
  
  return tipoMidia && tipoMidia.descricao && iconMap[tipoMidia.descricao] 
    ? iconMap[tipoMidia.descricao] 
    : <HelpCircle className={className} />;
};
