import React from 'react';
import useHanke from '../hooks/useHanke';
import HankeView from './HankeView';

type Props = {
  hankeTunnus?: string;
};

const HankeViewContainer: React.FC<Props> = ({ hankeTunnus }) => {
  const { data: hankeData } = useHanke(hankeTunnus);

  return <HankeView hankeData={hankeData} />;
};

export default HankeViewContainer;
