import { useRef } from 'react';
import VectorSource from 'ol/source/Vector';
import { StyleLike } from 'ol/style/Style';
import { useApplication } from '../../../application/hooks/useApplication';
import { ApplicationArea, KaivuilmoitusAlue } from '../../../application/types/application';
import VectorLayer from '../../../../common/components/map/layers/VectorLayer';
import useApplicationFeatures from '../../hooks/useApplicationFeatures';
import { OverlayProps } from '../../../../common/components/map/types';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();
  const source = useRef(new VectorSource());
  const { data: application } = useApplication(hakemusId);
  let tyoalueet: ApplicationArea[] = [];
  if (application) {
    tyoalueet =
      application.applicationType === 'CABLE_REPORT'
        ? (application.applicationData.areas as ApplicationArea[])
        : (application.applicationData.areas as KaivuilmoitusAlue[]).flatMap(
            (area) => area.tyoalueet,
          );
  }

  useApplicationFeatures(source.current, t, tyoalueet, {
    overlayProps: new OverlayProps({
      heading: application
        ? `${application.applicationData.name} (${application.applicationIdentifier})`
        : null,
      startDate: application?.applicationData.startTime,
      endDate: application?.applicationData.endTime,
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
