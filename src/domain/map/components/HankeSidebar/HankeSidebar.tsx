import React from 'react';
import { useTranslation } from 'react-i18next';
import { Drawer, DrawerBody, DrawerContent } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { IconCross } from 'hds-react/icons';
import { Button } from 'hds-react';
import Text from '../../../../common/components/text/Text';
import { formatToFinnishDate } from '../../../../common/utils/date';
import { HankeData } from '../../../types/hanke';
import styles from './HankeSidebar.module.scss';
import HankeIndexesContainer from './HankeIndexesContainer';
import useLinkPath from '../../../../common/hooks/useLinkPath';
import { ROUTES } from '../../../../common/types/route';

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
  const getEditHankePath = useLinkPath(ROUTES.EDIT_HANKE);

  return (
    <Drawer
      variant="alwaysOpen"
      placement="left"
      isOpen={isOpen}
      size="md"
      // https://github.com/chakra-ui/chakra-ui/issues/2893
      // Temporary ixed with global css in app.scss
      trapFocus={false}
      useInert={false}
      onClose={handleClose}
      blockScrollOnMount={false}
    >
      <DrawerContent
        className={styles.hankeSidebar__content}
        aria-label={t('hankeSidebar:ariaSidebarContent')}
      >
        <DrawerBody>
          <button
            className={styles.hankeSidebar__closeButton}
            type="button"
            onClick={handleClose}
            aria-label={t('hankeSidebar:closeButtonAriaLabel')}
          >
            <IconCross aria-hidden />
          </button>
          <Text tag="h2" weight="bold" styleAs="h4" spacing="2-xs">
            {hanke.nimi} ({hanke.hankeTunnus})
          </Text>
          {hanke.tyomaaKatuosoite && (
            <Text tag="h3" styleAs="h5" weight="bold" spacingBottom="2-xs">
              {hanke.tyomaaKatuosoite}
            </Text>
          )}
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
          <Link to={getEditHankePath({ hankeTunnus: hanke.hankeTunnus })}>
            <Button variant="secondary" className={styles.hankeSidebar__editButton}>
              {t('hankeSidebar:editHanke')}
            </Button>
          </Link>
          <hr />

          <HankeIndexesContainer hankeTunnus={hanke.hankeTunnus} />
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export default HankeSidebar;
