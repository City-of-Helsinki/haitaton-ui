import React from 'react';
import { useTranslation } from 'react-i18next';
import { Drawer, DrawerBody, DrawerContent } from '@chakra-ui/react';
import Text from '../../../../common/components/text/Text';
import { formatToFinnishDate } from '../../../../common/utils/date';
import { HankeData } from '../../../types/hanke';
import styles from './HankeSidebar.module.scss';

type SectionProps = {
  title: string;
  content: string;
};

const SidebarSection: React.FC<SectionProps> = ({ title, content }) =>
  title && title !== '' && content && content !== '' ? (
    <>
      <Text tag="h3" styleAs="h6" weight="bold" spacingBottom="2-xs">
        {title}
      </Text>
      <Text tag="p" styleAs="body-s" spacingBottom="2-xs">
        {content}
      </Text>
    </>
  ) : null;

type Props = {
  hanke: HankeData;
  isOpen: boolean;
  handleClose: () => void;
};

const HankeSidebar: React.FC<Props> = ({ hanke, isOpen, handleClose }) => {
  const { t } = useTranslation();

  return (
    <Drawer placement="left" onClose={handleClose} isOpen={isOpen} size="md" trapFocus={false}>
      <DrawerContent className={styles.hankeSidebar__content}>
        <DrawerBody>
          <Text tag="h2" weight="bold" styleAs="h4" spacing="2-xs">
            {hanke.nimi} ({hanke.hankeTunnus})
          </Text>
          <Text tag="h3" styleAs="h5" weight="bold" spacingBottom="2-xs">
            {hanke.tyomaaKatuosoite}
          </Text>
          <Text tag="h3" styleAs="h6" weight="bold" spacingBottom="s">
            {formatToFinnishDate(hanke.alkuPvm)} - {formatToFinnishDate(hanke.loppuPvm)}
          </Text>
          <SidebarSection
            title={t('hankeForm:labels.vaihe')}
            content={t(`hanke:vaihe:${hanke.vaihe}`)}
          />
          {hanke.omistajat[0] && (
            <SidebarSection
              title={t('hankeForm:labels.organisaatio')}
              content={hanke.omistajat[0].organisaatioNimi}
            />
          )}
          <SidebarSection
            title={t('hankeForm:labels.tyomaaTyyppi')}
            content={hanke.tyomaaTyyppi
              .map((tyyppi) => t(`hanke:tyomaaTyyppi:${tyyppi}`))
              .join(', ')}
          />
          <SidebarSection title={t('hankeForm:labels.kuvaus')} content={hanke.kuvaus} />
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export default HankeSidebar;
