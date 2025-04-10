
import { useSensors, useSensor, PointerSensor, KeyboardSensor } from '@dnd-kit/core';

export const useDndSensors = () => {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: (event, args) => {
        const target = event.target as HTMLElement;
        const isInputElement = target.tagName.toLowerCase() === 'input' || 
                              target.tagName.toLowerCase() === 'textarea' ||
                              target.isContentEditable;

        if (isInputElement) {
          return null;
        }
        
        // Return coordinates in the correct format (Coordinates or null)
        // Instead of returning ClientRect which is causing the type error
        const rect = args.context.active?.rect?.current?.translated;
        return rect ? { x: rect.left, y: rect.top } : null;
      }
    })
  );

  return sensors;
};

export default useDndSensors;
