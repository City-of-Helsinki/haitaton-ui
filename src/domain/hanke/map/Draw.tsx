import React, { useState } from 'react';
import { Vector as VectorSource } from 'ol/source';
import Map from '../../../common/components/map/Map';
import Controls from '../../../common/components/map/controls/Controls';
import TileLayers from '../../../common/components/map/controls/TileLayers';
import VectorLayer from '../../../common/components/map/layers/VectorLayer';
import DrawIntercation from '../../../common/components/map/interactions/Draw';
import Kantakartta from './Layers/Kantakartta';
import HSL from './Layers/HSL';
import styles from './Map.module.scss';

const DrawMap: React.FC = () => {
  const [drawSource] = useState<VectorSource>(new VectorSource());
  const [center] = useState([2776000, 8438000]);
  const [zoom] = useState(9);
  const [showKantakartta, setShowKantakartta] = useState(true);
  const [showHSL, setShowHSL] = useState(false);

  const toggleTileLayer = () => {
    if (showKantakartta) {
      setShowHSL(true);
      setShowKantakartta(false);
    } else {
      setShowHSL(false);
      setShowKantakartta(true);
    }
  };

  return (
    <div className={styles.mapContainer}>
      <Map center={center} zoom={zoom} mapClassName={styles.mapContainer__inner}>
        <DrawIntercation source={drawSource} />
        {showKantakartta && <Kantakartta />}
        {showHSL && <HSL />}
        <VectorLayer source={drawSource} zIndex={100} />
        <Controls>
          <TileLayers
            layers={[
              { id: 'hsl', onClick: toggleTileLayer, checked: showHSL },
              { id: 'kantakartta', onClick: toggleTileLayer, checked: showKantakartta },
            ]}
          />
        </Controls>
      </Map>
    </div>
  );
};

export default DrawMap;
