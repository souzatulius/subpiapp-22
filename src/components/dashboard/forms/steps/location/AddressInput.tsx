
import React, { useEffect, useRef, useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { ValidationError } from '@/lib/formValidationUtils';
import { hasFieldError, getFieldErrorMessage } from '../identification/ValidationUtils';

interface AddressInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAddressSelect?: (address: string) => void;
  errors?: ValidationError[];
  disabled?: boolean;
}

declare global {
  interface Window {
    google: any;
    initAutocomplete: () => void;
  }
}

const AddressInput: React.FC<AddressInputProps> = ({
  value,
  onChange,
  onAddressSelect,
  errors = [],
  disabled = false
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false);
  const [autocomplete, setAutocomplete] = useState<any>(null);
  
  // Load Google Places API
  useEffect(() => {
    // Check if the script has already been added
    if (window.google?.maps?.places) {
      setIsGoogleLoaded(true);
      return;
    }
    
    // Define the callback for when Google Maps is loaded
    window.initAutocomplete = () => {
      setIsGoogleLoaded(true);
    };
    
    // Add the script element if it doesn't exist
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDlWrQZR2uFMdvTA4ut96BaXI4Fx80k3Ho&libraries=places&callback=initAutocomplete`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
    
    return () => {
      // Clean up only if we added the script
      if (!window.google?.maps?.places) {
        document.head.removeChild(script);
      }
      window.initAutocomplete = () => {};
    };
  }, []);
  
  // Initialize autocomplete when Google API is loaded and the input is available
  useEffect(() => {
    if (!isGoogleLoaded || !inputRef.current) return;
    
    try {
      const options = {
        componentRestrictions: { country: 'br' },
        fields: ['address_components', 'formatted_address', 'geometry'],
        strictBounds: false,
        types: ['address']
      };
      
      const autoCompleteInstance = new window.google.maps.places.Autocomplete(
        inputRef.current,
        options
      );
      
      // Restrict to São Paulo if possible
      const saopaulo = new window.google.maps.LatLng(-23.5505, -46.6333); // São Paulo coordinates
      const searchBounds = new window.google.maps.Circle({
        center: saopaulo,
        radius: 30000 // 30km radius around São Paulo
      }).getBounds();
      
      autoCompleteInstance.setBounds(searchBounds);
      
      // Set the autocomplete instance
      setAutocomplete(autoCompleteInstance);
      
      // Add place_changed listener
      autoCompleteInstance.addListener('place_changed', () => {
        const place = autoCompleteInstance.getPlace();
        
        if (!place.geometry) {
          console.log("No details available for input: '" + place.name + "'");
          return;
        }
        
        // Format the address to "Rua, Número - Bairro"
        let formattedAddress = place.formatted_address;
        
        // Create a synthetic event to update the input value
        const syntheticEvent = {
          target: {
            name: 'endereco',
            value: formattedAddress
          }
        } as React.ChangeEvent<HTMLInputElement>;
        
        // Update the form state through the onChange prop
        onChange(syntheticEvent);
        
        // Call the optional callback
        if (onAddressSelect) {
          onAddressSelect(formattedAddress);
        }
      });
    } catch (error) {
      console.error("Error initializing Google Places Autocomplete:", error);
    }
  }, [isGoogleLoaded, onChange, onAddressSelect]);
  
  // Handle regular input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Pass the change event up to the parent component
    onChange(e);
  };
  
  return (
    <div>
      <Label 
        htmlFor="endereco" 
        className={`block mb-2 ${hasFieldError('endereco', errors) ? 'text-orange-500 font-semibold' : ''}`}
      >
        Endereço {hasFieldError('endereco', errors) && <span className="text-orange-500">*</span>}
      </Label>
      <Input 
        id="endereco" 
        name="endereco" 
        ref={inputRef}
        value={value} 
        onChange={handleInputChange}
        className={`rounded-xl ${hasFieldError('endereco', errors) ? 'border-orange-500' : ''}`}
        placeholder="Digite o endereço (Ex: Rua, Número - Bairro)"
        disabled={disabled || !isGoogleLoaded}
      />
      {!isGoogleLoaded && (
        <p className="text-gray-500 text-xs mt-1">Carregando serviço de endereços...</p>
      )}
      {hasFieldError('endereco', errors) && (
        <p className="text-orange-500 text-sm mt-1">{getFieldErrorMessage('endereco', errors)}</p>
      )}
    </div>
  );
};

export default AddressInput;
