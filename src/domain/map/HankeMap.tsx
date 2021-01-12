import React, { useState } from 'react';
import GeoJSON from 'ol/format/GeoJSON';
import { Vector as VectorSource } from 'ol/source';
import { Style, Fill, Stroke } from 'ol/style';
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

type Props = {
  hankeTunnus: string | undefined;
};

const HankeMap: React.FC<Props> = ({ hankeTunnus }) => {
  console.log(hankeTunnus);
  const { dataLayers, toggleDataLayer } = useMapDataLayers();

  const [zoom] = useState(0);
  const [showKantakartta, setShowKantakartta] = useState(true);
  const [showOrtokartta, setShowOrtokartta] = useState(false);

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

  const toggleTileLayer = () => {
    if (showKantakartta) {
      setShowOrtokartta(true);
      setShowKantakartta(false);
    } else {
      setShowOrtokartta(false);
      setShowKantakartta(true);
    }
  };

  const sampleHankeGeometry = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              [25496585.89, 6673427.46],
              [25496610.43, 6673428.77],
              [25496620.93, 6673268.43],
              [25496675.09, 6673267.37],
              [25496682.14, 6673156.24],
              [25496612.66, 6673153.97],
              [25496593.98, 6673283.58],
              [25496585.89, 6673427.46],
            ],
          ],
        },
        properties: null,
      },
      {
        type: 'Feature',
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              [25496495.01, 6673320.49],
              [25496588.89, 6673329.8],
              [25496586.92, 6673344.38],
              [25496493.25, 6673333.73],
              [25496495.01, 6673320.49],
            ],
          ],
        },
        properties: null,
      },
      {
        type: 'Feature',
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              [25496867.01, 6673084.64],
              [25496859.74, 6673218.27],
              [25496918.82, 6673221.91],
              [25496923.86, 6673092.14],
              [25496867.01, 6673084.64],
            ],
          ],
        },
        properties: null,
      },
    ],
    crs: {
      type: 'name',
      properties: {
        name: 'urn:ogc:def:crs:EPSG::3879',
      },
    },
  };

  return (
    <>
      <div className={styles.mapContainer} style={{ width: '100%', height: 500 }}>
        <Map zoom={zoom} mapClassName={styles.mapContainer__inner}>
          {showKantakartta && <Kantakartta />}
          {showOrtokartta && <Ortokartta />}
          <DataLayers />
          <VectorLayer
            source={new VectorSource({ features: new GeoJSON().readFeatures(sampleHankeGeometry) })}
            zIndex={90}
            className="hankeGeometryLayer"
            style={geometryStyle.Blue}
          />
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
