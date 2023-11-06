import React from 'react';
import { Flex } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import Text from '../../../common/components/text/Text';
import HaittaIndexNumber from './HaittaIndexNumber';
import { HankeAlue } from '../../types/hanke';
import { formatToFinnishDate } from '../../../common/utils/date';
import { formatSurfaceArea, getFeatureFromHankeGeometry } from '../../map/utils';

type Props = {
  area: HankeAlue;
  haittaIndex?: number;
  index: number;
  className?: string;
};

const CompressedAreaIndex: React.FC<Props> = ({ area, haittaIndex, index, className }) => {
  const { t } = useTranslation();
  const areaStartDate = formatToFinnishDate(area.haittaAlkuPvm);
  const areaEndDate = formatToFinnishDate(area.haittaLoppuPvm);
  const areaGeometry =
    area.geometriat && getFeatureFromHankeGeometry(area.geometriat).getGeometry();

  return (
    <Flex
      className={className}
      alignItems="center"
      justifyContent="space-between"
      padding="var(--spacing-s)"
      paddingRight="var(--spacing-m)"
      borderBottom="1px solid var(--color-black-30)"
    >
      <div>
        <Text tag="p" styleAs="body-m" weight="bold" spacingBottom="2-xs">
          {area.nimi || t('hanke:alue:title', { index: index + 1 })} (
          {formatSurfaceArea(areaGeometry)})
        </Text>
        <Text tag="p" styleAs="body-s">
          {areaStartDate}–{areaEndDate}
        </Text>
      </div>
      <HaittaIndexNumber
        index={haittaIndex}
        testId="hankeIndexes:compressed:liikennehaittaindeksi"
      />
    </Flex>
  );
};

export default CompressedAreaIndex;
