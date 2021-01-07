import React, { useState, useEffect } from 'react';
import GeoJSON from 'ol/format/GeoJSON';
import { Vector as VectorSource } from 'ol/source';
import Map from '../../common/components/map/Map';
import Controls from '../../common/components/map/controls/Controls';
import LayerControl from '../../common/components/map/controls/LayerControl';
import DrawControl from '../../common/components/map/controls/DrawControl';
import VectorLayer from '../../common/components/map/layers/VectorLayer';
import DrawIntercation from '../../common/components/map/interactions/Draw';
import Kantakartta from './Layers/Kantakartta';
import DataLayers from './Layers/DataLayers';
import HSL from './Layers/HSL';
import styles from './Map.module.scss';
import { useMapDataLayers } from './hooks/useMapDataLayers';
import { MapDataLayerKey } from './types';
import { formatFeaturesToHankeGeoJSON } from './utils';
import { projection } from '../../common/components/map/utils';

const drawVectorSource = new VectorSource({
  format: new GeoJSON({
    dataProjection: projection,
    featureProjection: projection,
  }),
});

type Props = {
  hankeTunnus: string | undefined;
};

const HankeDrawer: React.FC<Props> = ({ hankeTunnus }) => {
  const {
    dataLayers,
    toggleDataLayer,
    handleSaveGeometry,
    handleUpdateGeometryState,
  } = useMapDataLayers();

  const [drawSource] = useState<VectorSource>(drawVectorSource);
  const [zoom] = useState(0);
  const [showKantakartta, setShowKantakartta] = useState(true);
  const [showHSL, setShowHSL] = useState(false);

  useEffect(() => {
    drawSource.on('addfeature', () => {
      const drawGeometry = formatFeaturesToHankeGeoJSON(drawSource.getFeatures());
      handleUpdateGeometryState(drawGeometry);
    });
  }, []);

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
    <>
      <div className={styles.mapContainer} style={{ width: '100%', height: 500 }}>
        <Map zoom={zoom} mapClassName={styles.mapContainer__inner}>
          <DrawIntercation source={drawSource} />
          {showKantakartta && <Kantakartta />}
          {showHSL && <HSL />}
          <DataLayers />
          <VectorLayer source={drawSource} zIndex={100} className="drawLayer" />
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
              dataLayers={Object.values(dataLayers)}
              onClickDataLayer={(key: MapDataLayerKey) => toggleDataLayer(key)}
            />
          </Controls>
        </Map>
      </div>
      {drawSource.getFeatures().length > 0 && hankeTunnus && (
        <button
          onClick={() => handleSaveGeometry(hankeTunnus)}
          type="button"
          data-testid="save-geometry-button"
        >
          Tallenna geometria
        </button>
      )}
    </>
  );
};

export default HankeDrawer;
