import React, { useState } from 'react';
import GeoJSON from 'ol/format/GeoJSON';
import { Vector as VectorSource } from 'ol/source';
import { Style, Fill, Stroke } from 'ol/style';
import { useQuery } from 'react-query';
import Map from '../../common/components/map/Map';
import Controls from '../../common/components/map/controls/Controls';
import LayerControl from '../../common/components/map/controls/LayerControl';
import VectorLayer from '../../common/components/map/layers/VectorLayer';
import Kantakartta from './Layers/Kantakartta';
import DataLayers from './Layers/DataLayers';
import Ortokartta from './Layers/Ortokartta';
import styles from './Map.module.scss';
import { useMapDataLayers } from './hooks/useMapDataLayers';
import { MapDataLayerKey } from './types';
import { HankeData } from '../types/hanke';
import api from '../../common/utils/api';

// Temporary reference style implementation. Actual colors
// are chosen based on törmäysanalyysi
const geometryStyle = {
  Blue: new Style({
    stroke: new Stroke({
      color: 'black',
      width: 1,
    }),
    fill: new Fill({
      color: 'rgba(36, 114, 198, 1)',
    }),
  }),
};

const getProjectsWithGeometry = async () => {
  const response = await api.get<HankeData[]>('/hankkeet', {
    params: { geometry: true },
  });
  return response;
};

const useProjectsWithGeometry = () => useQuery(['projectsWithGeometry'], getProjectsWithGeometry);

const HankeMap: React.FC = () => {
  const { isLoading, isError, data: projectsWithGeometryResponse } = useProjectsWithGeometry();
  const { dataLayers, toggleDataLayer } = useMapDataLayers();

  const [zoom] = useState(0);
  const [showKantakartta, setShowKantakartta] = useState(true);
  const [showOrtokartta, setShowOrtokartta] = useState(false);

  const toggleTileLayer = () => {
    if (showKantakartta) {
      setShowOrtokartta(true);
      setShowKantakartta(false);
    } else {
      setShowOrtokartta(false);
      setShowKantakartta(true);
    }
  };

  return (
    <>
      <div
        className={styles.mapContainer}
        style={{ width: '100%', height: '100%', position: 'absolute' }}
      >
        <Map zoom={zoom} mapClassName={styles.mapContainer__inner}>
          {showKantakartta && <Kantakartta />}
          {showOrtokartta && <Ortokartta />}
          <DataLayers />

          {(!isLoading || isError) &&
          projectsWithGeometryResponse &&
          Array.isArray(projectsWithGeometryResponse.data) ? (
            projectsWithGeometryResponse.data
              .filter((hanke) => {
                return hanke.geometriat; // remove projects with geometry as null
              })
              .map((hanke) => {
                return (
                  <VectorLayer
                    key={hanke.geometriat?.id}
                    source={
                      new VectorSource({
                        // TS fails interpreting filter. Added type guard
                        features: hanke.geometriat
                          ? new GeoJSON().readFeatures(hanke.geometriat.featureCollection)
                          : [],
                      })
                    }
                    zIndex={100}
                    className="hankeGeometryLayer"
                    style={geometryStyle.Blue}
                  />
                );
              })
          ) : (
            <></>
          )}

          <Controls>
            <LayerControl
              tileLayers={[
                {
                  id: 'ortokartta',
                  label: 'Ortokartta',
                  onClick: toggleTileLayer,
                  checked: showOrtokartta,
                },
                {
                  id: 'kantakartta',
                  label: 'Kantakartta',
                  onClick: toggleTileLayer,
                  checked: showKantakartta,
                },
              ]}
              dataLayers={Object.values(dataLayers)}
              onClickDataLayer={(key: MapDataLayerKey) => toggleDataLayer(key)}
            />
          </Controls>
        </Map>
      </div>
    </>
  );
};

export default HankeMap;
