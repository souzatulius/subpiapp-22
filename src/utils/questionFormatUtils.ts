
/**
 * Checks if a URL is valid and properly formatted as a public URL
 * @param url The URL to validate
 * @returns boolean indicating if the URL is valid
 */
export const isValidPublicUrl = (url: string): boolean => {
  if (!url) return false;
  
  try {
    new URL(url);
    
    // Check for common storage URL patterns
    const isStorageUrl = url.includes('/storage/v1/object/public/') || 
                         url.includes('/storage/v1/object/sign/');
    
    // Return true if it's a valid URL
    return true;
  } catch (e) {
    return false;
  }
};
