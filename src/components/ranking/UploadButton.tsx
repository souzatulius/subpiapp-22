
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, X } from 'lucide-react';
import UploadSection from './UploadSection';

interface UploadButtonProps {
  isUploading: boolean;
  onUploadStart: () => void;
  onUploadComplete: (id: string, data: any[]) => void;
  onPainelUploadComplete: (id: string, data: any[]) => void;
  currentUser: any;
  onRefreshData: () => Promise<void>;
}

const UploadButton: React.FC<UploadButtonProps> = ({
  isUploading,
  onUploadStart,
  onUploadComplete,
  onPainelUploadComplete,
  currentUser,
  onRefreshData
}) => {
  const [showUploadSection, setShowUploadSection] = useState(false);

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        className="bg-white hover:bg-gray-100 border-gray-200"
        onClick={() => setShowUploadSection(!showUploadSection)}
      >
        {showUploadSection ? (
          <X className="h-5 w-5 text-gray-600" />
        ) : (
          <Upload className="h-5 w-5 text-gray-600" />
        )}
      </Button>

      {showUploadSection && (
        <div className="mt-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-medium text-gray-700">Upload de Planilhas</h3>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowUploadSection(false)}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <UploadSection 
            onUploadStart={onUploadStart}
            onUploadComplete={onUploadComplete}
            onPainelUploadComplete={onPainelUploadComplete}
            isUploading={isUploading}
            user={currentUser}
            onRefreshData={onRefreshData}
          />
        </div>
      )}
    </>
  );
};

export default UploadButton;
