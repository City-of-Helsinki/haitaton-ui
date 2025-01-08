import React from 'react';
import MainHeading from '../../../common/components/mainHeading/MainHeading';
import Text from '../../../common/components/text/Text';

const WorkInstructionsMain = () => {
  return (
    <>
      <MainHeading spacingBottom="xl">Työohjeet</MainHeading>
      <Text tag="p">
        Tältä sivulta löydät tärkeimmät yleisten alueiden hankkeita ja työmaita koskevat
        ohjeistukset, kuten haittojenhallinnan lisätietokortit.
      </Text>
    </>
  );
};

export default WorkInstructionsMain;
