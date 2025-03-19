import React from 'react';
import PWAButton from './PWAButton';
import Header from '@/components/layouts/Header';
interface AuthLayoutProps {
  children: React.ReactNode;
  leftContent: React.ReactNode;
}
const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  leftContent
}) => {
  return <div className="min-h-screen flex flex-col">
      {/* Header - explicitly pass showControls={false} for auth pages */}
      <Header showControls={false} />

      {/* Main content */}
      <div className="flex flex-1 flex-col md:flex-row">
        {/* Left side - Fixed content */}
        <div className="w-full md:w-1/2 bg-white p-6 md:p-12 flex flex-col justify-center py-[30px] px-[24px]">
          {leftContent}
        </div>

        {/* Right side - Dynamic content */}
        <div className="w-full md:w-1/2 bg-[#003570] p-6 flex items-center justify-center py-[30px] px-0">
          <div className="w-full max-w-md px-0">
            {children}
          </div>
        </div>
      </div>

      {/* PWA Button */}
      <PWAButton />
    </div>;
};
export default AuthLayout;