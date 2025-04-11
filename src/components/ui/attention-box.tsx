
import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AttentionBoxProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
}

const AttentionBox: React.FC<AttentionBoxProps> = ({
  children,
  title = "Atenção",
  className = ""
}) => {
  return (
    <div className={cn(
      "bg-amber-50 border-l-4 border-amber-500 p-4 rounded-md",
      className
    )}>
      <div className="flex items-center mb-2">
        <AlertTriangle className="h-5 w-5 text-amber-500 mr-2" />
        <h3 className="text-sm font-medium text-amber-800">{title}</h3>
      </div>
      <div className="text-sm text-amber-700">
        {children}
      </div>
    </div>
  );
};

export default AttentionBox;
