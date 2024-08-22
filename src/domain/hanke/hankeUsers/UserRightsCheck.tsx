import React from 'react';
import { Rights, SignedInUser } from './hankeUser';
import { usePermissionsForHanke } from './hooks/useUserRightsForHanke';

/**
 * Check that user has required rights.
 * If they have, render children.
 */
export function CheckRightsByHanke({
  requiredRight,
  hankeTunnus,
  children,
}: {
  /** User right that is required to render children */
  requiredRight: keyof typeof Rights;
  /** hankeTunnus of the hanke that the right is required for */
  hankeTunnus?: string;
  children: React.ReactElement | null;
}) {
  const { data: signedInUser } = usePermissionsForHanke(hankeTunnus);

  if (signedInUser?.kayttooikeudet.includes(requiredRight)) {
    return children;
  }

  return null;
}

export function CheckRightsByUser({
  requiredRight,
  signedInUser,
  children,
}: {
  requiredRight: keyof typeof Rights;
  signedInUser: SignedInUser;
  children: React.ReactElement | null;
}) {
  return signedInUser?.kayttooikeudet?.includes(requiredRight) ? children : null;
}
