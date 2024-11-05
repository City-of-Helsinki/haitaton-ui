import { useCallback, useContext, useEffect, useRef } from 'react';
import { Button, IconMinusCircleFill, IconPlusCircle } from 'hds-react';
import { useTranslation } from 'react-i18next';
import VectorSource from 'ol/source/Vector';
import { Select } from 'ol/interaction';
import VectorLayer from 'ol/layer/Vector';
import { Feature, MapBrowserEvent } from 'ol';
import { Fill, Stroke, Style } from 'ol/style';
import { never } from 'ol/events/condition';
import Map from '../../../../common/components/map/Map';
import OverviewMapControl from '../../../../common/components/map/controls/OverviewMapControl';
import DrawProvider from '../../../../common/components/map/modules/draw/DrawProvider';
import { OverlayProps } from '../../../../common/components/map/types';
import { HankeData } from '../../../types/hanke';
import AddressSearchContainer from '../AddressSearch/AddressSearchContainer';
import AreaOverlay from '../AreaOverlay/AreaOverlay';
import FeatureInfoOverlay from '../FeatureInfoOverlay/FeatureInfoOverlay';
import HankeLayer from '../Layers/HankeLayer';
import styles from './JohtoselvitysSelectionMap.module.scss';
import Kantakartta from '../Layers/Kantakartta';
import { HankkeenHakemus } from '../../../application/types/application';
import HakemusLayer from '../Layers/HakemusLayer';
import { styleFunction } from '../../utils/geometryStyle';
import { LIIKENNEHAITTA_STATUS } from '../../../common/utils/liikennehaittaindeksi';
import MapContext from '../../../../common/components/map/MapContext';

type JohtoselvitysSelectProps = {
  selectedJohtoselvitysTunnukset: string[];
  onSelectFeature: (feature?: Feature) => void;
};

function JohtoselvitysSelect({
  selectedJohtoselvitysTunnukset,
  onSelectFeature,
}: Readonly<JohtoselvitysSelectProps>) {
  const { map } = useContext(MapContext);
  const selectInteraction = useRef<Select>(
    new Select({
      style: new Style({
        fill: new Fill({
          color: 'rgba(0, 0, 94, 0.8)',
        }),
        stroke: new Stroke({ color: 'black', width: 3 }),
      }),
      condition: never,
    }),
  );

  useEffect(() => {
    if (!map) return;
    const select = selectInteraction.current;

    map.addInteraction(select);

    return function cleanUp() {
      map.removeInteraction(select);
    };
  }, [map]);

  useEffect(() => {
    // Add selected features to selected collection so they are highlighted
    map?.once('rendercomplete', () => {
      const selectedJohtoselvitysFeatures = map
        .getAllLayers()
        .filter((layer) => layer instanceof VectorLayer)
        .flatMap((layer) => (layer.getSource() as VectorSource).getFeatures())
        .filter((feature) => {
          return selectedJohtoselvitysTunnukset.includes(feature.get('applicationIdentifier'));
        });
      selectInteraction.current.getFeatures().extend(selectedJohtoselvitysFeatures ?? []);
    });

    // Select/deselect features that are clicked
    function handleMapClick(event: MapBrowserEvent<UIEvent>) {
      const features = map?.getFeaturesAtPixel(event.pixel);
      if (features) {
        const feature = features[0] as Feature;
        onSelectFeature(feature);
      }
    }

    map?.on('singleclick', handleMapClick);

    return function cleanup() {
      map?.un('singleclick', handleMapClick);
    };
  }, [map, selectInteraction, selectedJohtoselvitysTunnukset, onSelectFeature]);

  return null;
}

type JohtoselvitysSelectionMapProps = {
  hankeData: HankeData;
  hankkeenHakemukset: HankkeenHakemus[];
  selectedJohtoselvitysTunnukset: string[];
  onSelectJohtoselvitys: (tunnukset: string[]) => void;
};

export default function JohtoselvitysSelectionMap({
  hankeData,
  hankkeenHakemukset,
  selectedJohtoselvitysTunnukset,
  onSelectJohtoselvitys,
}: Readonly<JohtoselvitysSelectionMapProps>) {
  const { t } = useTranslation();
  const vectorSource = useRef(new VectorSource());
  const johtoselvitykset = hankkeenHakemukset.filter(
    (hakemus) =>
      hakemus.applicationType === 'CABLE_REPORT' && Boolean(hakemus.applicationIdentifier),
  );

  const handleFeatureSelection = useCallback(
    (feature?: Feature) => {
      if (feature) {
        const applicationIdentifier = feature.get('applicationIdentifier') as string | undefined;
        if (applicationIdentifier) {
          const tunnusSelected = selectedJohtoselvitysTunnukset.includes(applicationIdentifier);
          onSelectJohtoselvitys(
            tunnusSelected
              ? selectedJohtoselvitysTunnukset.filter((tunnus) => tunnus !== applicationIdentifier)
              : selectedJohtoselvitysTunnukset.concat([applicationIdentifier]),
          );
        }
      }
    },
    [onSelectJohtoselvitys, selectedJohtoselvitysTunnukset],
  );

  return (
    <div className={styles.mapContainer}>
      <Map zoom={9} mapClassName={styles.mapContainer__inner} showAttribution={false}>
        <Kantakartta />
        <AddressSearchContainer position={{ top: '1rem', left: '1rem' }} zIndex={2} />
        <OverviewMapControl className={styles.overviewMap} />
        <JohtoselvitysSelect
          selectedJohtoselvitysTunnukset={selectedJohtoselvitysTunnukset}
          onSelectFeature={handleFeatureSelection}
        />
        <DrawProvider source={vectorSource.current}>
          <FeatureInfoOverlay
            render={(feature) => {
              const overlayProperties = feature?.get('overlayProps') as OverlayProps | undefined;
              const applicationIdentifier = feature?.get('applicationIdentifier') as
                | string
                | undefined;

              let selectionButton = null;
              if (applicationIdentifier) {
                const selectionButtonType = selectedJohtoselvitysTunnukset.includes(
                  applicationIdentifier,
                )
                  ? 'remove'
                  : 'add';

                selectionButton = (
                  <Button
                    size="small"
                    theme="coat"
                    iconLeft={
                      selectionButtonType === 'remove' ? (
                        <IconMinusCircleFill />
                      ) : (
                        <IconPlusCircle />
                      )
                    }
                    onClick={() => handleFeatureSelection(feature as Feature)}
                  >
                    {selectionButtonType === 'remove'
                      ? t('hakemus:buttons:removeSelection')
                      : t('hakemus:buttons:selectCableReport')}
                  </Button>
                );
              }
              return <AreaOverlay overlayProps={overlayProperties}>{selectionButton}</AreaOverlay>;
            }}
          />
        </DrawProvider>
        {/* Hanke areas */}
        <HankeLayer hankeData={[hankeData]} fitSource />
        {/* Johtoselvitys areas */}
        {johtoselvitykset.map((hakemus) => (
          <HakemusLayer
            hakemusId={hakemus.id!}
            layerStyle={styleFunction}
            featureProperties={{
              statusKey: LIIKENNEHAITTA_STATUS.LAVENDER_BLUE,
              applicationIdentifier: hakemus.applicationIdentifier,
            }}
          />
        ))}
      </Map>
    </div>
  );
}
