import React, { useEffect } from 'react';
import MainHeading from '../../../../common/components/mainHeading/MainHeading';
import Text from '../../../../common/components/text/Text';
import { useBreadcrumbs } from '../WorkInstructionsPage';

const CardsIndex = () => {
  const { setBreadcrumbs } = useBreadcrumbs();

  useEffect(() => {
    const updateBreadcrumbs = () =>
      setBreadcrumbs([
        { title: 'Työhjeet', path: '/' },
        { title: 'Haittojenhallinan lisäkortit', path: '/' },
      ]);

    updateBreadcrumbs();
  }, [setBreadcrumbs]);

  return (
    <>
      <MainHeading spacingBottom="xl">Haittojenhallinnan lisätietokortit</MainHeading>
      <Text tag="p">
        Nämä lisätietokortit täydentävät Haitaton-järjestelmän haittojenhallinnan toimenpidevinkkejä
        esittämällä laajemmin kaupungin vaatiman perustason toimet sekä hankekohtaisesti
        sovellettavia mahdollisia lisätason toimia. Toimenpiteet perustuvat kaupungin aiempaan
        Työmaaopas-ohjeeseen, jota on täydennetty Vuoden katutyömaa -kilpailusta kerätyillä
        parhailla käytännöillä vuoden 2024 aikana. Ratkaisevaa haittojenhallinnan onnistumisessa
        ovat työmaan asenne, infran käyttäjille intuitiiviset järjestelyt sekä työmaan tekemä
        aktiivinen seuranta ja reagointi muutoksiin ja puutteisiin.
      </Text>
    </>
  );
};

export default CardsIndex;
