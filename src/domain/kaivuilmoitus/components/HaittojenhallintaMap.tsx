import { useEffect, useRef } from 'react';
import VectorSource from 'ol/source/Vector';
import { Box, BoxProps } from '@chakra-ui/layout';
import { Feature } from 'ol';
import { Geometry } from 'ol/geom';
import Map from '../../../common/components/map/Map';
import Kantakartta from '../../map/components/Layers/Kantakartta';
import AddressSearchContainer from '../../map/components/AddressSearch/AddressSearchContainer';
import OverviewMapControl from '../../../common/components/map/controls/OverviewMapControl';
import useHankealueFeature from '../../map/hooks/useHankealueFeature';
import { HankeAlue } from '../../types/hanke';
import VectorLayer from '../../../common/components/map/layers/VectorLayer';
import { styleFunction } from '../../map/utils/geometryStyle';
import FitSource from '../../map/components/interations/FitSource';
import { KaivuilmoitusAlue } from '../../application/types/application';
import { HAITTOJENHALLINTATYYPPI } from '../../common/haittojenhallinta/types';
import { getHaittaIndexForTyyppi } from '../../common/haittojenhallinta/utils';

interface HaittojenhallintaMapProps extends BoxProps {
  hankeAlue: HankeAlue;
  kaivuilmoitusAlue: KaivuilmoitusAlue;
  haittojenHallintaTyyppi: HAITTOJENHALLINTATYYPPI;
}

export default function HaittojenhallintaMap({
  hankeAlue,
  kaivuilmoitusAlue,
  haittojenHallintaTyyppi,
  ...chakraProps
}: Readonly<HaittojenhallintaMapProps>) {
  const hankeSource = useRef(new VectorSource());
  const hankeAlueHaittaIndex = getHaittaIndexForTyyppi(
    hankeAlue.tormaystarkasteluTulos,
    haittojenHallintaTyyppi,
  );
  useHankealueFeature(hankeSource.current, hankeAlue, hankeAlueHaittaIndex);

  const kaivuilmoitusSource = useRef(new VectorSource());
  useEffect(() => {
    kaivuilmoitusSource.current.clear();
    const applicationFeatures = kaivuilmoitusAlue.tyoalueet.map((tyoalue) => {
      const tyoalueHaittaIndex = getHaittaIndexForTyyppi(
        tyoalue.tormaystarkasteluTulos,
        haittojenHallintaTyyppi,
      );

      const feature = tyoalue.openlayersFeature?.clone();
      feature?.setProperties(
        {
          liikennehaittaindeksi: tyoalueHaittaIndex,
        },
        true,
      );
      return feature;
    }) as Feature<Geometry>[];
    kaivuilmoitusSource.current.addFeatures(applicationFeatures);
  }, [kaivuilmoitusSource, kaivuilmoitusAlue.tyoalueet, haittojenHallintaTyyppi]);

  return (
    <Box height="500px" position="relative" {...chakraProps}>
      <Map zoom={9}>
        <Kantakartta />
        <AddressSearchContainer position={{ top: '1rem', left: '1rem' }} />
        <OverviewMapControl />
        <FitSource source={hankeSource.current} />
        <VectorLayer
          source={hankeSource.current}
          className="hankeGeometryLayer"
          style={styleFunction}
        />
        <VectorLayer
          source={kaivuilmoitusSource.current}
          className="kaivuilmoitusGeometryLayer"
          style={styleFunction}
        />
      </Map>
    </Box>
  );
}
