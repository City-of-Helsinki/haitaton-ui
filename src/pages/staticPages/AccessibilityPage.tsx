import React from 'react';
import { Container as HdsContainer } from 'hds-react';
import { useTranslation } from 'react-i18next';
import PageMeta from '../components/PageMeta';
import { useLocalizedRoutes } from '../../common/hooks/useLocalizedRoutes';
import Container from '../../common/components/container/Container';
import Text from '../../common/components/text/Text';

const AccessibilityPage: React.FC = () => {
  const { ACCESSIBILITY } = useLocalizedRoutes();
  const { t } = useTranslation();

  return (
    <Container>
      <PageMeta routeData={ACCESSIBILITY} />
      <Text tag="h1" styleAs="h2" spacing="s" weight="bold">
        {t('staticPages:accessibility:title')}
      </Text>
      <HdsContainer style={{ padding: '2rem', backgroundColor: 'white' }}>
        <Text tag="p">
          Tämä seloste on laadittu 10.03.2021. Tämä saavutettavuusseloste koskee Helsingin kaupungin
          Haitaton-verkkosivustoa. Sivuston osoite on https://haitaton.hel.fi/.
        </Text>

        <Text tag="h2" styleAs="h3" spacing="m">
          Kaupungin tavoite
        </Text>
        <Text tag="p">
          Digitaalisten palveluiden saavutettavuudessa Helsingin tavoitteena on pyrkiä vähintään
          WCAGohjeiston mukaiseen AA- tai sitä parempaan tasoon, mikäli se on kohtuudella
          mahdollista.
        </Text>

        <Text tag="h2" styleAs="h3" spacing="m">
          Vaatimustenmukaisuustilanne
        </Text>
        <Text tag="p">
          Koska sivusto julkaistaan Helsingin kaupungin työntekijöille testauskäyttöön, kaikkia AA-
          tason saavutettavuusvaatimuksia ei ole testattu.
        </Text>

        <Text tag="h2" styleAs="h3" spacing="m">
          Saavutettavuuden varmistamiseksi tehdyt toimet
        </Text>
        <Text tag="p">
          Sivuston suunnittelussa on huomioitu saavutettavuusstandardit ja sivuston käyttö on
          pyritty tekemään mahdollisimman yksinkertaiseksi ja jatkumoiltaan ymmärrettäväksi. Tämän
          lisäksi sivusto käyttää Helsingin Design System-komponentteja ja tyylityksiä, jotka on
          suunniteltu saavutettaviksi. Sivuston väreissä on käytetty riittävää kontrastia pohjan ja
          tekstin välillä. Sivuston napit ovat riittävän suuria ja tekstikenttien välistykset ovat
          riittäviä. Sivuston tekstikoot ovat riittävän suuria.Sivuston skaalaus toimii
          kohtuullisesti 150% asti (tavoite 200%). Jotta sivustoa voi käyttää esteettömästi,
          kaikilla napeilla ja linkeillä on Aria-label attribuutti tai kuvaava tekstisisältö, joka
          kertoo mitä kyseinen nappi/linkki tekee. Nämä sisällöt voi lukea näytönlukuohjelmalla.
          Sivuston toimivuus on testattu osittain näytönlukuohjelmalla ja sarkain-navigoinilla.
          Sivuston otsikot ovat rakenteellisia, eli on vain yksi pääotsikko (h1) ja sen jälkeen
          aliotsikoita. Sivustolle on tehty saavutetavuustestaus Axe-saavutettavuustyökalulla. Axe
          ajetaan aina, kun koodi siirretään versionhallintaan. Tämä takaa, että myös jatkossa
          koodin laatu pysyy hyvänä saavutettavuusnäkökulmasta.
        </Text>

        <Text tag="h2" styleAs="h3" spacing="m">
          Saavutettavuuden arviointi
        </Text>
        <Text tag="p">
          Saavutettavuuden arvioinnissa on noudatettu Helsingin kaupungin työohjetta ja menetelmiä,
          jotka pyrkivät varmistamaan sivuston saavutettavuuden kaikissa työvaiheissa.
        </Text>

        <Text tag="p">
          Saavutettavuus on tarkistettu käyttäen ohjelmallista saavutettavuustarkistusta sekä
          sivuston ja sisällön manuaalista tarkistusta. Ohjelmallinen tarkistus on suoritettu
          käyttäen Axe saavutettavuustyökalua.
        </Text>

        <Text tag="h2" styleAs="h3" spacing="m">
          Ei-saavutettava sisältö
        </Text>
        <Text tag="p">
          Jäljempänä mainittu sisältö ei vielä täytä kaikkia lain asettamia
          saavutettavuusvaatimuksia.
        </Text>

        <Text tag="h2" styleAs="h3" spacing="m">
          Havaitut puutteet
        </Text>
        <Text tag="p">
          Kartalla oleva geometriatieto on vain piirron mukaisessa muodossa kartalla ja
          tekstimuotoista sisältöä ei ole kuvaamaan kartan geometriaa • Kartalla on käytetty
          perusvärejä, jotka eivät ole täysin erotettavissa, mikäli henkilöllä on vaikeuksia erottaa
          värejä
        </Text>

        <Text tag="h2" styleAs="h3" spacing="m">
          Puutteiden korjaus
        </Text>
        <Text tag="p">Puutteiden korjaustarve arvioidaan asiakkaan testauskäytön aikana.</Text>

        <Text tag="h2" styleAs="h3" spacing="m">
          Tiedon saanti saavutettavassa muodossa
        </Text>
        <Text tag="p">
          Mainituista puutteista johtuen saavuttamatta jäävää sisältöä voi pyytää tämän sivuston
          ylläpitäjältä
        </Text>
        <Text tag="p">
          Eva-Lisa Karlsson
          <br />
          Kaupunkiympäristön toimiala
          <br />
          Helsingin kaupunki
          <br />
        </Text>

        <Text tag="h2" styleAs="h3" spacing="m">
          Saavutettavuusselosteen päivittäminen
        </Text>
        <Text tag="p">
          Sivuston saavutettavuudesta huolehditaan jatkuvalla valvonnalla tekniikan tai sisällön
          muuttuessa sekä määräajoin suoritettavalla tarkistuksella. Tätä selostetta päivitetään
          sivuston muutosten ja saavutettavuuden tarkistusten yhteydessä.
        </Text>

        <Text tag="h2" styleAs="h3" spacing="m">
          Palaute ja yhteystiedot
        </Text>
        <Text tag="p">
          Sivuston saavutettavuudesta vastaa Kaupunkiympäristön toimiala Helsingin kaupunki Eva-Lisa
          Karlsson
        </Text>

        <Text tag="h2" styleAs="h3" spacing="m">
          Ilmoittaminen ei-saavutettavasta sisällöstä
        </Text>
        <Text tag="p">
          Mikäli käyttäjä kokee, etteivät saavutettavuuden vaatimukset kuitenkaan täyty, voi tästä
          tehdä ilmoituksen sähköpostilla helsinki.palaute@hel.fi tai palautelomakkeella
          www.hel.fi/palaute.
        </Text>

        <Text tag="h2" styleAs="h3" spacing="m">
          Tietojen pyytäminen saavutettavassa muodossa
        </Text>
        <Text tag="p">
          Mikäli käyttäjä ei koe saavansa sivuston sisältöä saavutettavassa muodossa, voi käyttäjä
          pyytää näitä tietoja sähköpostilla helsinki.palaute@hel.fi tai palautelomakkeella
          www.hel.fi/palaute. Tiedusteluun pyritään vastaamaan kohtuullisessa ajassa.
        </Text>

        <Text tag="h2" styleAs="h3" spacing="m">
          Saavutettavuuden oikeussuoja, Täytäntöönpanomenettely
        </Text>
        <Text tag="p">
          Mikäli henkilö kokee, ettei hänen ilmoitukseensa tai tiedusteluunsa ole vastattu tai
          vastaus ei ole tyydyttävä, voi asiasta tehdä ilmoituksen Etelä-Suomen
          aluehallintovirastoon. Etelä-Suomen aluehallintoviraston sivulla kerrotaan tarkasti, miten
          asia käsitellään.
        </Text>
        <Text tag="p">
          Etelä-Suomen aluehallintovirasto
          <br />
          Saavutettavuuden valvonnan yksikkö
          <br />
          www.saavutettavuusvaatimukset.fi
          <br />
          saavutettavuus@avi.fi
          <br />
          Puhelinvaihde: 0295 016 000
          <br />
          Avoinna: ma-pe klo 8.00 – 16.15
          <br />
        </Text>

        <Text tag="h2" styleAs="h3" spacing="m">
          Helsingin kaupunki ja saavutettavuus
        </Text>
        <Text tag="p">
          Kaupunki edistää digitaalisten palveluiden saavutettavuutta yhdenmukaistamalla
          julkaisutyötä ja järjestämällä saavutettavuuteen keskittyvää koulutusta henkilökunnalleen.
          Sivustojen saavutettavuuden tasoa seurataan jatkuvasti sivustoja ylläpidettäessä.
          Havaittuihin puutteisiin reagoidaan välittömästi. Tarvittavat muutokset pyritään
          suorittamaan mahdollisimman nopeasti.
        </Text>

        <Text tag="h2" styleAs="h3" spacing="m">
          Vammaiset ja avustavien teknologioiden käyttäjät
        </Text>
        <Text tag="p">
          Kaupunki tarjoaa neuvontaa ja tukea vammaisille ja avustavien teknologioiden käyttäjille.
          Tukea on saatavilla kaupungin sivuilla ilmoitetuilta neuvontasivuilta sekä
          puhelinneuvonnasta.
        </Text>

        <Text tag="h2" styleAs="h3" spacing="m">
          Saavutettavuusselosteen hyväksyntä
        </Text>
        <Text tag="p">
          Tämän selosteen on hyväksynyt 10.03.2021
          <br />
          Eva-Lisa Karlsson
          <br />
          Kaupunkiympäristön toimiala
          <br />
          Helsingin kaupunki
          <br />
        </Text>
      </HdsContainer>
    </Container>
  );
};

export default AccessibilityPage;

/*







Saavutettavuusselosteen päivittäminen
Sivuston saavutettavuudesta huolehditaan jatkuvalla valvonnalla tekniikan tai sisällön muuttuessa sekä määräajoin suoritettavalla tarkistuksella. Tätä selostetta päivitetään sivuston muutosten ja saavutettavuuden tarkistusten yhteydessä.

Palaute ja yhteystiedot
Sivuston saavutettavuudesta vastaa
Kaupunkiympäristön toimiala
Helsingin kaupunki
Eva-Lisa Karlsson

Ilmoittaminen ei-saavutettavasta sisällöstä
Mikäli käyttäjä kokee, etteivät saavutettavuuden vaatimukset kuitenkaan täyty, voi tästä tehdä ilmoituksen sähköpostilla helsinki.palaute@hel.fi tai palautelomakkeella www.hel.fi/palaute.

Tietojen pyytäminen saavutettavassa muodossa
Mikäli käyttäjä ei koe saavansa sivuston sisältöä saavutettavassa muodossa, voi käyttäjä pyytää näitä tietoja sähköpostilla helsinki.palaute@hel.fi tai palautelomakkeella www.hel.fi/palaute. Tiedusteluun pyritään vastaamaan kohtuullisessa ajassa.

Saavutettavuuden oikeussuoja, Täytäntöönpanomenettely
Mikäli henkilö kokee, ettei hänen ilmoitukseensa tai tiedusteluunsa ole vastattu tai vastaus ei ole tyydyttävä, voi asiasta tehdä ilmoituksen Etelä-Suomen aluehallintovirastoon. Etelä-Suomen aluehallintoviraston sivulla kerrotaan tarkasti, miten asia käsitellään.

Etelä-Suomen aluehallintovirasto
Saavutettavuuden valvonnan yksikkö
www.saavutettavuusvaatimukset.fi
saavutettavuus@avi.fi
Puhelinvaihde: 0295 016 000
Avoinna: ma-pe klo 8.00 – 16.15

Helsingin kaupunki ja saavutettavuus
Kaupunki edistää digitaalisten palveluiden saavutettavuutta yhdenmukaistamalla julkaisutyötä ja järjestämällä saavutettavuuteen keskittyvää koulutusta henkilökunnalleen. Sivustojen saavutettavuuden tasoa seurataan jatkuvasti sivustoja ylläpidettäessä. Havaittuihin puutteisiin reagoidaan välittömästi. Tarvittavat muutokset pyritään suorittamaan mahdollisimman nopeasti.

Vammaiset ja avustavien teknologioiden käyttäjät
Kaupunki tarjoaa neuvontaa ja tukea vammaisille ja avustavien teknologioiden käyttäjille. Tukea on saatavilla kaupungin sivuilla ilmoitetuilta neuvontasivuilta sekä puhelinneuvonnasta.

Saavutettavuusselosteen hyväksyntä
Tämän selosteen on hyväksynyt 10.03.2021
Eva-Lisa Karlsson
Kaupunkiympäristön toimiala
Helsingin kaupunki




*/
