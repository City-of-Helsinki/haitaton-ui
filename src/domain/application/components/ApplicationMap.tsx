import React, { useEffect, useState } from 'react';
import VectorSource, { VectorSourceEvent } from 'ol/source/Vector';
import { useTranslation } from 'react-i18next';
import { useFormContext } from 'react-hook-form';
import { Notification } from 'hds-react';
import { debounce } from 'lodash';
import { Feature } from 'ol';
import { Geometry } from 'ol/geom';
import { FeatureLike } from 'ol/Feature';
import { Coordinate } from 'ol/coordinate';
import Map from '../../../common/components/map/Map';
import Kantakartta from '../../map/components/Layers/Kantakartta';
import Ortokartta from '../../map/components/Layers/Ortokartta';
import AddressSearchContainer from '../../map/components/AddressSearch/AddressSearchContainer';
import VectorLayer from '../../../common/components/map/layers/VectorLayer';
import OverviewMapControl from '../../../common/components/map/controls/OverviewMapControl';
import Controls from '../../../common/components/map/controls/Controls';
import DrawModule from '../../../common/components/map/modules/draw/DrawModule';
import LayerControl from '../../../common/components/map/controls/LayerControl';
import { useMapDataLayers } from '../../map/hooks/useMapLayers';
import { MapTileLayerId } from '../../map/types';
import styles from './ApplicationMap.module.scss';
import useForceUpdate from '../../../common/hooks/useForceUpdate';
import FeatureHoverBox from '../../map/components/FeatureHoverBox/FeatureHoverBox';
import FitSource from '../../map/components/interations/FitSource';

type Props = {
  drawSource: VectorSource;
  showDrawControls: boolean;
  mapCenter?: Coordinate;
  onAddArea?: (feature: Feature<Geometry>) => void;
  onChangeArea?: (feature: Feature<Geometry>) => void;
  children?: React.ReactNode;
};

export default function ApplicationMap({
  drawSource,
  showDrawControls,
  mapCenter,
  onAddArea,
  onChangeArea,
  children,
}: Readonly<Props>) {
  const { t } = useTranslation();
  const forceUpdate = useForceUpdate();
  const [featuresLoaded, setFeaturesLoaded] = useState(false);
  const {
    setValue,
    formState: { errors },
  } = useFormContext();

  const { mapTileLayers, toggleMapTileLayer } = useMapDataLayers();
  const ortoLayerOpacity = mapTileLayers.kantakartta.visible ? 0.5 : 1;

  useEffect(() => {
    function handleAddFeature(e: VectorSourceEvent<FeatureLike>) {
      if (e.feature && onAddArea) {
        setValue('geometriesChanged', true, { shouldDirty: true });
        onAddArea(e.feature as Feature<Geometry>);
      }
    }

    const handleChangeFeature = debounce((e: VectorSourceEvent<FeatureLike>) => {
      forceUpdate();
      if (featuresLoaded) {
        // When areas are modified set geometriesChanged with shouldDirty option
        // so that when changing form page application is saved
        setValue('geometriesChanged', true, { shouldDirty: true });
        if (e.feature && onChangeArea) {
          onChangeArea(e.feature as Feature<Geometry>);
        }
      }
    }, 100);

    drawSource.on('addfeature', handleAddFeature);
    drawSource.on('changefeature', handleChangeFeature);
    drawSource.once('featuresloadstart', () => {
      setFeaturesLoaded(true);
    });

    return function cleanup() {
      handleChangeFeature.cancel();
      drawSource.un('addfeature', handleAddFeature);
      drawSource.un('changefeature', handleChangeFeature);
    };
  }, [drawSource, onAddArea, onChangeArea, forceUpdate, setValue, featuresLoaded]);

  function handleSelfIntersectingPolygon(feature: Feature<Geometry> | null) {
    setValue('selfIntersectingPolygon', Boolean(feature), { shouldValidate: true });
  }

  return (
    <div>
      <div className={styles.mapContainer}>
        <Map zoom={9} center={mapCenter} mapClassName={styles.mapContainer__inner}>
          {mapTileLayers.kantakartta.visible && <Kantakartta />}
          {mapTileLayers.ortokartta.visible && <Ortokartta opacity={ortoLayerOpacity} />}

          <AddressSearchContainer position={{ top: '1rem', left: '1rem' }} zIndex={101} />

          {children}

          <VectorLayer source={drawSource} zIndex={2} className="drawLayer" />

          <OverviewMapControl />

          <FitSource source={drawSource} fitOnce />

          <FeatureHoverBox
            render={(featureWithPixel) => {
              const areaName = featureWithPixel.feature.get('areaName');
              return areaName ? <p>{areaName}</p> : null;
            }}
          />

          <Controls>
            {showDrawControls && (
              <DrawModule onSelfIntersectingPolygon={handleSelfIntersectingPolygon} />
            )}
            <LayerControl
              tileLayers={Object.values(mapTileLayers)}
              onClickTileLayer={(id: MapTileLayerId) => toggleMapTileLayer(id)}
            />
          </Controls>
        </Map>
      </div>

      {errors.selfIntersectingPolygon && (
        <Notification
          type="error"
          label={t('form:errors:selfIntersectingArea')}
          notificationAriaLabel={t('common:components:notification:notification')}
          autoClose={false}
          closeButtonLabelText={`${t('common:components:notification:closeButtonLabelText')}`}
          style={{ marginBottom: 'var(--spacing-s)' }}
        />
      )}
    </div>
  );
}
