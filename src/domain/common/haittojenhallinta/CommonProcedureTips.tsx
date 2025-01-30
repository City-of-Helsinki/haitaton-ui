import { Box } from '@chakra-ui/react';
import { Accordion, IconDocument, IconLightbulb, Link } from 'hds-react';
import React from 'react';

import { Trans, useTranslation } from 'react-i18next';
import { useLocalizedRoutes } from '../../../common/hooks/useLocalizedRoutes';
import Text from '../../../common/components/text/Text';

type CardLink = { number: number; heading: string; content: string; cardLinks: number[] };

const CommonProcedureTips: React.FC = () => {
  const { CARD } = useLocalizedRoutes();
  const { t } = useTranslation();

  const renderProcedureTips = () => {
    const tipContents: CardLink[] = [];
    for (let i = 1; i <= 14; i++) {
      tipContents.push({
        number: i,
        heading: t(`hankeForm:haittojenHallintaForm:procedureTips:common:${i}:heading`),
        content: t(`hankeForm:haittojenHallintaForm:procedureTips:common:${i}:content`),
        cardLinks: [],
      });
    }
    tipContents.find((tip) => tip.number === 1)?.cardLinks.push(8, 9);
    tipContents.find((tip) => tip.number === 2)?.cardLinks.push(2, 3, 5, 6, 7);
    tipContents.find((tip) => tip.number === 3)?.cardLinks.push(5, 7);
    tipContents.find((tip) => tip.number === 4)?.cardLinks.push(10);
    tipContents.find((tip) => tip.number === 9)?.cardLinks.push(1);

    const procedureTips = tipContents.map((tip) => (
      <Accordion
        key={tip.number}
        heading={tip.heading}
        size="s"
        headingLevel={5}
        theme={{
          '--content-font-size': 'var(--fontsize-body-m)',
          '--header-font-size': 'var(--fontsize-heading-s)',
        }}
      >
        <Box as="p" mb="var(--spacing-s)">
          <Trans
            i18nKey={`hankeForm:haittojenHallintaForm:procedureTips:common:${tip.number}:text`}
            components={{
              a: (
                <a
                  className="hds-link hds-link--medium"
                  aria-label={t('common:components:link:openInNewTabAriaLabel')}
                  target="_blank"
                >
                  External link
                  <span
                    className="hds-icon icon hds-icon--link-external hds-icon--size-s vertical-align-medium-icon"
                    aria-hidden="true"
                  ></span>
                </a>
              ),
              span: <span />,
            }}
          >
            replaced
          </Trans>
        </Box>
        {tip.cardLinks.length > 0 && (
          <Box as="p" mb="var(--spacing-s)">
            <strong>
              {t('hankeForm:haittojenHallintaForm:procedureTips:common:nuisanceCardLinks')}
            </strong>
            {tip.cardLinks.map((linkId) => (
              <Link
                key={linkId}
                iconLeft={<IconDocument />}
                size="M"
                href={`${CARD.path}${linkId}/${t('routes:CARD:basicLevel')}`}
                openInNewTab
                openInNewTabAriaLabel={t('common:components:link:openInNewTabAriaLabel')}
              >
                {`${t(`workInstructions:cards:${linkId}:header`)}`}
              </Link>
            ))}
          </Box>
        )}
      </Accordion>
    ));

    return procedureTips;
  };

  return (
    <Box mb="var(--spacing-l)" padding="var(--spacing-s)" backgroundColor="var(--color-black-5)">
      <Box display="flex" flexDirection="row" gap="var(--spacing-xs)" alignItems="center">
        <IconLightbulb />
        <Text tag="h4" styleAs="h3" weight="bold" data-testid="test-common-nuisances">
          {t('hankeForm:haittojenHallintaForm:subHeaderPlan')}
        </Text>
      </Box>
      {renderProcedureTips()}
    </Box>
  );
};

export default CommonProcedureTips;
