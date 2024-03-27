import { useState } from 'react';
import { useDeleteInfo } from './useDeleteInfo';
import { HankeUser } from '../hankeUser';

export function useUserDelete() {
  const [userToDelete, setUserToDelete] = useState<HankeUser | null>(null);
  const queryResult = useDeleteInfo(userToDelete?.id);

  function setDeletedUser(user: HankeUser) {
    setUserToDelete(user);
  }

  function resetUserToDelete() {
    setUserToDelete(null);
  }

  return {
    deleteInfoQueryResult: queryResult,
    userToDelete,
    setDeletedUser,
    resetUserToDelete,
  };
}
