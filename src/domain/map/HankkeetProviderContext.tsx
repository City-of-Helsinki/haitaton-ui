import React from 'react';
import { HankeData } from '../types/hanke';

type HankkeetContext = {
  hankkeet: HankeData[];
};

const HankkeetContext = React.createContext<HankkeetContext>({ hankkeet: [] });

export default HankkeetContext;
