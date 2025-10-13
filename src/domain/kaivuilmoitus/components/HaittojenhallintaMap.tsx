import { useEffect, useRef } from 'react';
import { useWatch } from 'react-hook-form';
import VectorSource from 'ol/source/Vector';
import { Box, BoxProps } from '@chakra-ui/react';
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
  areaIndex: number; // index of the area within applicationData.areas for useWatch subscription
}

export default function HaittojenhallintaMap({
  hankeAlue,
  kaivuilmoitusAlue,
  haittojenHallintaTyyppi,
  areaIndex,
  ...chakraProps
}: Readonly<HaittojenhallintaMapProps>) {
  const hankeSource = useRef(new VectorSource());
  const hankeAlueHaittaIndex = getHaittaIndexForTyyppi(
    hankeAlue.tormaystarkasteluTulos,
    haittojenHallintaTyyppi,
  );
  useHankealueFeature(hankeSource.current, hankeAlue, hankeAlueHaittaIndex);

  const kaivuilmoitusSource = useRef(new VectorSource());
  // Subscribe to nested tyoalueet so effect re-runs when geometry (openlayersFeature) is hydrated.
  const watchedTyoalueet = useWatch({
    name: `applicationData.areas.${areaIndex}.tyoalueet`,
  }) as KaivuilmoitusAlue['tyoalueet'] | undefined;

  useEffect(() => {
    // Build feature list from latest watched tyoalueet (fallback to prop if watch returns undefined)
    const sourceTyoalueet = watchedTyoalueet ?? kaivuilmoitusAlue.tyoalueet;
    const applicationFeatures = sourceTyoalueet
      .map((tyoalue) => {
        const feature = tyoalue.openlayersFeature?.clone();
        if (!feature) return undefined; // ignore until hydration provides geometry
        const tyoalueHaittaIndex = getHaittaIndexForTyyppi(
          tyoalue.tormaystarkasteluTulos,
          haittojenHallintaTyyppi,
        );
        feature.setProperties(
          {
            liikennehaittaindeksi: tyoalueHaittaIndex,
          },
          true,
        );
        return feature;
      })
      .filter((f): f is Feature<Geometry> => Boolean(f));
    // Replace existing features only if counts differ or any geometry extent changed
    const existing = kaivuilmoitusSource.current.getFeatures();
    const extentSignature = (features: Feature<Geometry>[]) =>
      features
        .map((f) => {
          const geom = f.getGeometry();
          return geom ? geom.getExtent().join(',') : 'no-geom';
        })
        .sort((a, b) => a.localeCompare(b))
        .join('|');
    const newSig = extentSignature(applicationFeatures);
    const oldSig = extentSignature(existing);
    if (
      existing.length !== applicationFeatures.length ||
      newSig !== oldSig ||
      applicationFeatures.some((f) => !existing.includes(f))
    ) {
      kaivuilmoitusSource.current.clear(true);
      if (applicationFeatures.length) {
        kaivuilmoitusSource.current.addFeatures(applicationFeatures);
      }
    }
  }, [watchedTyoalueet, kaivuilmoitusAlue.tyoalueet, haittojenHallintaTyyppi]);

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
