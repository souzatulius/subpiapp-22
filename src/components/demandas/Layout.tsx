
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="container mx-auto p-4 py-8">
      <Card className="bg-white shadow-sm">
        <CardHeader className="pb-2 border-b">
          <CardTitle className="text-2xl font-bold text-[#003570]">
            Gerenciamento de Demandas
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {children}
        </CardContent>
      </Card>
    </div>
  );
};

export default Layout;
