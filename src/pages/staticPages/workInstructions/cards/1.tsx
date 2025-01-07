import React from 'react';
import MainHeading from '../../../../common/components/mainHeading/MainHeading';
import Text from '../../../../common/components/text/Text';
import Puff from './Puff';
import AdditionalSummary from './AdditionalSummary';
import styles from './cards.module.scss';

const Card1Basic: React.FC = () => {
  return (
    <>
      <MainHeading spacingBottom="xl">1. Tiedotus eri osapuolille ja palaute</MainHeading>
      <Text styleAs="h2" tag="h2" spacingBottom="l">
        Vaadittava perustaso
      </Text>
      <Puff>
        <p>
          <b>
            Kerro alueen asukkaille, yrityksille ja muille toimijoille työmaasta vähintään viikkoa
            ennen sen alkua.
          </b>{' '}
          Työmaan aloittamisesta kertovassa tiedotteessa tulee kertoa:
        </p>
        <br></br>
        <ul>
          <li>työmaan tarkka</li>
          <li>aloituspäivämäärä, </li>
          <li>työmaan arvioitu kesto, </li>
          <li>mitä työmaalla tehdään,</li>
          <li>poikkeusreitit,</li>
          <li>mahdolliset muutokset joukkoliikenteeseen ja pysäkkeihin,</li>
          <li>päiväaikataulu, </li>
          <li>
            melua aiheuttavien työvaiheiden arvioitu ajankohta sekä urakoitsijan sekä rakennuttajan
            yhteystiedot.
          </li>
        </ul>
      </Puff>
      <article className={styles.content}>
        <p>
          <b>Valitse sopivat viestintäkanavat yhdessä tilaajan viestinnän kanssa,</b> ja
          joukkoliikenteestä tiedottaminen sovitaan yhdessä HSL:n kanssa. Herkkien kohteiden (kuten
          koulut, päiväkodit, sairaalat ja vanhainkodit) osalta on varauduttava neuvottelemaan
          työajoista ja kohteiden huomioimisesta rakentamisessa erikseen. Myös työmaan aikaisista
          häiriöistä viivästyksistä sekä työmaan loppumisesta tulee tiedottaa yhteistyössä tilaajan
          viestinnän kanssa. Helsingin Kaupunkiympäristön hankkeissa viestinnän yhteistyökumppanina
          on
          <a href="mailto:kymp.viestinta@hel.fi" className="hds-link" target="_blank">
            kymp.viestinta@hel.fi.
          </a>
        </p>
        <br></br>
        <p>
          <b>Viestinnän tulee olla selkeää, yleistajuista ja ymmärrettävää.</b> Pyri puhumaan
          aktiivissa passiivin sijaan. Älä esimerkiksi kirjoita työmaatauluun, että ”alueella
          saneerataan kunnallistekniikkaa”, vaan ”uusimme vesijohtoja ja viemäreitä”. Käytä vain
          selkeitä päälauseita.
        </p>
        <br></br>
        <p>
          <b>Työmailla seurataan palautteita ja vikailmoituksia,</b> joita kaupunkilaiset jättävät
          hankkeen omaan palautejärjestelmään tai Helsingin kaupungin hankkeissa kaupungin
          palautejärjestelmään (
          <a
            href="https://palautteet.hel.fi/"
            className="hds-link"
            target="_blank"
            aria-label="Palautejärjestelmä. Avautuu uuteen ikkunaan."
          >
            https://palautteet.hel.fi/
          </a>
          ). Niiden perusteella tehdään tarvittavat korjaukset. Esimerkiksi jalankulkijan
          infotaulussa ja työmaataulussa kannustetaan antamaan palautetta ja linkataan
          palautejärjestelmään. Myös QR-koodia voidaan hyödyntää.
        </p>
      </article>
      <AdditionalSummary>
        {' '}
        <ul>
          <li>Työmaan tapahtumat</li>
          <li>Jalkautuminen taloyhtiöiden, elinkeinoharjoittajien ja asukkaiden pariin</li>
          <li>Opastajat työmaalla</li>
          <li>Pikaviestitiedotteet</li>
          <li>Työmaan esittelykokonaisuus</li>
          <li>Viestintävastaava ja/tai sometiimi</li>
          <li>Työmaan viestintäkampanja</li>
          <li>Liikennetiedotteita voidaan jakaa myös Helsingin Uutisten uutisvirrassa</li>
        </ul>
      </AdditionalSummary>
    </>
  );
};

const Card1Additional: React.FC = () => {
  return (
    <>
      <h1>Card 1 Additional</h1>
    </>
  );
};

export { Card1Basic, Card1Additional };
