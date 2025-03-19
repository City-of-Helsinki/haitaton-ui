import React, { useEffect, useContext, useState } from 'react';
import { format } from 'date-fns';
import { MapBrowserEvent } from 'ol';
import MapContext from '../../MapContext';
import { MapInstance, OverlayProps } from '../../types';
import HoverContext, { HankeAlueHoverData } from './HoverContext';

const GeometryHover: React.FC<React.PropsWithChildren<unknown>> = ({ children }) => {
  const { map } = useContext(MapContext);
  const [hoverPosition, setHoverPosition] = useState([0, 0]);
  const [hoveredHankeAreaData, setHoveredHankeData] = useState([] as HankeAlueHoverData[]);

  const highlightHankeOnPixel = (mapInstance: MapInstance, evt: MapBrowserEvent<UIEvent>) => {
    setHoveredHankeData([]);
    const hankeAreaDataAtPixel: HankeAlueHoverData[] = [];
    const foundFeatures = mapInstance?.getFeaturesAtPixel(evt.pixel) || [];
    if (foundFeatures?.length > 0) {
      foundFeatures?.forEach((feature) => {
        const hankeTunnus = feature?.get('hankeTunnus') as string;
        const hankeName = feature?.get('hankeName') as string;
        const areaName = feature?.get('areaName') as string;
        const { startDate, endDate } = feature?.get('overlayProps') as OverlayProps;

        hankeAreaDataAtPixel.push({
          hankeName,
          hankeTunnus,
          areaName,
          startDate: startDate && format(new Date(startDate), 'dd.MM.yyyy'),
          endDate: endDate && format(new Date(endDate), 'dd.MM.yyyy'),
        });
      });
    }
    setHoveredHankeData(hankeAreaDataAtPixel);
    setHoverPosition(evt.pixel);
  };

  useEffect(() => {
    function handlePointerMover(evt: MapBrowserEvent<UIEvent>) {
      if (evt.dragging) return;
      highlightHankeOnPixel(map, evt);
    }

    if (map) {
      map.on('pointermove', handlePointerMover);
    }

    return function cleanUp() {
      map?.un('pointermove', handlePointerMover);
    };
  }, [map]);

  return (
    <HoverContext.Provider value={{ hoverPosition, hoveredHankeAreaData }}>
      {children}
    </HoverContext.Provider>
  );
};

export default GeometryHover;
