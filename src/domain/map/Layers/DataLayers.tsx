import React from 'react';
import { Vector as VectorSource } from 'ol/source';
import GeoJSON from 'ol/format/GeoJSON';
import VectorLayer from '../../../common/components/map/layers/VectorLayer';
import { useDatalayers } from '../hooks/useDatalayers';

// eslint-disable-next-line
const createSource = (data: any) => {
  const source = new VectorSource();
  source.addFeatures(
    new GeoJSON().readFeatures(data, {
      featureProjection: 'EPSG:3857', // EPSG:3879
    })
  );

  return source;
};

const DataLayers = () => {
  const { datalayers } = useDatalayers();

  return (
    <>
      {Object.values(datalayers).map((layer) => {
        return layer.visible ? (
          <VectorLayer key={layer.id} source={createSource(layer.data)} zIndex={3} />
        ) : null;
      })}
    </>
  );
};

export default DataLayers;
