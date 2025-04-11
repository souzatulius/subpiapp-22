
import { useEffect, useRef, useState } from 'react';
import { debounce } from '@/lib/utils';
import { useAuth } from '@/hooks/useSupabaseAuth';

export interface AutosaveOptions {
  onSave: (triggerType: 'navigation' | 'timeout' | 'visibility' | 'manual') => Promise<boolean>;
  debounceMs?: number;
  saveOnUnmount?: boolean;
  saveOnVisibilityChange?: boolean;
  enabled?: boolean;
}

/**
 * A hook that provides autosave functionality for components
 */
export const useAutosave = ({
  onSave,
  debounceMs = 2000,
  saveOnUnmount = true,
  saveOnVisibilityChange = true,
  enabled = true
}: AutosaveOptions) => {
  const { user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const hasPendingSaveRef = useRef(false);
  
  // Create a debounced save function
  const debouncedSave = useRef(
    debounce(async (triggerType: 'navigation' | 'timeout' | 'visibility' | 'manual') => {
      if (!enabled || !user || !hasPendingSaveRef.current) return;
      
      try {
        setIsSaving(true);
        const success = await onSave(triggerType);
        
        if (success) {
          setLastSaved(new Date());
          setHasUnsavedChanges(false);
          hasPendingSaveRef.current = false;
        }
      } catch (error) {
        console.error('Error saving changes:', error);
      } finally {
        setIsSaving(false);
      }
    }, debounceMs)
  ).current;
  
  // Set up page visibility change listener
  useEffect(() => {
    if (!enabled || !saveOnVisibilityChange) return;
    
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden' && hasUnsavedChanges) {
        debouncedSave('visibility');
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [debouncedSave, enabled, saveOnVisibilityChange, hasUnsavedChanges]);
  
  // Set up beforeunload event listener
  useEffect(() => {
    if (!enabled) return;
    
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        // Standard way of showing a confirmation dialog before leaving
        e.preventDefault();
        e.returnValue = '';
        
        // Try to save before unloading
        debouncedSave('navigation');
      }
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [debouncedSave, enabled, hasUnsavedChanges]);
  
  // Save on component unmount
  useEffect(() => {
    return () => {
      if (enabled && saveOnUnmount && hasUnsavedChanges) {
        // We need to use the non-debounced version for unmount to ensure it fires
        onSave('navigation').catch(error => 
          console.error('Error saving on unmount:', error)
        );
      }
    };
  }, [onSave, enabled, saveOnUnmount, hasUnsavedChanges]);

  // Function to mark that there are unsaved changes
  const setUnsaved = () => {
    setHasUnsavedChanges(true);
    hasPendingSaveRef.current = true;
  };

  // Function to manually trigger a save
  const saveNow = async (): Promise<boolean> => {
    if (!enabled || !user) return false;
    
    try {
      setIsSaving(true);
      const success = await onSave('manual');
      
      if (success) {
        setLastSaved(new Date());
        setHasUnsavedChanges(false);
        hasPendingSaveRef.current = false;
      }
      
      return success;
    } catch (error) {
      console.error('Error during manual save:', error);
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  return {
    isSaving,
    lastSaved,
    hasUnsavedChanges,
    setUnsaved,
    saveNow,
    autosaveEnabled: enabled
  };
};
