import React, { useEffect } from 'react';
import MainHeading from '../../../common/components/mainHeading/MainHeading';
import { useTranslation } from 'react-i18next';
import styles from '../StaticContent.module.scss';
import { BREADCRUMBS, useBreadcrumbs } from '../../../common/components/breadcrumbs/Breadcrumbs';
import Text from '../../../common/components/text/Text';

import { Box } from '@chakra-ui/react';
import { IconEnvelope, IconPhone, Link } from 'hds-react';

const UserManualMain: React.FC = () => {
  const { t } = useTranslation();
  const { setBreadcrumbs } = useBreadcrumbs();

  useEffect(() => {
    const updateBreadcrumbs = () => setBreadcrumbs([BREADCRUMBS.manual]);

    updateBreadcrumbs();
  }, [setBreadcrumbs]);

  return (
    <>
      <MainHeading spacingBottom="xl">{t('staticPages:manualPage:main:heading')}</MainHeading>
      <div className={styles.content}>
        <p>{t('staticPages:manualPage:main:text')}</p>
        <Box
          as="section"
          backgroundColor="var(--color-black-5)"
          padding="var(--spacing-l)"
          marginTop="var(--spacing-xl)"
        >
          <Text styleAs="h2" tag="h2">
            {t('staticPages:manualPage:main:contact')}
          </Text>
          <br />
          <Box as="p" marginBottom="var(--spacing-2-xs)">
            <strong>{t('staticPages:manualPage:main:haitatonContact')}</strong>
          </Box>
          <Link
            style={{ display: 'block' }}
            iconStart={<IconEnvelope />}
            href="mailto:haitatontuki@hel.fi"
          >
            haitatontuki@hel.fi
          </Link>
          <br />
          <Box as="p" marginBottom="var(--spacing-2-xs)">
            <strong>{t('staticPages:manualPage:main:cableServiceContact')}</strong>
          </Box>
          <Link
            style={{ display: 'block' }}
            external
            openInNewTab
            openInNewTabAriaLabel={t('common:components:link:openInNewTabAriaLabel')}
            openInExternalDomainAriaLabel={t(
              'common:components:link:openInExternalDomainAriaLabel',
            )}
            href={t('staticPages:manualPage:main:cableLocationServiceLink')}
          >
            {t('staticPages:manualPage:main:cableService')} (hel.fi)
          </Link>
          <Link
            style={{ display: 'block' }}
            iconStart={<IconEnvelope />}
            href="mailto:johtotietopalvelu@hel.fi"
          >
            johtotietopalvelu@hel.fi
          </Link>
          <Link style={{ display: 'block' }} iconStart={<IconPhone />} href="tel:+358931031940">
            +358 9 310 31940
          </Link>
          <br />
          <Box as="p" marginBottom="var(--spacing-2-xs)">
            <strong>{t('staticPages:manualPage:main:excavationContact')}</strong>
          </Box>
          <Link
            style={{ display: 'block' }}
            external
            openInNewTab
            openInNewTabAriaLabel={t('common:components:link:openInNewTabAriaLabel')}
            openInExternalDomainAriaLabel={t(
              'common:components:link:openInExternalDomainAriaLabel',
            )}
            href={t('staticPages:manualPage:main:excavationServiceLink')}
          >
            {t('staticPages:manualPage:main:excavationService')} (hel.fi)
          </Link>
          <Link
            style={{ display: 'block' }}
            iconStart={<IconEnvelope />}
            href="mailto:luvat@hel.fi"
          >
            luvat@hel.fi
          </Link>
          <Link style={{ display: 'block' }} iconStart={<IconPhone />} href="tel:+358931022111">
            +358 9 310 22111
          </Link>
        </Box>
      </div>
    </>
  );
};

export default UserManualMain;
