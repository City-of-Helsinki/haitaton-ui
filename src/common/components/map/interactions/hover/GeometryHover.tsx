import React, { useEffect, useContext, useState } from 'react';
import { MapBrowserEvent } from 'ol';
import MapContext from '../../MapContext';
import { MapInstance } from '../../types';
import HoverContext from './HoverContext';

const GeometryHover: React.FC = ({ children }) => {
  const { map } = useContext(MapContext);
  const [hoverPosition, setHoverPosition] = useState([0, 0]);
  const [hoveredHankeTunnukset, setHoveredHankeTunnukset] = useState(['']);

  const highlightHankeOnPixel = (mapInstance: MapInstance, evt: MapBrowserEvent<UIEvent>) => {
    setHoveredHankeTunnukset([]);
    const hankeTunnuksetAtPixel: string[] = [];
    const foundFeatures = mapInstance?.getFeaturesAtPixel(evt.pixel) || [];
    if (foundFeatures?.length > 0) {
      foundFeatures?.forEach((feature) => {
        const hankeTunnus = String(feature.get('hankeTunnus'));
        hankeTunnuksetAtPixel.push(hankeTunnus);
      });
    }
    setHoveredHankeTunnukset(hankeTunnuksetAtPixel);
    setHoverPosition(evt.pixel);
  };

  useEffect(() => {
    if (map) {
      map.on('pointermove', (evt) => {
        if (evt.dragging) return;
        highlightHankeOnPixel(map, evt);
      });
    }
  }, [map]);

  return (
    <HoverContext.Provider value={{ hoverPosition, hoveredHankeTunnukset }}>
      {children}
    </HoverContext.Provider>
  );
};

export default GeometryHover;
