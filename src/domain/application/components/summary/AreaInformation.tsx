import { useTranslation } from 'react-i18next';
import { Box } from '@chakra-ui/react';
import { ApplicationArea } from '../../types/application';
import { getAreaGeometry } from '../../../johtoselvitys/utils';
import Text from '../../../../common/components/text/Text';
import { formatSurfaceArea } from '../../../map/utils';

export default function AreaInformation({
  area,
  areaName,
}: Readonly<{ area: ApplicationArea; areaName: string }>) {
  const { t } = useTranslation();
  const geom = getAreaGeometry(area);

  return (
    <Box marginBottom="var(--spacing-m)">
      <Text tag="p" spacingBottom="s">
        <strong>{areaName}</strong>
      </Text>
      <p>
        {t('form:labels:pintaAla')}: {formatSurfaceArea(geom)}
      </p>
    </Box>
  );
}
