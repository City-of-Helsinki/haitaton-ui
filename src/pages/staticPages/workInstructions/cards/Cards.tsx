import React, { useEffect } from 'react';
import Text from '../../../../common/components/text/Text';
import Puff from './Puff';
import AdditionalSummary from './AdditionalSummary';
import styles from './cards.module.scss';
import { useBreadcrumbs } from '../WorkInstructionsPage';
import MainHeading from '../../../../common/components/mainHeading/MainHeading';
import { Trans, useTranslation } from 'react-i18next';
import { BREADCRUMBS } from '../Breadcrumbs';
import { useParams } from 'react-router-dom';
import { BreadcrumbListItem } from 'hds-react';

function Card1Basic() {
  const { t } = useTranslation();

  return (
    <>
      <MainHeading spacingBottom="xl">{t('workInstructions:cards:1:header')}</MainHeading>
      <Text styleAs="h2" tag="h2" spacingBottom="l">
        {t('workInstructions:cards:basicLevel')}
      </Text>
      <Puff>
        <Trans i8nKey="workInstructions:cards:1:puff">
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
              melua aiheuttavien työvaiheiden arvioitu ajankohta sekä urakoitsijan sekä
              rakennuttajanyhteystiedot.
            </li>
          </ul>
        </Trans>
      </Puff>
      <div className={styles.content}>
        <Trans
          i18nKey="workInstructions:cards:1:content"
          components={{ p: <p />, b: <b />, a: <a /> }}
        >
          <p>
            <b>Valitse sopivat viestintäkanavat yhdessä tilaajan viestinnän kanssa,</b> jaj
            oukkoliikenteestä tiedottaminen sovitaan yhdessä HSL:n kanssa. Herkkien kohteiden
            (kutenkoulut, päiväkodit, sairaalat ja vanhainkodit) osalta on varauduttava
            neuvottelemaan työajoista ja kohteiden huomioimisesta rakentamisessa erikseen. Myös
            työmaan aikaisista häiriöistä viivästyksistä sekä työmaan loppumisesta tulee tiedottaa
            yhteistyössä tilaajanviestinnän kanssa. Helsingin Kaupunkiympäristön hankkeissa
            viestinnän yhteistyökumppanina on
            <a href="mailto:kymp.viestinta@hel.fi" className="hds-link" target="_blank">
              kymp.viestinta@hel.fi.
            </a>
          </p>
          <br></br>
          <p>
            <b>Viestinnän tulee olla selkeää, yleistajuista ja ymmärrettävää.</b>
            Pyri puhumaanaktiivissa passiivin sijaan. Älä esimerkiksi kirjoita työmaatauluun, että
            ”alueella saneerataan kunnallistekniikkaa”, vaan ”uusimme vesijohtoja ja viemäreitä”.
            Käytä vainselkeitä päälauseita.
          </p>
          <br></br>
          <p>
            <b>Työmailla seurataan palautteita ja vikailmoituksia,</b>
            joita kaupunkilaiset jättävät hankkeen omaan palautejärjestelmään tai Helsingin
            kaupungin hankkeissa kaupungin palautejärjestelmään (
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
        </Trans>
      </div>
      <AdditionalSummary>
        <Trans
          i18nKey="workInstructions:cards:1:additionalLevelSummary"
          components={{ ul: <ul />, li: <li /> }}
        >
          <ul>
            <li>Varmista jalankulun turvallisuus ja esteettömyys</li>
            <li>Varmista kulkuyhteydet kiinteistöihin</li>
            <li>Tee yhteensovitus muiden hankkeiden ja töiden sekä niiden kiertoreittien kanssa</li>
            <li>
              Ilmoita aina katujen sulkemisesta liikenteeltä Pelastuslaitokselle ja Poliisille
            </li>
            <li>Tarkista aina, onko hankkeesi tai työsi erikoiskuljetusten reitillä</li>
            <li>
              Tarkista vaikutukset olevaan liikennevalo-ohjaukseen (kaistajärjestelyt,
              ilmaisimet,valojen toimivuus)
            </li>
            <li>Poikkeavat työajat</li>
          </ul>
        </Trans>
      </AdditionalSummary>
    </>
  );
}

const Card1Additional: React.FC = () => {
  return (
    <>
      <h1>Card 1 Additional</h1>
    </>
  );
};

const Card: React.FC = () => {
  const { number = '', type = '' } = useParams<{ number: string; type: string }>();
  const { setBreadcrumbs } = useBreadcrumbs();
  const { t } = useTranslation();

  useEffect(() => {
    const breadcrumb: BreadcrumbListItem = {
      title: `workInstructions:cards:${number}:header`,
      path: '',
    };

    const updateBreadcrumbs = () =>
      setBreadcrumbs([BREADCRUMBS.cardsIndex, breadcrumb, BREADCRUMBS.basicLevel]);

    updateBreadcrumbs();
  }, [setBreadcrumbs, number, type]);

  const renderCard = (cardNumber: string) => {
    switch (cardNumber) {
      case '1':
        return type === t('routes:CARD:basicLevel') ? <Card1Basic /> : <Card1Additional />;
      /*case '2':
        return type === 'basic' ? <Card2Basic /> : <Card2Additional />;
      case '3':
        return type === 'basic' ? <Card3Basic /> : <Card3Additional />;
      case '4':
        return type === 'basic' ? <Card4Basic /> : <Card4Additional />;
      case '5':
        return type === 'basic' ? <Card5Basic /> : <Card5Additional />;
      case '6':
        return type === 'basic' ? <Card6Basic /> : <Card6Additional />;
      case '7':
        return type === 'basic' ? <Card7Basic /> : <Card7Additional />;
      case '8':
        return type === 'basic' ? <Card8Basic /> : <Card8Additional />;
      case '9':
        return type === 'basic' ? <Card9Basic /> : <Card9Additional />;
      case '10':
        return type === 'basic' ? <Card10Basic /> : <Card10Additional />;*/
      default:
        return <div>{t('workInstructions:cards:notFound')}</div>;
    }
  };

  return <>{renderCard(number)}</>;
};

export { Card1Basic, Card1Additional, Card };
