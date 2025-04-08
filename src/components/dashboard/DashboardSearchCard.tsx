
import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface DashboardSearchCardProps {
  isEditMode?: boolean;
}

const DashboardSearchCard: React.FC<DashboardSearchCardProps> = ({
  isEditMode = false
}) => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!query.trim()) return;
    
    // Navigate to search page with query parameter
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  // Stop propagation to avoid triggering drag when in edit mode
  const handleMouseDown = (e: React.MouseEvent) => {
    if (isEditMode) {
      e.stopPropagation();
    }
  };

  return (
    <div className="w-full h-full bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex items-center">
      <form onSubmit={handleSubmit} className="w-full h-full flex items-center" onMouseDown={handleMouseDown}>
        <div className="relative w-full h-full flex items-center">
          <input
            type="text"
            className="w-4/5 h-4/5 pl-6 pr-16 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-2xl"
            placeholder="O que deseja fazer?"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onMouseDown={handleMouseDown}
          />
          <button
            type="submit"
            className="absolute right-4 top-1/2 transform -translate-y-1/2"
            onMouseDown={handleMouseDown}
          >
            <Search className="h-8 w-8 text-gray-400 hover:text-blue-500 transition-colors" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default DashboardSearchCard;
