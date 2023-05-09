import { useContext, useEffect, useState } from 'react';
import { debounce } from 'lodash';
import { MapBrowserEvent } from 'ol';
import { FeatureLike } from 'ol/Feature';
import { Pixel } from 'ol/pixel';
import MapContext from '../../../common/components/map/MapContext';
import { MapInstance } from '../../../common/components/map/types';

export interface FeatureWithPixel {
  feature: FeatureLike;
  featurePixel: Pixel;
}

export default function useFeaturesAtPixel() {
  const { map } = useContext(MapContext);
  const [featuresWithPixel, setFeaturesWithPixel] = useState<FeatureWithPixel[]>([]);

  function handleFeaturesAtPixel(mapInstance: MapInstance, event: MapBrowserEvent<UIEvent>) {
    setFeaturesWithPixel([]);

    const features = mapInstance?.getFeaturesAtPixel(event.pixel).map((featureLike) => {
      return { feature: featureLike, featurePixel: event.pixel };
    });

    if (features !== undefined) {
      setFeaturesWithPixel(features);
    }
  }

  useEffect(() => {
    const handlePointerMove = debounce((event: MapBrowserEvent<UIEvent>) => {
      if (!event.dragging) {
        handleFeaturesAtPixel(map, event);
      }
    }, 10);

    map?.on('pointermove', handlePointerMove);

    return function cleanup() {
      map?.un('pointermove', handlePointerMove);
    };
  }, [map]);

  return featuresWithPixel;
}
