import React, { useEffect, useState, useContext } from 'react';
import { Vector } from 'ol/source';
import Feature from 'ol/Feature';
import Collection from 'ol/Collection';
import { Draw, Snap, Modify } from 'ol/interaction';
import MapContext from '../MapContext';

type Props = {
  source: Vector;
  features?: Collection<Feature>;
};

const DrawInteraction: React.FC<Props> = ({ source, features = undefined }) => {
  const { map } = useContext(MapContext);
  // eslint-disable-next-line
  const [selectVal, setSelectVal] = useState<any>('');

  useEffect(() => {
    if (!map || selectVal === null) return;

    const drawInstance = new Draw({
      source,
      features,
      type: selectVal,
    });

    map.addInteraction(drawInstance);

    const snapInstance = new Snap({ source });
    map.addInteraction(snapInstance);

    const modifyInstance = new Modify({ source });
    map.addInteraction(modifyInstance);

    // eslint-disable-next-line
    return () => {
      if (map) {
        if (drawInstance) map.removeInteraction(drawInstance);
        if (snapInstance) map.removeInteraction(snapInstance);
        if (modifyInstance) map.removeInteraction(modifyInstance);
      }
    };
  }, [selectVal]);

  return (
    <select
      style={{ position: 'absolute', left: 0, top: 0, zIndex: 10000 }}
      onChange={(event) => {
        setSelectVal(event.target.value);
      }}
      value={selectVal}
    >
      <option value="Point">Point</option>
      <option value="Polygon">Polygon</option>
      <option value="Circle">Circle</option>
    </select>
  );
};

export default DrawInteraction;
