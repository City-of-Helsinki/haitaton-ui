import React, { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Drawer, DrawerBody, DrawerContent, DrawerOverlay } from '@chakra-ui/react';
import { IconCross } from 'hds-react/icons';
import Text from '../../../../common/components/text/Text';
import { HankeData, HankeYhteystieto } from '../../../types/hanke';
import styles from './HankeSidebar.module.scss';
import { formatToFinnishDate } from '../../../../common/utils/date';
import { TFunction } from 'i18next';
import HaittaIndexes from '../../../common/haittaIndexes/HaittaIndexes';
import useHankeViewPath from '../../../hanke/hooks/useHankeViewPath';
import { ROUTES } from '../../../../common/types/route';
import useHankkeet from '../../../hanke/hooks/useHankkeet';
import { Link } from 'react-router-dom';

function omistajaNimet(
  omistajat: HankeYhteystieto[],
  t: TFunction<'translation', undefined>,
): string {
  const names = omistajat.map((yhteystieto) =>
    yhteystieto.nimi == undefined || yhteystieto.nimi.length > 0
      ? yhteystieto.nimi
      : t('hankeSidebar:labels:yksityishenkilo'),
  );
  const uniqueNames = Array.from(new Set(names));
  return uniqueNames.join(', ');
}

type SectionProps = {
  title: string;
  content: string | ReactNode;
};

const SidebarSection: React.FC<React.PropsWithChildren<SectionProps>> = ({ title, content }) =>
  title && title !== '' && content && content !== '' ? (
    <Box paddingBottom="var(--spacing-2-xs)">
      <Text tag="h3" styleAs="h6" weight="bold" spacingBottom="2-xs">
        {title}
      </Text>
      {typeof content === 'string' ? (
        <Text tag="p" styleAs="body-s" spacingBottom="2-xs">
          {content}
        </Text>
      ) : (
        <>{content}</>
      )}
    </Box>
  ) : null;

type Props = {
  hanke: HankeData;
  hankealueId: number;
  isOpen: boolean;
  handleClose: () => void;
};

const HankeSidebar: React.FC<React.PropsWithChildren<Props>> = ({
  hanke,
  hankealueId,
  isOpen,
  handleClose,
}) => {
  const { t } = useTranslation();
  const { data: hankkeet } = useHankkeet();
  const isUsersHanke = hankkeet?.some((h) => h.hankeTunnus === hanke.hankeTunnus);
  const tyomaaTyyppiContent = hanke.tyomaaTyyppi.length
    ? hanke.tyomaaTyyppi.map((tyyppi) => t(`hanke:tyomaaTyyppi:${tyyppi}`)).join(', ')
    : '-';
  const hankealue = hanke.alueet.find((ha) => ha.id === hankealueId)!;
  const hankeViewPath = useHankeViewPath(hanke?.hankeTunnus);

  return (
    <Drawer
      variant="alwaysOpen"
      placement="left"
      isOpen={isOpen}
      size="md"
      useInert={false}
      onClose={handleClose}
      blockScrollOnMount={false}
    >
      <DrawerOverlay />
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
            {hanke.nimi}: {hankealue.nimi}
          </Text>
          <SidebarSection
            title={t('hankeSidebar:labels:hankealueenAjankohta')}
            content={`${formatToFinnishDate(hankealue.haittaAlkuPvm)} - ${formatToFinnishDate(hankealue.haittaLoppuPvm)}`}
          />
          <SidebarSection
            title={t('hankeSidebar:labels:hanke')}
            content={
              isUsersHanke ? (
                <Link
                  to={hankeViewPath}
                  aria-label={
                    // eslint-disable-next-line
                    t(`routes:${ROUTES.HANKE}.meta.title`) +
                    ` ${hanke.nimi} - ${hanke.hankeTunnus} `
                  }
                  data-testid="hankeViewLink"
                  style={{ display: 'block', width: 'fit-content', border: 'none' }}
                >
                  {hanke.nimi} ({hanke.hankeTunnus})
                </Link>
              ) : (
                `${hanke.nimi} (${hanke.hankeTunnus})`
              )
            }
          />
          <SidebarSection
            title={t('hankeSidebar:labels:hankkeenAjankohta')}
            content={`${formatToFinnishDate(hanke.alkuPvm)} - ${formatToFinnishDate(hanke.loppuPvm)}`}
          />
          <SidebarSection
            title={t('hankeSidebar:labels.omistaja')}
            content={omistajaNimet(hanke.omistajat, t)}
          />
          <SidebarSection
            title={t('hankeForm:labels.vaihe')}
            content={t(`hanke:vaihe:${hanke.vaihe}`)}
          />
          <SidebarSection
            title={t('hankeForm:labels.tyomaaTyyppi')}
            content={tyomaaTyyppiContent}
          />
          <SidebarSection
            title={t('hankeForm:labels.kuvaus')}
            content={
              <Box whiteSpace="pre-wrap" wordBreak="break-word">
                {hanke.kuvaus ?? ''}
              </Box>
            }
          />

          <HaittaIndexes
            heading={`${t('hanke:alue:liikennehaittaIndeksit')} (0-5)`}
            haittaIndexData={hankealue.tormaystarkasteluTulos}
            className={styles.hankeSidebar__areaIndexes}
            initiallyOpen
          />
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export default HankeSidebar;
