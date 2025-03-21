
import React from "react";
import { cn } from "@/lib/utils";
import { AlertCircle, Info } from "lucide-react";

interface AttentionBoxProps {
  title?: string;
  children: React.ReactNode;
  variant?: "warning" | "info";
  icon?: boolean;
  className?: string;
}

const AttentionBox = ({
  title,
  children,
  variant = "warning",
  icon = true,
  className,
}: AttentionBoxProps) => {
  const Icon = variant === "warning" ? AlertCircle : Info;
  
  return (
    <div 
      className={cn(
        "p-4 rounded-md text-sm border",
        variant === "warning" 
          ? "bg-orange-50 border-orange-200" 
          : "bg-blue-50 border-blue-200",
        className
      )}
    >
      <div className="flex gap-2">
        {icon && (
          <Icon 
            className={variant === "warning" ? "h-5 w-5 text-subpi-orange flex-shrink-0" : "h-5 w-5 text-blue-500 flex-shrink-0"} 
          />
        )}
        <div className="flex-1">
          {title && (
            <p className={variant === "warning" ? "font-medium text-subpi-orange" : "font-medium text-blue-700"}>
              {title}
            </p>
          )}
          <div className="text-gray-600">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttentionBox;
