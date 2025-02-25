import { useState } from 'react';
import { HAITTOJENHALLINTATYYPPI, Haittojenhallintasuunnitelma } from './types';

/**
 * Nuisance control plan section for a traffic type should be visible if its index > 0,
 * or if it has some content.
 */
function shouldBeVisible(
  type: HAITTOJENHALLINTATYYPPI,
  index: number,
  haittojenhallintasuunnitelma?: Haittojenhallintasuunnitelma,
): boolean {
  return (
    index > 0 ||
    (haittojenhallintasuunnitelma ? (haittojenhallintasuunnitelma[type]?.length ?? 0) > 0 : false)
  );
}

export default function useIsHaittojenhallintaSectionVisible(
  haittojenhallintatyypit: [HAITTOJENHALLINTATYYPPI, number][],
  haittojenhallintasuunnitelma?: Haittojenhallintasuunnitelma,
) {
  const liikennehaittatyypit = haittojenhallintatyypit.map(([tyyppi]) => tyyppi);
  const initialVisibility = liikennehaittatyypit.reduce(
    (acc, type) => {
      const found = haittojenhallintatyypit.find((value) => value[0] === type);
      return {
        ...acc,
        [type]: shouldBeVisible(type, found ? found[1] : 0, haittojenhallintasuunnitelma),
      };
    },
    {} as Record<HAITTOJENHALLINTATYYPPI, boolean>,
  );

  const [isVisible, setIsVisible] =
    useState<Record<HAITTOJENHALLINTATYYPPI, boolean>>(initialVisibility);

  function setVisible(type: HAITTOJENHALLINTATYYPPI) {
    setIsVisible((state) => ({ ...state, [type]: true }));
  }

  return { isVisible, setVisible };
}
