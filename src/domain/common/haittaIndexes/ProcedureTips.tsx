import { Trans, useTranslation } from 'react-i18next';
import { Accordion, IconDocument, Link } from 'hds-react';
import { Box } from '@chakra-ui/react';
import { useLocalizedRoutes } from '../../../common/hooks/useLocalizedRoutes';

type Props = { haittojenhallintaTyyppi: string; haittaIndex: number };

/**
 * Component for displaying list of procedure tips (toimenpidevinkit) for different haittojenhallinta types.
 */
export default function ProcedureTips({ haittojenhallintaTyyppi, haittaIndex }: Readonly<Props>) {
  const { t } = useTranslation();

  const { CARD } = useLocalizedRoutes();
  const isOther = ['MUUT', 'MELU', 'POLY', 'TARTINA'].includes(haittojenhallintaTyyppi);

  const tips: {
    // Procedure tip title
    heading: string;
    // Procedure tip text
    tip: string;
    // Index treshold for showing the tip (if undefined, show the tip always)
    indexTreshold?: number;
    // List of possible link hrefs to be used in the tip text
    links?: string[];
    // Links to procedure tip cards
    cardLinks?: number[];
  }[] = t(`hankeForm:haittojenHallintaForm:procedureTips:${haittojenhallintaTyyppi}`, {
    returnObjects: true,
  });

  // If tip has indexTreshold, show the tip only if haittaIndex is greater or equal to the treshold,
  // so that the tip is shown only when the index is high enough.
  const filteredTips = tips.filter(
    (item) => item.indexTreshold === undefined || haittaIndex >= item.indexTreshold,
  );

  if (filteredTips.length === 0) {
    return null;
  }

  const translationComponents = {
    p: <p />,
    br: <br />,
    ul: <ul style={{ listStylePosition: 'inside' }} />,
    li: <li />,
    external: (
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
    mailto: (
      <a
        className="hds-link hds-link--medium"
        aria-label={t('common:components:link:openInNewTabAriaLabel')}
        target="_blank"
      >
        Mailto link
      </a>
    ),
  };

  return (
    <>
      <Box
        paddingX="var(--spacing-s)"
        paddingBottom="var(--spacing-s)"
        mb={isOther ? 'var(--spacing-xs)' : 'var(--spacing-l)'}
        backgroundColor="var(--color-black-5)"
        data-testid={`show-tips-button-${haittojenhallintaTyyppi}`}
      >
        <Accordion
          heading={t(
            `hankeForm:haittojenHallintaForm:procedureTips:titles:${haittojenhallintaTyyppi}`,
          )}
          size="s"
          headingLevel={4}
          theme={{
            '--header-font-size': 'var(--fontsize-heading-s)',
          }}
        >
          <Box mb="var(--spacing-s)">
            {filteredTips.map((item) => (
              <Accordion
                key={item.heading}
                heading={item.heading}
                size="s"
                headingLevel={5}
                theme={{
                  '--content-font-size': 'var(--fontsize-body-m)',
                  '--header-font-size': 'var(--fontsize-heading-xs)',
                }}
              >
                <Box as="p" mb="var(--spacing-s)">
                  <Trans i18nKey={item.tip} components={translationComponents} />
                </Box>
                {item.cardLinks && item.cardLinks.length > 0 && (
                  <Box as="p" mb="var(--spacing-s)">
                    <strong>
                      {t('hankeForm:haittojenHallintaForm:procedureTips:common:nuisanceCardLinks')}
                    </strong>
                    {item.cardLinks?.map((linkId) => (
                      <Link
                        key={linkId}
                        iconLeft={<IconDocument />}
                        size="M"
                        href={`${CARD.path}${linkId}/${t('routes:CARD:basicLevel')}`}
                        openInNewTab
                        openInNewTabAriaLabel={t('common:components:link:openInNewTabAriaLabel')}
                      >
                        {t(`workInstructions:cards:${linkId}:header`)}
                      </Link>
                    ))}
                  </Box>
                )}
              </Accordion>
            ))}
          </Box>
        </Accordion>
      </Box>
    </>
  );
}
