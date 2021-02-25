import { useContext } from 'react';
import { DrawContext } from './DrawContext';

const useDrawContext = () => {
  const context = useContext(DrawContext);
  if (context === undefined) {
    throw new Error('useDrawContext must be within DrawProvider');
  }
  return context;
};

export default useDrawContext;
