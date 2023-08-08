import React from 'react';
import { Container as HdsContainer, Link } from 'hds-react';
import { Trans, useTranslation } from 'react-i18next';
import PageMeta from '../components/PageMeta';
import { useLocalizedRoutes } from '../../common/hooks/useLocalizedRoutes';
import Container from '../../common/components/container/Container';
import Text from '../../common/components/text/Text';
import { SKIP_TO_ELEMENT_ID } from '../../common/constants/constants';

const ManualPage: React.FC = () => {
  const { MANUAL } = useLocalizedRoutes();

  const { t } = useTranslation();
  return (
    <Container>
      <PageMeta routeData={MANUAL} />
      <Text
        tag="h1"
        styleAs="h1"
        spacingTop="l"
        spacingBottom="xl"
        weight="bold"
        id={SKIP_TO_ELEMENT_ID}
        tabIndex={-1}
      >
        {t('staticPages:manualPage:title')}
      </Text>

      <HdsContainer style={{ padding: '2rem', backgroundColor: 'white' }}>
        <Text tag="p" spacingBottom="s">
          <Link
            href={t('staticPages:manualPage:linkUrl')}
            rel="noreferrer"
            style={{ color: 'var(--color-coat-of-arms)' }}
            openInNewTab
            external
            openInNewTabAriaLabel={t('common:components:link:openInNewTabAriaLabel')}
            openInExternalDomainAriaLabel={t(
              'common:components:link:openInExternalDomainAriaLabel'
            )}
          >
            {t('staticPages:manualPage:linkText')}
          </Link>
        </Text>
        <Text tag="p" spacingBottom="s">
          <Trans
            i18nKey="staticPages:manualPage:supportText"
            components={{
              a: (
                <Link
                  href="mailto:haitatontuki@hel.fi"
                  style={{ color: 'var(--color-coat-of-arms)' }}
                >
                  haitatontuki@hel.fi
                </Link>
              ),
            }}
          />
        </Text>
        <Text tag="p" spacingBottom="s">
          <Trans
            i18nKey="staticPages:manualPage:bodyText"
            components={{
              a: (
                <Link
                  style={{ color: 'var(--color-coat-of-arms)' }}
                  href={t('staticPages:manualPage:cableLocationServiceLink')}
                  openInNewTab
                >
                  https://www.hel.fi/fi/kaupunkiymparisto-ja-liikenne/tontit-ja-rakentamisen-luvat/johtotietopalvelu
                </Link>
              ),
            }}
          />
        </Text>
        <Trans
          i18nKey="staticPages:manualPage:contactText"
          components={{
            a: (
              <Link
                style={{ color: 'var(--color-coat-of-arms)' }}
                href="mailto:johtotietopalvelu@hel.fi"
              >
                johtotietopalvelu@hel.fi
              </Link>
            ),
          }}
        />
      </HdsContainer>
    </Container>
  );
};

export default ManualPage;
