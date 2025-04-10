import React from 'react';

export type HankeAlueHoverData = {
  hankeTunnus?: string | null;
  hankeName?: string | null;
  areaName?: string | null;
  areaId?: number | null;
  startDate?: Date | string | null;
  endDate?: Date | string | null;
};

type HoverContext = {
  hoveredHankeAreaData: HankeAlueHoverData[];
  hoverPosition: number[];
};

const HoverContext = React.createContext<HoverContext>({
  hoveredHankeAreaData: [],
  hoverPosition: [0, 0],
});

export default HoverContext;
