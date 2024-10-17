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

/**
 * Find all features that intersect with the pointer when user moves the pointer on the map,
 * and returns those features along with the map pixel.
 * Can be used for example to render overlay on top of hovered features.
 */
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
    }, 5);

    map?.on('pointermove', handlePointerMove);

    return function cleanup() {
      map?.un('pointermove', handlePointerMove);
    };
  }, [map]);

  return featuresWithPixel;
}
