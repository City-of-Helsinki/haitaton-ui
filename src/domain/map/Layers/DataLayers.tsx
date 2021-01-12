import React from 'react';
import { Vector as VectorSource } from 'ol/source';
import GeoJSON from 'ol/format/GeoJSON';
import VectorLayer from '../../../common/components/map/layers/VectorLayer';
import { useMapDataLayers } from '../hooks/useMapDataLayers';
import { CommonGeoJSON } from '../../../common/types/hanke';
import { epsg3857, epsg3879 } from '../../../common/components/map/constants';

const createSource = (data: CommonGeoJSON) => {
  const source = new VectorSource();
  source.addFeatures(
    new GeoJSON().readFeatures(data, {
      dataProjection: epsg3857,
      featureProjection: epsg3879,
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
