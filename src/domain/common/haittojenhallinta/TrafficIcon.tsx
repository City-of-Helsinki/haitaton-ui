import Bike from '../../../common/components/icons/Bike';
import Bus from '../../../common/components/icons/Bus';
import Car from '../../../common/components/icons/Car';
import Tram from '../../../common/components/icons/Tram';
import { HAITTOJENHALLINTATYYPPI } from './types';

type Props = {
  haittojenhallintatyyppi: HAITTOJENHALLINTATYYPPI;
};

export default function TrafficIcon({ haittojenhallintatyyppi }: Readonly<Props>) {
  switch (haittojenhallintatyyppi) {
    case HAITTOJENHALLINTATYYPPI.LINJAAUTOLIIKENNE:
      return <Bus />;
    case HAITTOJENHALLINTATYYPPI.RAITIOLIIKENNE:
      return <Tram />;
    case HAITTOJENHALLINTATYYPPI.AUTOLIIKENNE:
      return <Car />;
    case HAITTOJENHALLINTATYYPPI.PYORALIIKENNE:
      return <Bike />;
    default:
      return <></>;
  }
}
