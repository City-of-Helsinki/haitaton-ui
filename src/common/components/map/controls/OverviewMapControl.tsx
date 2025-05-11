import React, { useContext, useEffect } from 'react';
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

    let overviewCtrl: OverviewMap;
    let dragZoom: DragZoom;

    // Add possibility to move map by clicking a point
    // on overview map
    function overviewMapClick(e: MapBrowserEvent<UIEvent>) {
      map?.getView().setCenter(e.coordinate);
    }

    const initOverview = () => {
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
      dragZoom = new DragZoom();
      map.addInteraction(dragZoom);

      const overviewMap = overviewMapControl.getOverviewMap();
      overviewMap.on('click', overviewMapClick);
    };

    map.once('rendercomplete', initOverview);

    return () => {
      if (overviewCtrl) {
        const ov = overviewCtrl.getOverviewMap();
        ov.un('click', overviewMapClick);
        ov.dispose();
        map.removeControl(overviewCtrl);
      }
      if (dragZoom) {
        map.removeInteraction(dragZoom);
      }
    };
  }, [map, className]);

  return null;
};

export default OverviewMapControl;
