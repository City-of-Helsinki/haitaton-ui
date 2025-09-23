import React from 'react';
import { Feature, Map, MapBrowserEvent } from 'ol';
import Geometry from 'ol/geom/Geometry';
import { Condition } from 'ol/events/condition';
import DrawIntercation from './DrawInteraction';
import { ModifyEvent } from 'ol/interaction/Modify';
import { FeatureLike } from 'ol/Feature';
import { Style } from 'ol/style';
import DrawControl from './DrawControl';
import { DrawSegmentGuard } from './types';

type Props = {
  /**
   * Function that is called when drawing or modifying ends or when feature is removed from source.
   * It is called with the self-intersecting polygon or null if there is no self-intersection.
   */
  onSelfIntersectingPolygon?: (feature: Feature<Geometry> | null) => void;
  drawCondition?: Condition;
  drawFinishCondition?: (event: MapBrowserEvent<UIEvent>, feature: Feature) => boolean;
  drawStyleFunction?: (map: Map, feature: FeatureLike) => Style | Style[];
  drawSegmentGuard?: DrawSegmentGuard;
  handleModifyEnd?: (
    event: ModifyEvent,
    originalFeature: Feature | null,
    modifiedFeature: Feature,
  ) => void;
};

const DrawModule: React.FC<React.PropsWithChildren<Props>> = ({
  onSelfIntersectingPolygon,
  drawCondition,
  drawFinishCondition,
  drawStyleFunction,
  drawSegmentGuard,
  handleModifyEnd,
}) => {
  return (
    <>
      <DrawIntercation
        onSelfIntersectingPolygon={onSelfIntersectingPolygon}
        drawCondition={drawCondition}
        drawFinishCondition={drawFinishCondition}
        drawStyleFunction={drawStyleFunction}
        drawSegmentGuard={drawSegmentGuard}
        handleModifyEnd={handleModifyEnd}
      />
      <DrawControl />
    </>
  );
};

export default DrawModule;
