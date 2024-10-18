import React, { useCallback, useEffect, useState } from 'react';
import VectorSource, { VectorSourceEvent } from 'ol/source/Vector';
import { useTranslation } from 'react-i18next';
import { useFormContext } from 'react-hook-form';
import { Button, IconPlusCircle, Notification } from 'hds-react';
import { Box } from '@chakra-ui/react';
import { debounce } from 'lodash';
import { Feature, Map as OlMap, MapBrowserEvent } from 'ol';
import { Geometry, Point, Polygon } from 'ol/geom';
import { FeatureLike } from 'ol/Feature';
import { Coordinate } from 'ol/coordinate';
import { Layer } from 'ol/layer';
import { ModifyEvent } from 'ol/interaction/Modify';
import { createEditingStyle } from 'ol/style/Style';
import { polygon as turfPolygon, point as turfPoint } from '@turf/helpers';
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
import FeatureInfoOverlay from '../../map/components/FeatureInfoOverlay/FeatureInfoOverlay';
import FitSource from '../../map/components/interations/FitSource';
import isFeatureWithinFeatures from '../../map/utils/isFeatureWithinFeatures';
import { styleFunction } from '../../map/utils/geometryStyle';
import { OverlayProps } from '../../../common/components/map/types';
import AreaOverlay from '../../map/components/AreaOverlay/AreaOverlay';

type Props = {
  drawSource: VectorSource;
  showDrawControls: boolean;
  mapCenter?: Coordinate;
  onAddArea?: (feature: Feature<Geometry>) => void;
  onChangeArea?: (feature: Feature<Geometry>) => void;
  onCopyArea?: (feature: Feature<Geometry>) => void;
  children?: React.ReactNode;
  restrictDrawingToHankeAreas?: boolean;
  workTimesSet?: boolean;
};

export default function ApplicationMap({
  drawSource,
  showDrawControls,
  mapCenter,
  restrictDrawingToHankeAreas = false,
  workTimesSet,
  onAddArea,
  onChangeArea,
  onCopyArea,
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

  const hankeLayerFilter = useCallback((layer: Layer) => {
    return layer.getSource()?.get('sourceName') === 'hankeSource';
  }, []);

  const drawCondition = useCallback(
    (event: MapBrowserEvent<UIEvent>) => {
      const hankeFeaturesAtPixel = event.map.getFeaturesAtPixel(event.pixel, {
        layerFilter: hankeLayerFilter,
      });
      return isFeatureWithinFeatures(turfPoint(event.coordinate), hankeFeaturesAtPixel);
    },
    [hankeLayerFilter],
  );

  const drawFinishCondition = useCallback(
    (event: MapBrowserEvent<UIEvent>, feature: Feature) => {
      const hankeFeaturesAtPixel = event.map.getFeaturesAtPixel(event.pixel, {
        layerFilter: hankeLayerFilter,
      });
      return isFeatureWithinFeatures(
        turfPolygon((feature.getGeometry() as Polygon).getCoordinates()),
        hankeFeaturesAtPixel,
      );
    },
    [hankeLayerFilter],
  );

  const drawStyleFunction = useCallback(
    (map: OlMap, feature: FeatureLike) => {
      const point =
        feature.getGeometry()?.getType() === 'Point' ? (feature.getGeometry() as Point) : null;
      const pointPixel = point ? map.getPixelFromCoordinate(point.getCoordinates()) : null;
      const hankeFeaturesAtPixel = pointPixel
        ? map.getFeaturesAtPixel(pointPixel, {
            layerFilter: hankeLayerFilter,
          })
        : null;
      if (
        hankeFeaturesAtPixel &&
        point &&
        !isFeatureWithinFeatures(turfPoint(point.getCoordinates()), hankeFeaturesAtPixel)
      ) {
        // If cursor is not on top of hanke feature, return undefined so that
        // no point geometry is dispayed for current cursor position
        return undefined;
      }
      // Return default style
      const editingStyles = createEditingStyle();
      const geometry = feature.getGeometry();
      return geometry ? editingStyles[geometry.getType()] : [];
    },
    [hankeLayerFilter],
  );

  const handleModifyEnd = useCallback(
    (event: ModifyEvent, originalFeature: Feature | null, modifiedFeature: Feature) => {
      const hankeFeaturesAtPixel = event.mapBrowserEvent.map
        .getFeaturesAtPixel(event.mapBrowserEvent.pixel, {
          layerFilter: hankeLayerFilter,
        })
        .filter((hankeAreaFeature) => {
          const relatedHankeAreaId = modifiedFeature.get('relatedHankeAreaId');
          if (relatedHankeAreaId) {
            return hankeAreaFeature.get('id') === relatedHankeAreaId;
          }
          return true;
        });

      if (
        !isFeatureWithinFeatures(
          turfPolygon((modifiedFeature.getGeometry() as Polygon).getCoordinates()),
          hankeFeaturesAtPixel,
        ) &&
        originalFeature
      ) {
        // If mofified feature is going over hanke feature, revert back to original geometry
        modifiedFeature.setGeometry(originalFeature.getGeometry());
      }
    },
    [hankeLayerFilter],
  );

  function handleCopyArea(feature: Feature<Geometry>) {
    if (onCopyArea) {
      const newFeature = new Feature(feature.getGeometry()?.clone());
      onCopyArea(newFeature);
      setValue('geometriesChanged', true, { shouldDirty: true });
    }
  }

  return (
    <div>
      <div className={styles.mapContainer}>
        <Map zoom={9} center={mapCenter} mapClassName={styles.mapContainer__inner}>
          {mapTileLayers.kantakartta.visible && <Kantakartta />}
          {mapTileLayers.ortokartta.visible && <Ortokartta opacity={ortoLayerOpacity} />}

          <AddressSearchContainer position={{ top: '1rem', left: '1rem' }} zIndex={101} />

          {children}

          <VectorLayer source={drawSource} zIndex={2} className="drawLayer" style={styleFunction} />

          <OverviewMapControl />

          <FitSource source={drawSource} fitOnce />

          <FeatureInfoOverlay
            render={(feature) => {
              const overlayProperties = feature?.get('overlayProps') as OverlayProps | undefined;
              let copyAreaElement = null;
              if (overlayProperties?.enableCopyArea && onCopyArea) {
                copyAreaElement = workTimesSet ? (
                  <Button
                    theme="coat"
                    size="small"
                    iconLeft={<IconPlusCircle />}
                    onClick={() => handleCopyArea(feature as Feature<Geometry>)}
                  >
                    {t('hakemus:buttons:copyWorkArea')}
                  </Button>
                ) : (
                  <Box as="p" fontSize="var(--fontsize-body-s)">
                    {t('hakemus:labels:setWorkTimesToCopyArea')}
                  </Box>
                );
              }
              return (
                <AreaOverlay overlayProps={overlayProperties} copyAreaElement={copyAreaElement} />
              );
            }}
          />

          <Controls>
            {showDrawControls && (
              <DrawModule
                onSelfIntersectingPolygon={handleSelfIntersectingPolygon}
                drawCondition={restrictDrawingToHankeAreas ? drawCondition : undefined}
                drawFinishCondition={restrictDrawingToHankeAreas ? drawFinishCondition : undefined}
                drawStyleFunction={restrictDrawingToHankeAreas ? drawStyleFunction : undefined}
                handleModifyEnd={restrictDrawingToHankeAreas ? handleModifyEnd : undefined}
              />
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
