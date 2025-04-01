
import React from 'react';
import { ActionCard } from '@/types/dashboard';

// Define a simplified type for the dashboard props to avoid deep type instantiation
interface UnifiedDashboardProps {
  userId: string;
  dashboardType: string;
  title: string;
  description: string;
  fallbackCards?: ActionCard[];
}

const UnifiedDashboard: React.FC<UnifiedDashboardProps> = ({
  userId,
  dashboardType,
  title,
  description,
  fallbackCards = []
}) => {
  return (
    <div className="w-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        <p className="text-gray-600">{description}</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {fallbackCards.map((card, index) => (
          <div 
            key={card.id || index} 
            className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow"
          >
            <div className="text-xl font-medium">{card.title}</div>
            <div className="text-gray-600">{card.description}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UnifiedDashboard;
