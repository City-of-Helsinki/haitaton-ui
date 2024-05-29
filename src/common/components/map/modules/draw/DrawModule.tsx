import React from 'react';
import { Feature } from 'ol';
import Geometry from 'ol/geom/Geometry';
import DrawControl from './DrawControl';
import DrawIntercation from './DrawInteraction';

type Props = {
  /**
   * Function that is called when drawing or modifying ends or when feature is removed from source.
   * It is called with the self-intersecting polygon or null if there is no self-intersection.
   */
  onSelfIntersectingPolygon?: (feature: Feature<Geometry> | null) => void;
};

const DrawModule: React.FC<React.PropsWithChildren<Props>> = ({ onSelfIntersectingPolygon }) => (
  <>
    <DrawIntercation onSelfIntersectingPolygon={onSelfIntersectingPolygon} />
    <DrawControl />
  </>
);

export default DrawModule;
