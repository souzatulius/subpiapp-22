// Utility functions for handling question formats and validations

/**
 * Normalizes different question structures into a consistent array format
 */
export const normalizeQuestions = (perguntas: any): string[] => {
  if (!perguntas) return [];
  
  if (Array.isArray(perguntas)) {
    return perguntas.filter((item): item is string => 
      typeof item === 'string' && item.trim() !== ''
    );
  }
  
  if (typeof perguntas === 'object') {
    return Object.values(perguntas)
      .filter((item): item is string => 
        typeof item === 'string' && item.trim() !== ''
      );
  }
  
  return [];
};

/**
 * Formats questions array into an object with indexed keys
 */
export const formatQuestionsToObject = (questions: string[]): Record<string, string> => {
  if (!questions || !Array.isArray(questions)) return {};
  
  return questions.reduce((acc, question, index) => {
    acc[index.toString()] = question;
    return acc;
  }, {} as Record<string, string>);
};

/**
 * Validates if a string is a valid URL for file attachments
 * @param url The URL string to validate
 * @returns boolean indicating if the URL is valid
 */
export const isValidPublicUrl = (url: string): boolean => {
  if (!url || typeof url !== 'string') return false;
  
  try {
    // Check if it's a supabase URL or another valid URL
    return (
      url.includes('supabase.co/storage/v1/object/public/') ||
      url.startsWith('https://') ||
      url.startsWith('http://')
    );
  } catch (e) {
    return false;
  }
};

/**
 * Normalizes a file URL to ensure it points to the correct Supabase location
 * @param url The URL to normalize
 * @returns The normalized URL
 */
export const normalizeFileUrl = (url: string): string => {
  if (!url || typeof url !== 'string') return '';
  
  try {
    // If it's already a complete Supabase URL
    if (url.includes('supabase.co/storage/v1/object/public/')) {
      // Ensure it uses HTTPS
      if (url.startsWith('http://')) {
        return url.replace('http://', 'https://');
      }
      return url;
    }
    
    // If it starts with /storage
    if (url.startsWith('/storage/')) {
      return `https://mapjrbfzurpjmianfnev.supabase.co${url}`;
    }
    
    // If it's just a path without domain (default to demandas bucket)
    if (!url.startsWith('http')) {
      const bucket = 'demandas';
      const cleanPath = url.startsWith('/') ? url.substring(1) : url;
      return `https://mapjrbfzurpjmianfnev.supabase.co/storage/v1/object/public/${bucket}/${cleanPath}`;
    }
    
    return url;
  } catch (e) {
    console.error("Error normalizing URL:", e, url);
    return url;
  }
};

/**
 * Processes an array of file URLs ensuring they are all normalized
 * @param urls Array of URLs or URL-like objects to normalize
 * @returns Array of normalized valid URLs
 */
export const processFileUrls = (urls: any): string[] => {
  if (!urls) return [];
  
  // If it's already an array
  if (Array.isArray(urls)) {
    return urls
      .filter(url => url && typeof url === 'string')
      .map(normalizeFileUrl)
      .filter(isValidPublicUrl);
  }
  
  // If it's a JSON string representing an array
  if (typeof urls === 'string') {
    try {
      const parsed = JSON.parse(urls);
      if (Array.isArray(parsed)) {
        return parsed
          .filter(url => url && typeof url === 'string')
          .map(normalizeFileUrl)
          .filter(isValidPublicUrl);
      }
      
      // If it's a single URL string
      if (isValidPublicUrl(urls)) {
        return [normalizeFileUrl(urls)];
      }
    } catch {
      // If it's not valid JSON but a valid URL
      if (isValidPublicUrl(urls)) {
        return [normalizeFileUrl(urls)];
      }
    }
  }
  
  return [];
};
