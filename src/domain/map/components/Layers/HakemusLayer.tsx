import { useRef } from 'react';
import VectorSource from 'ol/source/Vector';
import { StyleLike } from 'ol/style/Style';
import { useApplication } from '../../../application/hooks/useApplication';
import { ApplicationArea } from '../../../application/types/application';
import VectorLayer from '../../../../common/components/map/layers/VectorLayer';
import useApplicationFeatures from '../../hooks/useApplicationFeatures';
import { OverlayProps } from '../../../../common/components/map/types';

type Props = {
  hakemusId: number;
  layerStyle?: StyleLike;
  featureProperties?: { [x: string]: unknown };
};

export default function HakemusLayer({
  hakemusId,
  layerStyle,
  featureProperties = {},
}: Readonly<Props>) {
  const source = useRef(new VectorSource());
  const { data } = useApplication(hakemusId);
  const tyoalueet = (data?.applicationData.areas as ApplicationArea[]) ?? [];
  useApplicationFeatures(source.current, tyoalueet, {
    overlayProps: new OverlayProps({
      heading: data ? `${data.applicationData.name} (${data.applicationIdentifier})` : null,
      startDate: data?.applicationData.startTime,
      endDate: data?.applicationData.endTime,
      backgroundColor: 'var(--color-suomenlinna-light)',
      enableCopyArea: true,
    }),
    ...featureProperties,
  });

  return (
    <VectorLayer
      source={source.current}
      zIndex={1}
      className="hakemusGeometryLayer"
      style={layerStyle}
    />
  );
}
