import { Trans, useTranslation } from 'react-i18next';
import { Accordion, AccordionSize, IconDocument, Link, LinkSize } from 'hds-react';
import { Box } from '@chakra-ui/react';
import { useLocalizedRoutes } from '../../../common/hooks/useLocalizedRoutes';
import { memo, useMemo } from 'react';

type Props = { haittojenhallintaTyyppi: string; haittaIndex: number };

type Tip = {
  heading: string;
  tip: string;
  indexTreshold?: number;
  cardLinks?: number[];
};

/**
 * Component for displaying list of procedure tips (toimenpidevinkit) for different haittojenhallinta types.
 */
const ProcedureTips: React.FC<Props> = memo(({ haittojenhallintaTyyppi, haittaIndex }) => {
  const { t } = useTranslation();

  const { CARD } = useLocalizedRoutes();
  const isOther = ['MUUT', 'MELU', 'POLY', 'TARINA'].includes(haittojenhallintaTyyppi);

  const tips: Tip[] = useMemo(() => {
    return t(`hankeForm:haittojenHallintaForm:procedureTips:${haittojenhallintaTyyppi}`, {
      returnObjects: true,
    });
  }, [t, haittojenhallintaTyyppi]);

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
    ol: <ol style={{ listStylePosition: 'inside' }} />,
    ul: <ul style={{ listStylePosition: 'inside' }} />,
    li: <li />,
    external: (
      <a
        className="hds-link hds-link--medium"
        aria-label={`${t('common:components:link:openInNewTabAriaLabel')} ${t('common:components:link:openInExternalDomainAriaLabel')}`}
        target="_blank"
      >
        External link
      </a>
    ),
    span: <span />,
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
        size={AccordionSize.Small}
        headingLevel={4}
        theme={{
          '--header-font-size': 'var(--fontsize-heading-s)',
        }}
      >
        <Box mb="var(--spacing-s)" width="100%">
          {filteredTips.map((item) => (
            <Accordion
              key={item.heading}
              heading={item.heading}
              size={AccordionSize.Small}
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
                      iconStart={<IconDocument />}
                      size={LinkSize.Medium}
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
  );
});

export default ProcedureTips;
