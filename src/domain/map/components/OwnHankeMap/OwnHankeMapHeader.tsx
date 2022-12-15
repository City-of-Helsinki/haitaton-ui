import React from 'react';
import { IconLinkExternal, IconLocation, Link } from 'hds-react';
import { useTranslation } from 'react-i18next';
import Text from '../../../../common/components/text/Text';
import useLinkPath from '../../../../common/hooks/useLinkPath';
import { ROUTES } from '../../../../common/types/route';
import styles from './OwnHankeMapHeader.module.scss';

const OwnHankeMapHeader: React.FC<{ hankeTunnus: string }> = ({ hankeTunnus }) => {
  const { t } = useTranslation();
  const getFullPageMapPath = useLinkPath(ROUTES.FULL_PAGE_MAP);

  return (
    <header className={styles.mapHeader}>
      <div className={styles.mapHeader__inner}>
        <IconLocation />
        <Text tag="h3" styleAs="h5" weight="bold">
          {t('hankePortfolio:areaLocation')}
        </Text>
      </div>
      <div>
        <Link href={getFullPageMapPath({ hankeTunnus })} openInNewTab disableVisitedStyles size="S">
          {t('hankePortfolio:openMapToNewWindow')}
        </Link>
        <IconLinkExternal size="xs" />
      </div>
    </header>
  );
};

export default OwnHankeMapHeader;
