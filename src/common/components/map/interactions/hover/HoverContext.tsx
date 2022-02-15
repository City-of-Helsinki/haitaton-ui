import React from 'react';

type HoverContext = {
  hoveredHankeTunnukset: string[];
  hoverPosition: number[];
};

const HoverContext = React.createContext<HoverContext>({
  hoveredHankeTunnukset: [],
  hoverPosition: [0, 0],
});

export default HoverContext;
