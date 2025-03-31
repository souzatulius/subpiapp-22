
import { Button } from "@/components/ui/button";
import { RotateCcw, Import } from "lucide-react";

interface DashboardActionButtonsProps {
  onDuplicate: () => void;
  onExport: () => void;
  onImport: () => void;
  onReset: () => void;
}

const DashboardActionButtons: React.FC<DashboardActionButtonsProps> = ({
  onDuplicate,
  onExport,
  onImport,
  onReset
}) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-2 mt-4">
      <Button variant="outline" size="sm" onClick={onDuplicate}>
        <CopyIcon className="h-4 w-4 mr-1" /> Duplicar
      </Button>
      <Button variant="outline" size="sm" onClick={onExport}>
        <ExportIcon className="h-4 w-4 mr-1" /> Exportar
      </Button>
      <Button variant="outline" size="sm" onClick={onImport}>
        <Import className="h-4 w-4 mr-1" /> Importar
      </Button>
      <Button variant="outline" size="sm" onClick={onReset}>
        <RotateCcw className="h-4 w-4 mr-1" /> Resetar
      </Button>
    </div>
  );
};

// Icon components
const CopyIcon = (props: any) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    {...props}
  >
    <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
  </svg>
);

const ExportIcon = (props: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

export default DashboardActionButtons;
