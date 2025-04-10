
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
        
        return args.context.activeNode ? args.context.activeNode.getBoundingClientRect() : null;
      }
    })
  );

  return sensors;
};

export default useDndSensors;
