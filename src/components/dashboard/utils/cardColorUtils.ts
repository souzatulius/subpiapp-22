
/**
 * Utility function to get color classes based on the card color
 */
export const getColorClasses = (color: string) => {
  switch (color) {
    case 'blue':
      return 'bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-100';
    case 'blue-dark':
      return 'bg-subpi-blue text-white border-subpi-blue hover:bg-subpi-blue-dark';
    case 'green':
      return 'bg-green-50 text-green-600 border-green-100 hover:bg-green-100';
    case 'orange':
      return 'bg-orange-50 text-orange-600 border-orange-100 hover:bg-orange-100';
    case 'orange-light':
      return 'bg-amber-50 text-amber-600 border-amber-100 hover:bg-amber-100';
    case 'orange-600':
      return 'bg-orange-600 text-white border-orange-700 hover:bg-orange-700';
    case 'gray-light':
      return 'bg-gray-50 text-gray-600 border-gray-100 hover:bg-gray-100';
    case 'gray-dark':
      return 'bg-gray-700 text-white border-gray-600 hover:bg-gray-800';
    case 'gray-ultra-light':
      return 'bg-gray-25 text-gray-600 border-gray-50 hover:bg-gray-50';
    case 'lime':
      return 'bg-lime-500 text-white border-lime-600 hover:bg-lime-600';
    default:
      return 'bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-100';
  }
};
