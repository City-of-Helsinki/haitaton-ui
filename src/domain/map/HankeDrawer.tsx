import React, { useState } from 'react';
import { Vector as VectorSource } from 'ol/source';
import GeoJSON from 'ol/format/GeoJSON';
import Map from '../../common/components/map/Map';
import Controls from '../../common/components/map/controls/Controls';
import LayerControl from '../../common/components/map/controls/LayerControl';
import DrawControl from '../../common/components/map/controls/DrawControl';
import VectorLayer from '../../common/components/map/layers/VectorLayer';
import DrawIntercation from '../../common/components/map/interactions/Draw';
import { useDatalayers } from './hooks/useDatalayers';
import Kantakartta from './Layers/Kantakartta';
import HSL from './Layers/HSL';
import styles from './Map.module.scss';

const HankeDrawer: React.FC = () => {
  const [drawSource] = useState<VectorSource>(new VectorSource());
  const [center] = useState([2776000, 8438000]);
  const [zoom] = useState(15);
  const [showKantakartta, setShowKantakartta] = useState(true);
  const [showHSL, setShowHSL] = useState(false);
  const { datalayers } = useDatalayers();

  const toggleTileLayer = () => {
    if (showKantakartta) {
      setShowHSL(true);
      setShowKantakartta(false);
    } else {
      setShowHSL(false);
      setShowKantakartta(true);
    }
  };

  const fooSource = new VectorSource();
  drawSource.addFeatures(
    new GeoJSON().readFeatures(datalayers.CYCLING_ROADS.data, {
      featureProjection: 'EPSG:3857', // EPSG:3879
    })
  );

  return (
    <div className={styles.mapContainer}>
      <Map center={center} zoom={zoom} mapClassName={styles.mapContainer__inner}>
        <DrawIntercation source={drawSource} />
        {showKantakartta && <VectorLayer source={fooSource} zIndex={3} />}
        {showKantakartta && <Kantakartta />}
        {showHSL && <HSL />}
        <VectorLayer source={drawSource} zIndex={100} />
        <Controls>
          <DrawControl />
          <LayerControl
            tileLayers={[
              { id: 'hsl', label: 'HSL', onClick: toggleTileLayer, checked: showHSL },
              {
                id: 'kantakartta',
                label: 'Kantakartta',
                onClick: toggleTileLayer,
                checked: showKantakartta,
              },
            ]}
          />
        </Controls>
      </Map>
    </div>
  );
};

export default HankeDrawer;
