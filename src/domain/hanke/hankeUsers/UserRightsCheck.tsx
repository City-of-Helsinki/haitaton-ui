import React from 'react';
import useUserRightsForHanke from './hooks/useUserRightsForHanke';
import { Rights } from './hankeUser';

/**
 * Check that user has required rights.
 * If they have, render children.
 */
function UserRightsCheck({
  requiredRight,
  hankeTunnus,
  children,
}: {
  /** User right that is required to render children */
  requiredRight: keyof typeof Rights;
  /** hankeTunnus of the hanke that the right is required for */
  hankeTunnus: string;
  children: React.ReactElement;
}) {
  const { data: signedInUser } = useUserRightsForHanke(hankeTunnus);

  if (signedInUser?.kayttooikeudet.includes(requiredRight)) {
    return children;
  }

  return null;
}

export default UserRightsCheck;
