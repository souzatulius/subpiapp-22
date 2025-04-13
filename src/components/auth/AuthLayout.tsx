
import React from 'react';
import { Card } from '@/components/ui/card';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side with form */}
      <div className="w-full md:w-1/2 p-6 md:p-10 flex items-center justify-center">
        <Card className="w-full max-w-md p-8 shadow-lg border-0">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold mb-2">{title}</h1>
            <p className="text-gray-600">{subtitle}</p>
          </div>
          {children}
        </Card>
      </div>
      
      {/* Right side with background image */}
      <div className="hidden md:block md:w-1/2 login-bg-image bg-cover bg-center" />
      
      {/* Add global styles to hide chart progress container */}
      <style jsx global>{`
        .chart-progress-container {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default AuthLayout;
