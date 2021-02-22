import React from 'react';

type HoverContext = {
  hoveredHankeTunnus: string;
};

const HoverContext = React.createContext<HoverContext>({ hoveredHankeTunnus: '' });

export default HoverContext;
