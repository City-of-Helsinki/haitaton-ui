import React from 'react';
import { Container as HdsContainer, Link } from 'hds-react';
import { useTranslation } from 'react-i18next';
import PageMeta from '../components/PageMeta';
import { useLocalizedRoutes } from '../../common/hooks/useLocalizedRoutes';
import Container from '../../common/components/container/Container';
import Text from '../../common/components/text/Text';
import MainHeading from '../../common/components/mainHeading/MainHeading';

const AccessibilityPage: React.FC<React.PropsWithChildren<unknown>> = () => {
  const { ACCESSIBILITY } = useLocalizedRoutes();
  const { t } = useTranslation();

  return (
    <Container>
      <PageMeta routeData={ACCESSIBILITY} />
      <MainHeading spacingTop="l" spacingBottom="xl">
        {t('staticPages:accessibility:title')}
      </MainHeading>
      <HdsContainer style={{ padding: '2rem', backgroundColor: 'white' }}>
        <Text tag="p">
          Tämä saavutettavuusseloste koskee Helsingin kaupungin Haitaton -verkkosivustoa. Sivuston
          osoite on https://haitaton.hel.fi/.
        </Text>

        <Text tag="h2" styleAs="h3" spacing="m">
          Kaupungin tavoite
        </Text>
        <Text tag="p">
          Digitaalisten palveluiden saavutettavuudessa Helsingin tavoitteena on pyrkiä vähintään
          WCAG-ohjeiston mukaiseen AA- tai sitä parempaan tasoon, mikäli se on kohtuudella
          mahdollista.
        </Text>

        <Text tag="h2" styleAs="h3" spacing="m">
          Vaatimustenmukaisuustilanne
        </Text>
        <Text tag="p">
          Tämä verkkosivusto täyttää lain asettamat kriittiset saavutettavuusvaatimukset WCAG 2.1
          -tason AA mukaisesti seuraavin havaituin puuttein.
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
        <Text tag="p" spacingBottom="xs">
          Hakemuksen työalueen voi lisätä vain hiirellä (WCAG 2.1: 2.1.1 Näppäimistö)
        </Text>
        <Text tag="p" spacingBottom="xs">
          Sivustolla on linkkejä, jotka avaavat uuden välilehden varoittamatta (WCAG 2.1: 2.4.4
          Linkin tarkoitus (kontekstissa))
        </Text>
        <Text tag="p" spacingBottom="xs">
          Omien hankkeiden otsikoiden nimeäminen ruudunlukijalle on epäselvää (WCAG 2.1: 1.3.1
          Informaatio ja suhteet)
        </Text>

        <Text tag="h2" styleAs="h3" spacing="m">
          Puutteiden korjaus
        </Text>
        <Text tag="p">
          Tarvittavat korjaukset havaittuihin puuteisiin pyritään suorittamaan mahdollisimman
          nopeasti.
        </Text>

        <Text tag="h2" styleAs="h3" spacing="m">
          Tiedon saanti saavutettavassa muodossa
        </Text>
        <Text tag="p" spacingBottom="xs">
          Mainituista puutteista johtuen saavuttamatta jäävää sisältöä voi pyytää tämän sivuston
          ylläpitäjältä:
        </Text>
        <Text tag="p">
          Helsingin kaupunki
          <br />
          Kaupunkiympäristön toimiala
          <br />
          Työpajankatu 8
          <br />
          PL 58200, 00099 Helsingin kaupunki
        </Text>

        <Text tag="h2" styleAs="h3" spacing="m">
          Saavutettavuusselosteen laatiminen
        </Text>
        <Text tag="p">Tämä seloste on laadittu 22.06.2023.</Text>

        <Text tag="h2" styleAs="h3" spacing="m">
          Saavutettavuuden arviointi
        </Text>
        <Text tag="p" spacingBottom="xs">
          Saavutettavuuden arvioinnissa on noudatettu Helsingin kaupungin työohjetta ja menetelmiä,
          jotka pyrkivät varmistamaan sivuston saavutettavuuden kaikissa työvaiheissa.
        </Text>
        <Text tag="p" spacingBottom="xs">
          Saavutettavuus on tarkistettu ulkopuolisen asiantuntijan suorittamana auditointina sekä
          itsearviona.
        </Text>
        <Text tag="p" spacingBottom="xs">
          Saavutettavuus on tarkistettu käyttäen ohjelmallista saavutettavuustarkistusta sekä
          sivuston ja sisällön manuaalista tarkistusta.
        </Text>
        <Text tag="p" spacingBottom="xs">
          Arviointityökalujen raportoimat epäkohdat on tarkastettu ja tarvittaessa korjattu.
        </Text>
        <Text tag="p">Ulkopuolisen asiantuntija-auditoinnin on suorittanut Unicus Oy.</Text>

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
          Sivuston saavutettavuudesta vastaa
          <br />
          Helsingin kaupunki
          <br />
          Kaupunkiympäristön toimiala
          <br />
          Työpajankatu 8
          <br />
          PL 58200, 00099 Helsingin kaupunki
          <br />
        </Text>

        <Text tag="h2" styleAs="h3" spacing="m">
          Ilmoittaminen ei-saavutettavasta sisällöstä
        </Text>
        <Text tag="p">
          Mikäli käyttäjä kokee, etteivät saavutettavuuden vaatimukset kuitenkaan täyty, voi tästä
          tehdä ilmoituksen sähköpostilla
          <Link href="mailto:helsinki.palaute@hel.fi">helsinki.palaute@hel.fi</Link>tai
          palautelomakkeella
          <Link href="https://www.hel.fi/palaute">www.hel.fi/palaute</Link>.
        </Text>

        <Text tag="h2" styleAs="h3" spacing="m">
          Tietojen pyytäminen saavutettavassa muodossa
        </Text>
        <Text tag="p">
          Mikäli käyttäjä ei koe saavansa sivuston sisältöä saavutettavassa muodossa, voi käyttäjä
          pyytää näitä tietoja sähköpostilla
          <Link href="mailto:helsinki.palaute@hel.fi">helsinki.palaute@hel.fi</Link>tai
          palautelomakkeella<Link href="https://www.hel.fi/palaute">www.hel.fi/palaute</Link>.
          Tiedusteluun pyritään vastaamaan kohtuullisessa ajassa.
        </Text>

        <Text tag="h2" styleAs="h3" spacing="m">
          Saavutettavuuden oikeussuoja, Täytäntöönpanomenettely
        </Text>
        <Text tag="p" spacingBottom="xs">
          Mikäli henkilö kokee, ettei hänen ilmoitukseensa tai tiedusteluunsa ole vastattu tai
          vastaus ei ole tyydyttävä, voi asiasta tehdä ilmoituksen Etelä-Suomen
          aluehallintovirastoon. Etelä-Suomen aluehallintoviraston sivulla kerrotaan tarkasti, miten
          asia käsitellään.
        </Text>
        <Text tag="p" weight="bold">
          Etelä-Suomen aluehallintovirasto
        </Text>
        <Text tag="p">
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
        <Text tag="p" spacingBottom="xs">
          Kaupunki edistää digitaalisten palveluiden saavutettavuutta yhdenmukaistamalla
          julkaisutyötä ja järjestämällä saavutettavuuteen keskittyvää koulutusta henkilökunnalleen.
        </Text>
        <Text tag="p">
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
          Tämän selosteen on hyväksynyt 26.6.2023
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
