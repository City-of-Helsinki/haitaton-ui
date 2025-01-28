import { Box } from '@chakra-ui/react';
import { Accordion, IconDocument, IconLightbulb, Link } from 'hds-react';
import React from 'react';
import Text from '../../../../common/components/text/Text';

const CommonProcedureTips: React.FC = () => {
  return (
    <Box mb="var(--spacing-l)" padding="var(--spacing-s)" backgroundColor="var(--color-black-5)">
      <Box display="flex" flexDirection="row" gap="var(--spacing-xs)" alignItems="center">
        <IconLightbulb />
        <Text tag="h4" styleAs="h3" weight="bold">
          Tarkista aina nämä toimenpiteet
        </Text>
      </Box>
      <Accordion
        heading="Kulkuyhteydet kiinteistöihin ja joukkoliikennepysäkeille"
        size="s"
        headingLevel={5}
        theme={{
          '--content-font-size': 'var(--fontsize-body-m)',
          '--header-font-size': 'var(--fontsize-heading-s)',
        }}
      >
        <Box as="p" mb="var(--spacing-s)">
          Suunnittele ja toteuta kulkuyhteydet kiinteistöihin eri kulkumuodoille sekä esteettömät
          jalankulkuyhteydet joukkoliikennepysäkeille. Varmista kiinteistöjen (erityisesti
          sairaalat, apteekit, koulut, päiväkodit, hoitolaitokset) jalankulkuyhteyksien
          esteettömyys.
        </Box>
        <Box as="p" mb="var(--spacing-s)">
          <strong>Lue lisää toimenpiteiden lisätietokorteista (avautuu uuteen välilehteen):</strong>
          <Link iconLeft={<IconDocument />} size="M" href="/card">
            8. Julkisen liikenteen ja pysäkkien huomioon ottaminen
          </Link>
        </Box>
      </Accordion>
    </Box>
  );
};

export default CommonProcedureTips;
