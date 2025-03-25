
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface SettingsCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  link: string;
  count?: number;
  color?: string;
  actionText?: string;
  category?: string;
  children?: React.ReactNode;
}

const SettingsCard: React.FC<SettingsCardProps> = ({
  title,
  description,
  icon,
  link,
  count,
  color = "bg-blue-600",
  actionText = "Gerenciar",
  category,
  children
}) => {
  return (
    <Card className="h-full hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
      <CardHeader className={`flex flex-row items-center justify-between pb-2 ${color} text-white rounded-t-xl`}>
        <CardTitle className="text-sm font-medium flex items-center">
          {icon}
          <span className="ml-2">{title}</span>
        </CardTitle>
        {category && (
          <span className="text-xs bg-white/30 px-2 py-1 rounded-full">
            {category}
          </span>
        )}
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">{description}</p>
            {count !== undefined && (
              <span className="text-xl font-bold">
                {count}
              </span>
            )}
          </div>
          {children && (
            <div className="mt-3">
              {children}
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="pt-0 pb-4">
        <Button 
          variant="ghost" 
          size="sm" 
          className="w-full justify-between hover:bg-gray-100"
          asChild
        >
          <Link to={link}>
            {actionText}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SettingsCard;
