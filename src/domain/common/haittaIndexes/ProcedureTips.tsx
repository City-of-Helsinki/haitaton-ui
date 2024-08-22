import { Trans, useTranslation } from 'react-i18next';
import { Button, IconAngleDown, IconAngleUp, Link, useAccordion } from 'hds-react';
import { Box } from '@chakra-ui/react';

type Props = { haittojenhallintaTyyppi: string; haittaIndex: number };

/**
 * Component for displaying list of procedure tips (toimenpidevinkit) for different haittojenhallinta types.
 */
export default function ProcedureTips({ haittojenhallintaTyyppi, haittaIndex }: Readonly<Props>) {
  const { t } = useTranslation();
  const {
    isOpen,
    buttonProps: accordionButtonProps,
    contentProps: accordionContentProps,
  } = useAccordion({ initiallyOpen: false });
  const buttonIcon = isOpen ? <IconAngleUp /> : <IconAngleDown />;

  const tips: {
    // Procedure tip text
    tip: string;
    // Index treshold for showing the tip (if undefined, show the tip always)
    indexTreshold?: number;
    // List of possible link hrefs to be used in the tip text
    links?: string[];
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

  return (
    <>
      <Box mb="var(--spacing-s)">
        <Button iconLeft={buttonIcon} variant="secondary" theme="black" {...accordionButtonProps}>
          {t('hankeForm:haittojenHallintaForm:procedureTips:showTipsButton')}
        </Button>
      </Box>
      <Box backgroundColor="var(--color-black-5)" p="var(--spacing-m)" {...accordionContentProps}>
        <Box as="h4" mb="var(--spacing-xs)" fontWeight="bold">
          {t(`hankeForm:haittojenHallintaForm:procedureTips:titles:${haittojenhallintaTyyppi}`)}
        </Box>
        <Box as="ul" ml="var(--spacing-l)">
          {filteredTips.map((item) => (
            <li key={item.tip}>
              <Trans
                i18nKey={item.tip}
                components={item.links?.map((link) => (
                  <Link href={link} openInNewTab={!link?.includes('mailto')}>
                    Link
                  </Link>
                ))}
              />
            </li>
          ))}
        </Box>
      </Box>
    </>
  );
}
