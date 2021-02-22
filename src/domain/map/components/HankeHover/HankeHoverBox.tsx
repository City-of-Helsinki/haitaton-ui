import React, { useContext } from 'react';
import HoverContext from '../../../../common/components/map/interactions/hover/HoverContext';

const HankeHoverBox: React.FC = () => {
  const { hoveredHankeTunnus } = useContext(HoverContext);
  return (
    <div>
      <h1>Hovering on {hoveredHankeTunnus}</h1>
    </div>
  );
};

export default HankeHoverBox;
