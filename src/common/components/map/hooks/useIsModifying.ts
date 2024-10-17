import { useEffect, useState } from 'react';
import useModifyInteraction from './useModifyInteraction';

export default function useIsModifying() {
  const modifyInteraction = useModifyInteraction();
  const [isModifying, setIsModifying] = useState(false);

  useEffect(() => {
    modifyInteraction?.on('modifystart', () => {
      setIsModifying(true);
    });
    modifyInteraction?.on('modifyend', () => {
      setIsModifying(false);
    });
  }, [modifyInteraction]);

  return isModifying;
}
