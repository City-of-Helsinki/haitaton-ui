import React from 'react';
import { Vector as VectorSource } from 'ol/source';
import { Feature } from 'ol';
import Geometry from 'ol/geom/Geometry';
import DrawControl from './DrawControl';
import DrawIntercation from './DrawInteraction';
import DrawProvider from './DrawProvider';

type Props = {
  source: VectorSource;
  /**
   * Function that is called when drawing or modifying ends or when feature is removed from source.
   * It is called with the self-intersecting polygon or null if there is no self-intersection.
   */
  onSelfIntersectingPolygon?: (feature: Feature<Geometry> | null) => void;
};

const DrawModule: React.FC<Props> = ({ source, onSelfIntersectingPolygon }) => (
  <DrawProvider source={source}>
    <DrawIntercation onSelfIntersectingPolygon={onSelfIntersectingPolygon} />
    <DrawControl />
  </DrawProvider>
);

export default DrawModule;
