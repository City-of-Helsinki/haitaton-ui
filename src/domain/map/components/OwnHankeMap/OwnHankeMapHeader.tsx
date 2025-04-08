import React from 'react';
import { IconLinkExternal, IconLocation, IconSize, Link, LinkSize } from 'hds-react';
import { useTranslation } from 'react-i18next';
import Text from '../../../../common/components/text/Text';
import useLinkPath from '../../../../common/hooks/useLinkPath';
import { ROUTES } from '../../../../common/types/route';
import styles from './OwnHankeMapHeader.module.scss';

const OwnHankeMapHeader: React.FC<{ hankeTunnus: string; showLink?: boolean }> = ({
  hankeTunnus,
  showLink = true,
}) => {
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
      {showLink && (
        <div>
          <Link
            href={getFullPageMapPath({ hankeTunnus })}
            openInNewTab
            disableVisitedStyles
            size={LinkSize.Small}
          >
            {t('hankePortfolio:openMapToNewWindow')}
          </Link>
          <IconLinkExternal size={IconSize.ExtraSmall} />
        </div>
      )}
    </header>
  );
};

export default OwnHankeMapHeader;
