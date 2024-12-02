import { useEffect, useState } from 'react';
import useModifyInteraction from './useModifyInteraction';

export default function useIsModifying() {
  const modifyInteraction = useModifyInteraction();
  const [isModifying, setIsModifying] = useState(false);

  useEffect(() => {
    function handleModifyStart() {
      setIsModifying(true);
    }

    function handleModifyEnd() {
      setIsModifying(false);
    }

    modifyInteraction?.on('modifystart', handleModifyStart);
    modifyInteraction?.on('modifyend', handleModifyEnd);

    return function cleanup() {
      modifyInteraction?.un('modifystart', handleModifyStart);
      modifyInteraction?.un('modifyend', handleModifyEnd);
    };
  }, [modifyInteraction]);

  return isModifying;
}
