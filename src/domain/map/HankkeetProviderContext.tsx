import React from 'react';
import { HankeData } from '../types/hanke';

type HankkeetContext = {
  hankkeet: HankeData[];
  hankkeetObject: { [key: string]: HankeData };
};

const HankkeetContext = React.createContext<HankkeetContext>({ hankkeet: [], hankkeetObject: {} });

export default HankkeetContext;
