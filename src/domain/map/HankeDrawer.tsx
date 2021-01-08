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
import Ortokartta from './Layers/Ortokartta';
import styles from './Map.module.scss';
import { useMapDataLayers } from './hooks/useMapDataLayers';
import { MapDataLayerKey } from './types';
import { formatFeaturesToHankeGeoJSON } from './utils';

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

  const [drawSource] = useState<VectorSource>(
    new VectorSource({
      format: new GeoJSON(),
    })
  );
  const [zoom] = useState(0);
  const [showKantakartta, setShowKantakartta] = useState(true);
  const [showOrtokartta, setShowOrtokartta] = useState(false);

  useEffect(() => {
    drawSource.on('addfeature', () => {
      const drawGeometry = formatFeaturesToHankeGeoJSON(drawSource.getFeatures());
      handleUpdateGeometryState(drawGeometry);
    });
  }, []);

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
      <div className={styles.mapContainer} style={{ width: '100%', height: 500 }}>
        <Map zoom={zoom} mapClassName={styles.mapContainer__inner}>
          <DrawIntercation source={drawSource} />
          {showKantakartta && <Kantakartta />}
          {showOrtokartta && <Ortokartta />}
          <DataLayers />
          <VectorLayer source={drawSource} zIndex={100} className="drawLayer" />
          <Controls>
            <DrawControl />
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
