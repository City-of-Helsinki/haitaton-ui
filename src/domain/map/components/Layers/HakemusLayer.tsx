import { useRef } from 'react';
import VectorSource from 'ol/source/Vector';
import { StyleLike } from 'ol/style/Style';
import { useApplication } from '../../../application/hooks/useApplication';
import { ApplicationArea } from '../../../application/types/application';
import VectorLayer from '../../../../common/components/map/layers/VectorLayer';
import useApplicationFeatures from '../../hooks/useApplicationFeatures';

type Props = { hakemusId: number; layerStyle?: StyleLike };

export default function HakemusLayer({ hakemusId, layerStyle }: Readonly<Props>) {
  const source = useRef(new VectorSource());
  const { data } = useApplication(hakemusId);
  const tyoalueet = (data?.applicationData.areas as ApplicationArea[]) ?? [];
  useApplicationFeatures(source.current, tyoalueet);

  return (
    <VectorLayer
      source={source.current}
      zIndex={1}
      className="hakemusGeometryLayer"
      style={layerStyle}
    />
  );
}
