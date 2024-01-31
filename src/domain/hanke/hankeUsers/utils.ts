import { HankeUser } from './hankeUser';
import { HankeYhteyshenkilo } from '../../types/hanke';

export function mapHankeUserToHankeYhteyshenkilo({
  id,
  etunimi,
  sukunimi,
  sahkoposti,
  puhelinnumero,
}: HankeUser): HankeYhteyshenkilo {
  return {
    id,
    etunimi,
    sukunimi,
    sahkoposti,
    puhelinnumero,
  };
}
