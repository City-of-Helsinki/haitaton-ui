import { Box } from '@chakra-ui/react';
import { Accordion, AccordionSize, IconDocument, Link, LinkSize } from 'hds-react';
import React, { memo } from 'react';

import { Trans, useTranslation } from 'react-i18next';
import { useLocalizedRoutes } from '../../../common/hooks/useLocalizedRoutes';

type CardLink = { number: number; heading: string; content: string; cardLinks: number[] };

const CommonProcedureTips: React.FC = memo(() => {
  const { CARD } = useLocalizedRoutes();
  const { t } = useTranslation();

  const renderProcedureTips = () => {
    const tipContents: CardLink[] = [];
    for (let i = 1; i <= 14; i++) {
      tipContents.push({
        number: i,
        heading: t(`hankeForm:haittojenHallintaForm:procedureTips:common:tip${i}:heading`),
        content: t(`hankeForm:haittojenHallintaForm:procedureTips:common:tip${i}:content`),
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
        size={AccordionSize.Small}
        headingLevel={5}
        theme={{
          '--content-font-size': 'var(--fontsize-body-m)',
          '--header-font-size': 'var(--fontsize-heading-xs)',
        }}
      >
        <Box as="p" mb="var(--spacing-s)">
          <Trans
            i18nKey={`hankeForm:haittojenHallintaForm:procedureTips:common:tip${tip.number}:text`}
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
                iconStart={<IconDocument />}
                size={LinkSize.Medium}
                href={`${CARD.path}${linkId}/${t('routes:CARD:basicLevel')}`}
                openInNewTab
                openInNewTabAriaLabel={t('common:components:link:openInNewTabAriaLabel')}
              >
                {t(`workInstructions:cards:card${linkId}:header`)}
              </Link>
            ))}
          </Box>
        )}
      </Accordion>
    ));

    return procedureTips;
  };

  return (
    <Box
      paddingX="var(--spacing-s)"
      paddingBottom="var(--spacing-s)"
      mb="var(--spacing-l)"
      backgroundColor="var(--color-black-5)"
      data-testid="test-common-nuisances"
    >
      <Accordion
        heading={t('hankeForm:haittojenHallintaForm:subHeaderPlan')}
        size={AccordionSize.Small}
        headingLevel={4}
        initiallyOpen
        theme={{
          '--header-font-size': 'var(--fontsize-heading-s)',
        }}
      >
        <Box mb="var(--spacing-s)" width="100%">
          {renderProcedureTips()}
        </Box>
      </Accordion>
    </Box>
  );
});

export default CommonProcedureTips;
