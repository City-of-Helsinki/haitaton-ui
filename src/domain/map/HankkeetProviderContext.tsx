import React from 'react';
import { HankeData } from '../types/hanke';

type localHankkeetContext = {
  hankkeet: HankeData[];
  hankkeetObject: { [key: string]: HankeData };
};

const HankkeetContext = React.createContext<localHankkeetContext>({
  hankkeet: [],
  hankkeetObject: {},
});

export default HankkeetContext;
