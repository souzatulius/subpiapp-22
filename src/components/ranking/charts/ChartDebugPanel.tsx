
import React from 'react';
import { useZeladoriaChartDataMock } from '@/hooks/ranking/useZeladoriaChartDataMock';

interface ChartDebugPanelProps {
  sgzData?: any[] | null;
  isVisible?: boolean;
}

const ChartDebugPanel: React.FC<ChartDebugPanelProps> = ({ 
  sgzData,
  isVisible = false 
}) => {
  const { data: mockData, isLoading, error } = useZeladoriaChartDataMock(0); // No delay for quick debug

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-white p-4 rounded-lg border border-gray-300 shadow-lg w-96 max-h-96 overflow-auto">
      <h3 className="text-sm font-bold mb-2">Chart Debug Panel</h3>
      
      <div className="mb-4">
        <h4 className="text-xs font-semibold">Mock Data:</h4>
        {isLoading ? (
          <p className="text-xs">Loading mock data...</p>
        ) : error ? (
          <p className="text-xs text-red-500">{error}</p>
        ) : !mockData ? (
          <p className="text-xs">No mock data available</p>
        ) : (
          <pre className="text-xs bg-gray-100 p-2 rounded max-h-32 overflow-auto">
            {JSON.stringify(mockData, null, 2)}
          </pre>
        )}
      </div>
      
      <div>
        <h4 className="text-xs font-semibold">SGZ Data (from props):</h4>
        {!sgzData ? (
          <p className="text-xs">No SGZ data provided</p>
        ) : (
          <pre className="text-xs bg-gray-100 p-2 rounded max-h-32 overflow-auto">
            {`Total items: ${sgzData.length}`}
            {sgzData.length > 0 && (
              <>
                <br />
                {`First item sample: ${JSON.stringify(sgzData[0], null, 2)}`}
              </>
            )}
          </pre>
        )}
      </div>
    </div>
  );
};

export default ChartDebugPanel;
