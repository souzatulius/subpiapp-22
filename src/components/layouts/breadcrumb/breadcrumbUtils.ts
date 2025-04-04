
import { customBreadcrumbs, displayNames, hiddenSegments } from './breadcrumbConfig';

export interface BreadcrumbItem {
  label: string;
  path: string;
}

export const getBreadcrumbItems = (currentPath: string): BreadcrumbItem[] => {
  // Find matching path configuration
  const matchedConfig = customBreadcrumbs.find(config => 
    currentPath === config.path || 
    // Special handling for paths with query parameters
    (currentPath.includes('?') && currentPath.split('?')[0] === config.path)
  );
  
  if (matchedConfig) {
    return matchedConfig.items;
  }
  
  // Default fallback to generate breadcrumbs dynamically
  return generateDefaultBreadcrumbs(currentPath);
};

export const generateDefaultBreadcrumbs = (pathname: string): BreadcrumbItem[] => {
  // Remove leading slash and split path into segments
  const pathSegments = pathname.substring(1).split('/');
  
  // Filter segments that should be shown
  const filteredSegments = pathSegments.filter((segment, index) => {
    // Remove empty segments
    if (!segment) return false;
    
    // Special case for comunicacao path
    if (segment === 'comunicacao' && index === 1) {
      return true;
    }
    
    // Remove segments that should be hidden
    const fullPath = pathSegments.slice(0, index + 1).join('/');
    if (hiddenSegments.includes(segment) || hiddenSegments.includes(fullPath)) {
      return false;
    }
    
    return true;
  });
  
  // Map segments to breadcrumb items
  return filteredSegments.map((segment, index) => {
    if (!segment || segment === 'dashboard') {
      return { 
        label: 'Início', 
        path: '/dashboard' 
      };
    }
    
    const path = '/' + pathSegments.slice(0, pathSegments.indexOf(segment) + 1).join('/');
    return {
      label: getDisplayName(segment),
      path: path
    };
  });
};

export const getDisplayName = (segment: string): string => {
  return displayNames[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
};
