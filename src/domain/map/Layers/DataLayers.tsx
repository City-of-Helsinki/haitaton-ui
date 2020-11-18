import React from 'react';
import { Vector as VectorSource } from 'ol/source';
import GeoJSON from 'ol/format/GeoJSON';
import VectorLayer from '../../../common/components/map/layers/VectorLayer';
import { useMapDataLayers } from '../hooks/useMapDataLayers';
import { CommonGeoJSON } from '../../../common/types/hanke';

const createSource = (data: CommonGeoJSON) => {
  const source = new VectorSource();
  source.addFeatures(
    new GeoJSON().readFeatures(data, {
      featureProjection: 'EPSG:3857',
    })
  );

  return source;
};

const DataLayers = () => {
  const { dataLayers } = useMapDataLayers();

  return (
    <>
      {Object.values(dataLayers).map((layer) =>
        layer.visible ? (
          <VectorLayer
            key={layer.key}
            source={createSource(layer.data)}
            zIndex={3}
            className={`datalayer-${layer.key}`}
          />
        ) : null
      )}
    </>
  );
};

export default DataLayers;
