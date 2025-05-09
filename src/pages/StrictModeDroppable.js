import { useEffect, useState } from 'react';
import { Droppable } from 'react-beautiful-dnd';

export const StrictModeDroppable = ({ children, ...props }) => {
  const [enabled, setEnabled] = useState(false);
  
  useEffect(() => {
    // This is a workaround for React 18 Strict Mode
    const animation = requestAnimationFrame(() => {
      setEnabled(true);
    });
    
    return () => {
      cancelAnimationFrame(animation);
      setEnabled(false);
    };
  }, []);
  
  if (!enabled) {
    return null;
  }
  
  return <Droppable {...props}>{children}</Droppable>;
}; 