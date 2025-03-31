
/**
 * Utility functions for string transformation
 */

/**
 * Transforms a name by capitalizing the first letter of each word
 * and converting the rest to lowercase
 * 
 * @param name The name to transform
 * @returns The transformed name
 */
export const transformName = (name: string): string => {
  if (!name) return '';
  
  return name
    .trim()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

/**
 * Formats a string to title case
 * 
 * @param str The string to format
 * @returns The formatted string
 */
export const toTitleCase = (str: string): string => {
  if (!str) return '';
  
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};
