import React from 'react';
import MainHeading from '../../../../common/components/mainHeading/MainHeading';
import Text from '../../../../common/components/text/Text';

const CardsIndex = () => {
  return (
    <>
      <MainHeading spacingBottom="l">Haittojenhallinnan lisätietokortit</MainHeading>
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
