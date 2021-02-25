import React from 'react';
import { Vector as VectorSource } from 'ol/source';
import DrawControl from './DrawControl';
import DrawIntercation from './DrawInteraction';
import DrawProvider from './DrawProvider';

type Props = {
  source: VectorSource;
};

const DrawModule: React.FC<Props> = ({ source }) => (
  <DrawProvider source={source}>
    <DrawIntercation />
    <DrawControl />
  </DrawProvider>
);

export default DrawModule;
