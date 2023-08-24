import { useContext, useEffect } from 'react';
import OLTileLayer from 'ol/layer/Tile';
import { TileWMS } from 'ol/source';
import { MapBrowserEvent, View } from 'ol';
import { OverviewMap } from 'ol/control';
import clsx from 'clsx';
import { DragZoom } from 'ol/interaction';
import MapContext from '../MapContext';
import { projection } from '../utils';
import './OverviewMapControl.scss';

type Props = {
  /**
   * Additional CSS classes for OverviewMap control
   */
  className?: string;
};

/**
 * Control with a map acting as an overview map for another defined map
 */
const OverviewMapControl: React.FC<React.PropsWithChildren<Props>> = ({ className }) => {
  const { map } = useContext(MapContext);

  useEffect(() => {
    if (!map) return;

    const overviewMapTileLayer = new OLTileLayer({
      source: new TileWMS({
        url: 'https://kartta.hel.fi/ws/geoserver/avoindata/wms',
        params: {
          LAYERS: 'Opaskartta_Helsinki',
          FORMAT: 'image/jpeg',
          WIDTH: 256,
          HEIGHT: 256,
          VERSION: '1.1.1',
          TRANSPARENT: 'false',
        },
        projection: projection || undefined,
        cacheSize: 1000,
        hidpi: false,
        serverType: 'geoserver',
        transition: 0,
      }),
    });

    const overviewMapControl = new OverviewMap({
      className: clsx(['ol-overviewmap', 'ol-custom-overviewmap', className]),
      layers: [overviewMapTileLayer],
      collapseLabel: '\u00BB',
      label: '\u00AB',
      collapsed: false,
      view: new View({
        zoom: 3,
        minZoom: 2,
        maxZoom: 6,
        projection: projection || undefined,
      }),
    });

    map.addControl(overviewMapControl);
    map.addInteraction(new DragZoom());

    // Add possibility to move map by clicking a point
    // on overview map
    function overviewMapClick(e: MapBrowserEvent<UIEvent>) {
      map?.getView().setCenter(e.coordinate);
    }
    overviewMapControl.getOverviewMap().on('click', overviewMapClick);

    // eslint-disable-next-line
    return function cleanup() {
      overviewMapControl.getOverviewMap().un('click', overviewMapClick);
      map.removeControl(overviewMapControl);
    };
  }, [map, className]);

  return null;
};

export default OverviewMapControl;
