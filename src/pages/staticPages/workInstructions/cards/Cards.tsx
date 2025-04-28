import React, { useEffect } from 'react';
import Text from '../../../../common/components/text/Text';
import Puff from '../../Puff';
import AdditionalSummary from './AdditionalSummary';
import styles from './cards.module.scss';
import MainHeading from '../../../../common/components/mainHeading/MainHeading';
import { Trans, useTranslation } from 'react-i18next';
import { BREADCRUMBS, useBreadcrumbs } from '../../../../common/components/breadcrumbs/Breadcrumbs';
import { useParams } from 'react-router-dom';
import { BreadcrumbListItem, Link } from 'hds-react';
import card2Img from './card2-img.png';
import card3Img1 from './card3-img1.png';
import card3Img2 from './card3-img2.png';
import card5Img1 from './card5-img1.png';
import card5Img2 from './card5-img2.png';
import card5Img3 from './card5-img3.png';
import card6Img1 from './card6-img1.png';
import card7Img1 from './card7-img1.png';
import card7Img2 from './card7-img2.png';
import card7Img3 from './card7-img3.png';
import { useLocalizedRoutes } from '../../../../common/hooks/useLocalizedRoutes';

const Card1Basic: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <MainHeading spacingBottom="xl">{t('workInstructions:cards:card1:header')}</MainHeading>
      <Text styleAs="h2" tag="h2" spacingBottom="l">
        {t('workInstructions:cards:basicLevel')}
      </Text>
      <Puff>
        <Trans i8nKey="workInstructions:cards:card1:puff">
          <p>
            <strong>
              Kerro alueen asukkaille, yrityksille ja muille toimijoille työmaasta vähintään viikkoa
              ennen sen alkua.
            </strong>{' '}
            Työmaan aloittamisesta kertovassa tiedotteessa tulee kertoa:
          </p>
          <br></br>
          <ul>
            <li>työmaan tarkka aloituspäivämäärä, </li>
            <li>työmaan arvioitu kesto, </li>
            <li>mitä työmaalla tehdään,</li>
            <li>poikkeusreitit,</li>
            <li>mahdolliset muutokset joukkoliikenteeseen ja pysäkkeihin,</li>
            <li>päiväaikataulu, </li>
            <li>
              melua aiheuttavien työvaiheiden arvioitu ajankohta sekä urakoitsijan sekä
              rakennuttajan yhteystiedot.
            </li>
          </ul>
        </Trans>
      </Puff>
      <div className={styles.content}>
        <Trans
          i18nKey="workInstructions:cards:card1:content"
          components={{ p: <p />, strong: <strong />, a: <a /> }}
        >
          <p>
            <strong>Valitse sopivat viestintäkanavat yhdessä tilaajan viestinnän kanssa,</strong> ja
            joukkoliikenteestä tiedottaminen sovitaan yhdessä HSL:n kanssa. Herkkien kohteiden
            (kuten koulut, päiväkodit, sairaalat ja vanhainkodit) osalta on varauduttava
            neuvottelemaan työajoista ja kohteiden huomioimisesta rakentamisessa erikseen. Myös
            työmaan aikaisista häiriöistä, viivästyksistä sekä työmaan loppumisesta tulee tiedottaa
            yhteistyössä tilaajan viestinnän kanssa. Helsingin Kaupunkiympäristön hankkeissa
            viestinnän yhteistyökumppanina on
            <a href="mailto:kymp.viestinta@hel.fi" className="hds-link" target="_blank">
              kymp.viestinta@hel.fi.
            </a>
          </p>
          <br></br>
          <p>
            <strong>Viestinnän tulee olla selkeää, yleistajuista ja ymmärrettävää.</strong>
            Pyri puhumaan aktiivissa passiivin sijaan. Älä esimerkiksi kirjoita työmaatauluun, että
            ”alueella saneerataan kunnallistekniikkaa”, vaan ”uusimme vesijohtoja ja viemäreitä”.
            Käytä vainselkeitä päälauseita.
          </p>
          <br></br>
          <p>
            <strong>Työmailla seurataan palautteita ja vikailmoituksia,</strong>
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
          i18nKey="workInstructions:cards:card1:additionalLevelSummary"
          components={{ ul: <ul />, li: <li /> }}
        >
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
        </Trans>
      </AdditionalSummary>
    </>
  );
};

const Card1Additional: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <MainHeading spacingBottom="xl">{t('workInstructions:cards:card1:header')}</MainHeading>
      <Text styleAs="h2" tag="h2" spacingBottom="l">
        {t('workInstructions:cards:additionalLevel')}
      </Text>
      <div className={styles.content}>
        <Trans
          i18nKey="workInstructions:cards:card1:additionalLevelContent"
          components={{
            p: <p />,
            h3: <h3 />,
            a: (
              <Link
                href="https://oma.media.fi/lehti/helsingin-uutiset/yhteystiedot/laheta-juttuvinkki/"
                external
                openInNewTab
                openInNewTabAriaLabel={t('common:components:link:openInNewTabAriaLabel')}
                openInExternalDomainAriaLabel={t(
                  'common:components:link:openInExternalDomainAriaLabel',
                )}
                style={{ fontSize: 'var(--fontsize-body-l)' }}
              >
                linktext
              </Link>
            ),
          }}
        >
          <h3>Työmaan tapahtumat</h3>
          <p>
            Voit sopia tilaajan kanssa työmaalla järjestettävistä tapahtumista lähialueen asukkaille
            ja ohikulkijoille. Näitä voivat olla esimerkiksi työmaan aloituspäivänä pidettävät
            avajaiset, asukasillat ja työmaapäivystykset.
          </p>
          <br />
          <h3>Jalkautuminen taloyhtiöiden, elinkeinoharjoittajien ja asukkaiden pariin</h3>
          <p>
            Rakenna keskusteluyhteys työmaan ympäröivien sidosryhmien parissa. Jaa yhteystietoja ja
            keskustele. Pelkkä sähköposti ei riitä. Keskustele taloyhtiön kanssa tiedottamisesta.
            Tiedote voi olla lappu postilaatikossa tai rappukäytävän ovessa, myöhemmin sähköposti,
            jos näin sovit. On suositeltavaa jakaa tietoa myös alueen omissa Facebook-ryhmissä, jos
            se niissä sallitaan. Jalkaudu sinne, missä ihmiset ovat, älä oleta, että heistä kaikki
            tulee seuraamaan itse ylläpitämiäsi kanavia, jossa jaat tietoa.
          </p>
          <br />
          <h3>Opastajat työmaalla</h3>
          <p>
            Työmaan ensimmäisinä päivinä paikalla on keltaisiin infoliiveihin pukeutuneita
            työmaaoppaita neuvomassa kaupunkilaisia, vastaamassa heidän kysymyksiinsä ja jakamassa
            työmaa-alueen karttoja.
          </p>
          <br />
          <h3>Pikaviestitiedotteet</h3>
          <p>
            Haastavissa kohteissa voidaan ottaa käyttöön tilattavat tiedotteet tekstiviesteinä tai
            muun sovitun pikaviestipalvelun kautta. Monella työmaalla on ollut käytössä
            WhatsApp-ryhmä, jossa kerrotaan työmaan aikatauluista ja välitetään tilannetietoja
            vähintään kerran viikossa. Jos työmaan viestinnässä on käytössä esim. WhatsApp, tulee
            työmaataulussa kertoa siitä.
          </p>
          <br />
          <h3>Työmaan esittelykokonaisuus</h3>
          <p>
            Työmaata esitellään laajemmin esimerkiksi kontin tai seinäkkeen avulla.
            Esittelykokonaisuudessa kerrotaan tarkemmin tehtävästä työstä, sen vaiheista,
            erityispiirteistä ja suunnitelmista. Lisäksi esitellään työmaan suunniteltu lopputulos
            ja sen vaikutuksia kaupunkilaisille.
          </p>
          <br />
          <h3>Viestintävastaava ja/tai sometiimi</h3>
          <p>
            Työmaan viestintävastaava on urakoitsijan tehtävään osoittama henkilö, joka on tiiviisti
            mukana työmaan arjessa ja kokouksissa. Hän toteuttaa työmaan viestintäsuunnitelmaa
            yhdessä tilaajan viestinnän ja muiden toimijoiden kanssa. Viestintävastaavan ansiosta
            viestintä työmaalta kaupunkilaisille on sujuvaa ja ajantasaista. Suuremmilla ja
            vaikuttavuudeltaan merkittävillä työmailla harkitse sometiimin perustamista. Jos työmaa
            on merkittävä vaikutuksiltaan, tulee erityisesti kiinnittää huomiota viestintään.
          </p>
          <br />
          <h3>Työmaan viestintäkampanja</h3>
          <p>
            Vaikutuksiltaan merkittävälle työmaalle suunnitellaan viestinnällinen kampanja, jossa
            voidaan hyödyntää esimerkiksi kaupungissa olevia digitaalisia mainostauluja tai
            urakoitsijan omia digitaalisia näyttöjä työmaa-alueella ja sen läheisyydessä.
            Viestintäkampanjan toteutustavasta, kestosta ja laajuudesta sovitaan yhdessä tilaajan
            kanssa.
          </p>
          <br />
          <h3>Liikennetiedotteita voidaan jakaa myös Helsingin Uutisten uutisvirrassa</h3>
          <p>
            Ole yhteydessä:
            <a href="https://oma.media.fi/lehti/helsingin-uutiset/yhteystiedot/laheta-juttuvinkki/">
              Lähetä juttuvinkki Helsingin Uutisiin
            </a>
          </p>
        </Trans>
      </div>
    </>
  );
};

const Card2Basic: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <MainHeading spacingBottom="xl">{t('workInstructions:cards:card2:header')}</MainHeading>
      <Text styleAs="h2" tag="h2" spacingBottom="l">
        {t('workInstructions:cards:basicLevel')}
      </Text>
      <div className={styles.content}>
        <Trans
          i18nKey="workInstructions:cards:card2:content"
          components={{
            p: <p />,
            strong: <strong />,
            a: (
              <Link
                href=""
                external
                openInNewTab
                openInNewTabAriaLabel={t('common:components:link:openInNewTabAriaLabel')}
                openInExternalDomainAriaLabel={t(
                  'common:components:link:openInExternalDomainAriaLabel',
                )}
                style={{ fontSize: 'var(--fontsize-body-l)' }}
              >
                linktext
              </Link>
            ),
          }}
        >
          <p>
            <strong>
              Sulkupuomi tai –aita on jalankulkijoita ja pyöräilijöitä varten olevalle reitille
              opastavien liikennemerkkien kohdalla.
            </strong>{' '}
            Sen on sijaittava täsmälleen suojatien kohdalla, jotta näkövammainen pääsee oikealle
            reitille.
          </p>
          <br />
          <p>
            <strong>
              Sulkuaitoihin kiinnitettävien merkkien alareunan tulee olla vähintään metrin
              korkeudella.
            </strong>
          </p>
          <br />
          <p>
            <strong>
              Ajorata ja reunakivi on luiskattava samalle korkeudelle kolmen senttimetrin pykälällä,
            </strong>{' '}
            jos auto-, kävely- ja pyöräteillä liikkuvia joudutaan ohjaamaan reunakiven yli. Myös
            esimerkiksi kaapelikourut on luiskattava. Jos työmaalla käytetään liikennevaloja, niiden
            tulee noudattaa esteettömyysohjeistuksia.
          </p>
          <br />
          <p>
            <strong>Esteetön reitti opastetaan esteettömän reitin opastemerkeillä.</strong> Jos
            reitti ei ole esteetön, tee ilmoitus Näkövammaisten liittoon väliaikaisista
            järjestelyistä. Ääniopastus tulee huomioida myös työmaan aikana.
          </p>
        </Trans>
      </div>
      <Puff>
        <p>
          <strong>
            Jalankulku- ja pyöräilyreittien pinnoitteen tulee olla tasainen ja reittien riittävän
            loivia,
          </strong>{' '}
          jotta esimerkiksi pyörätuolilla tai lastenvaunujen kanssa pääsee kulkemaan mahdollisimman
          sujuvasti. Päällystetyllä jalkakäytävällä tai pyörätiellä ei saa olla murskepintaisia
          osuuksia, jotka vaikeuttavat esimerkiksi pyörätuolilla liikkumista. Väliaikaisella
          reitillä sallitaan myös tiivistetty kivituhkapäällyste.
        </p>
      </Puff>
      <div className={styles.content}>
        <Trans
          i18nKey="workInstructions:cards:card2:content2"
          components={{
            p: <p />,
            h3: <h3 />,
            a1: (
              <Link
                href="https://www.hel.fi/static/hki4all/ohjeet/2022/suraku-kortti-1.pdf"
                external
                openInNewTab
                openInNewTabAriaLabel={t('common:components:link:openInNewTabAriaLabel')}
                openInExternalDomainAriaLabel={t(
                  'common:components:link:openInExternalDomainAriaLabel',
                )}
                style={{ fontSize: 'var(--fontsize-body-l)' }}
              >
                linktext
              </Link>
            ),
            a2: (
              <Link
                href={t('workInstructions:cards:card2:link2Url')}
                external
                openInNewTab
                openInNewTabAriaLabel={t('common:components:link:openInNewTabAriaLabel')}
                openInExternalDomainAriaLabel={t(
                  'common:components:link:openInExternalDomainAriaLabel',
                )}
                style={{ fontSize: 'var(--fontsize-body-l)' }}
              >
                linktext
              </Link>
            ),
          }}
        >
          <p>
            Jos reitillä on kaivanto, sen kohdalle on asetettava työn ajaksi silta tai väliaikainen
            päällyste. Siinä tapauksessa, että alue joudutaan jättämään ilman päällystettä
            korkeintaan vuorokaudeksi, se on merkittävä liikennemerkeillä ja erittäin selvästi
            näkyvillä suojauslaitteilla.
          </p>
          <br />
          <p>
            Päällysteen saumassa ei saa olla pykälää. Päällystämätöntä kohtaa ei saa jättää pitkään
            mäkeen, jossa se voi olla vaarallinen pyöräilijöille tai rullaluistelijoille. Terävät
            asfalttireunat on kulkusuunnassa viistettävä esimerkiksi kylmäasfalttimassalla
            ohjeistuksien mukaiseen kaltevuuteen.
          </p>
          <br />
          <h3>Ohjeet</h3>
          <br />
          <a href="https://www.hel.fi/static/hki4all/ohjeet/2022/suraku-kortti-1.pdf">
            SuRaKu-kortti Suojatiet ja jalkakäytävät{' '}
          </a>
          <br />
          <a href="https://helsinkikaikille.hel.fi/ohjeita-esteettomyyden-toteuttamiseen/helsingin-kaupungin-ohjeet-ulkoalueille/">
            Suojateitä koskevat tyyppipiirustukset
          </a>
        </Trans>
      </div>
      <AdditionalSummary>
        <Trans
          i18nKey="workInstructions:cards:card2:additionalLevelSummary"
          components={{ ul: <ul />, li: <li /> }}
        >
          <ul>
            <li>Esteettömän reitin kartta</li>
            <li>Esteettömyyskävely</li>
            <li>Pohja-asfaltointi</li>
            <li>Täristävät hidastetarrat pyöräilijöille </li>
            <li>Piilotetut johdot ja kaapelit</li>
            <li>Talvikunnossapidon huomiointi</li>
            <li>Tiedotus tilapäisistä reiteistä</li>
          </ul>
        </Trans>
      </AdditionalSummary>
    </>
  );
};

const Card2Additional: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <MainHeading spacingBottom="xl">{t('workInstructions:cards:card2:header')}</MainHeading>
      <Text styleAs="h2" tag="h2" spacingBottom="l">
        {t('workInstructions:cards:additionalLevel')}
      </Text>
      <div className={styles.content}>
        <Trans
          i18nKey="workInstructions:cards:card2:additionalLevelContent"
          components={{
            p: <p />,
            h3: <h3 />,
            a: (
              <Link
                href="mailto:toimisto@hun.fi"
                aria-labelledby={`${t('components:link:mailTo')}: toimisto@hun.fi`}
                style={{ fontSize: 'var(--fontsize-body-l)' }}
              >
                linktext
              </Link>
            ),
          }}
        >
          <h3>Esteettömän reitin kartta </h3>
          <p>Työmaalle sijoitettaviin karttoihin merkitään esteetön reitti symbolilla</p>
          <br />
          <h3>Esteettömyyskävely</h3>
          <p>Suunnitellaan ja toteutetaan työmaalla esteettömyyskävely.</p>
          <br />
          <h3>Pohja-asfaltointi</h3>
          <p>Työmaalla käytetään asfaltointia kulkuväylillä sekä väliaikaisissa luiskissa.</p>
          <br />
          <h3>Täristävät hidastetarrat pyöräilijöille </h3>
          <p>
            Tarvittaviin kohtiin lisätään ns. tärinäraidat, jotka hidastavat luonnollisesti
            pyöräilijöiden vauhtia työmaan kohdalla.
          </p>
          <br />
          <h3>Piilotetut johdot ja kaapelit</h3>
          <p>
            Työmaalla johdot ja kaapelit on piilotettu, asfaltoitu tai koteloitu esteettömyys
            huomioiden.
          </p>
          <br />
          <h3>Talvikunnossapidon huomiointi</h3>
          <p>
            Työmaalla on mietitty myös talvikunnossapitoa, ja esimerkiksi pyöräbaanoilla suositaan
            harjasuolausta
          </p>
          <br />
          <h3>Tiedotus tilapäisistä reiteistä </h3>
          <p>
            Näkövammaisten liittoa tulee informoida työmaan muutoksista ja reiteistä (
            <a href="mailto:toimisto@hun.fi">toimisto@hun.fi</a>).
          </p>
        </Trans>
        <div className={styles.images}>
          <div className={styles.imgContainer}>
            <img src={card2Img} alt={t('workInstructions:cards:card2:image1AltText')}></img>
            <p>{t('workInstructions:cards:pictureBy')}: Silja Laine, Ramboll</p>
          </div>
        </div>
      </div>
    </>
  );
};

const Card3Basic: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <MainHeading spacingBottom="xl">{t('workInstructions:cards:card3:header')}</MainHeading>
      <Text styleAs="h2" tag="h2" spacingBottom="l">
        {t('workInstructions:cards:basicLevel')}
      </Text>
      <Puff>
        <Trans
          i18nKey="workInstructions:cards:card3:puff"
          components={{
            p: <p />,
            strong: <strong />,
          }}
        >
          <p>
            <strong>Jalankulku tulee ohjata työmaan ohi yhtenäisesti merkittyä reittiä,</strong>{' '}
            joka on erotettu ajoradasta sulkulaitteiden avulla aina kun se on mahdollista. Muutoin
            jalankulkijat opastetaan vakituisten suojateiden kohdalta tien toiselle puolelle.
            Jalankulkijat eivät missään vaiheessa saa joutua ohittamaan työmaata liikenteen seassa
            ajoradan kautta. Jalankulkijoiden pääreitin pitää olla mahdollisimman selkeä.
            Jalankulkijoille tulee tarjota riittävän tiheästi reittejä, joiden avulla työmaan tai
            autotien voi ylittää turvallisesti. Reittejä tulee myös kehittää edelleen työmaan
            aikana.
          </p>
        </Trans>
      </Puff>

      <div className={styles.content}>
        <Trans
          i18nKey="workInstructions:cards:card3:content"
          components={{
            p: <p />,
            h3: <h3 />,
            br: <br />,
            a1: (
              <Link
                href="https://www.hel.fi/static/hki4all/ohjeet/2022/suraku-kortti-1.pdf"
                external
                openInNewTab
                openInNewTabAriaLabel={t('common:components:link:openInNewTabAriaLabel')}
                openInExternalDomainAriaLabel={t(
                  'common:components:link:openInExternalDomainAriaLabel',
                )}
                style={{ fontSize: 'var(--fontsize-body-l)' }}
              >
                linktext
              </Link>
            ),
            a2: (
              <Link
                href={t('workInstructions:cards:card2:link2Url')}
                external
                openInNewTab
                openInNewTabAriaLabel={t('common:components:link:openInNewTabAriaLabel')}
                openInExternalDomainAriaLabel={t(
                  'common:components:link:openInExternalDomainAriaLabel',
                )}
                style={{ fontSize: 'var(--fontsize-body-l)' }}
              >
                linktext
              </Link>
            ),
          }}
        >
          <p>
            <strong>
              Vapaan reitin leveyden tulee olla yksinomaan jalankulkijoille vähintään 1,5 metriä ja
              vapaan korkeuden 2,2 metriä.
            </strong>
            Jos leveämpää tilaa ei pystytä järjestämään, jalkakäytävä voi olla 1,2 metriä leveä.
            Väyliä kavennettaessa tulee huomioida, miten väylää voidaan pitää kunnossa. Jos
            kaventaminen estää normaalin kaluston käyttämisen kunnossapidossa, se voi vaikuttaa
            kunnossapitovastuisiin. Vastuurajat käydään läpi sopimusvaiheessa.
          </p>
          <br />
          <p>
            <strong>
              Työmaalle suunnitellut reititykset tulee käydä läpi kohteessa esimerkiksi kävelemällä
              tai pyöräilemällä.
            </strong>
            Samalla voidaan tarkistaa, minne kävelyn ja pyöräilyn opasteet tulee sijoittaa sekä
            arvioida miten helppo liiketiloihin ja kiinteistöihin on päästä jalan ja pyörällä.
          </p>
          <p>
            <strong>
              Käytöstä poissaolevien liikennevalojen valot tulee huputtaa ja napit tarvittaessa
              peittää.
            </strong>
            Käytöstä poissaolevat liikennemerkit tulee huputtaa tai poistaa (myös työmaa-aitauksen
            sisälle jäävät) työn ajaksi, samoin kadunpintaan maalatut liikenteen ohjausmerkinnät,
            jotka ovat ristiriitaisia väliaikaisten liikennejärjestelyjen kanssa, poistetaan
            jyrsimällä. Ääniopastus tulee huomioida myös työmaan aikana.
          </p>
          <br />
          <p>
            <strong>
              Liikenteenohjaajia tulee käyttää, kun alueella on paljon erityisryhmiä (esim. lapsia).
            </strong>
            Liikenteenohjaajia on käytettävä myös tehtäessä lyhytaikaisia töitä alueella, joka ei
            ole aidattu ja jonne on pääsy käytöissä olevilta väyliltä.
          </p>
          <br />
          <p>
            <strong>Suojateiden tulee olla esteettömiä ja turvallisia koko työmaan ajan.</strong>{' '}
            Erityisesti täytyy huomioida kulkuväylien tasaisuus ja kaltevuus. On myös tärkeää, että
            kaikki työmaa-alueen suojatiet on toteutettu kuivatuksen kannalta huolellisesti ja
            valaistu hyvin. Suojateiden turvallisuuteen on kiinnitettävä erityisesti huomiota
            puistojen, vanhainkotien ja vammaispalveluiden läheisyydessä sekä alueella, jolla
            liikkuu lapsia. Suojateiden kohdalla työmaa-aidan tulee olla niin havaittava, että
            ajoneuvoliikenteen kuljettajat pystyvät näkemään suojatielle astuvat pienet lapset. Jos
            suojateitä joudutaan sulkemaan tai siirtämään tulee varmistaa, että korvaava yhteys on
            riittävän lähellä, jotta kadun ylitys ei tapahtuisi suojatiettömästä kohdasta.
            Siirretyistä, tilapäisistä suojateista ilmoitetaan opasteella, joka kertoo suojatien
            suunnan ja etäisyyden metreissä.
          </p>
          <br />
          <p>
            <strong>
              Tilapäiset suojatiet on sijoitettava liikenneturvallisuuden ylläpitämisen kannalta
              olennaisiin paikkoihin.
            </strong>
            Tässä on tärkeää huomioida muun muassa näkymät ja jalankulkureitit. Tarvittaessa on
            lisäksi laskettava pysyvää nopeusrajoitusta pistemäisesti. Ajoneuvoliikennettä on
            varoitettava muuttuneista suojatiejärjestelyistä merkillä 151 (Suojatien
            ennakkovaroitus). Vilkkaalla tiellä on käytettävä siirrettäviä liikennevaloja.
          </p>
          <br />
          <h3>Ohjeet</h3>
          <br />
          <a href="https://www.hel.fi/static/hki4all/ohjeet/2022/suraku-kortti-1.pdf">
            SuRaKu-kortti Suojatiet ja jalkakäytävät{' '}
          </a>
          <br />
          <a href="https://helsinkikaikille.hel.fi/ohjeita-esteettomyyden-toteuttamiseen/helsingin-kaupungin-ohjeet-ulkoalueille/">
            Suojateitä koskevat tyyppipiirustukset
          </a>
        </Trans>
      </div>
      <AdditionalSummary>
        <Trans
          i18nKey="workInstructions:cards:card3:additionalLevelSummary"
          components={{ ul: <ul />, li: <li /> }}
        >
          <ul>
            <li>Asiantuntijat ja kokemusasiantuntijat</li>
            <li>Lisäliikennevalot</li>
            <li>Korostettu suojatie</li>
            <li>Teipattu suojatie</li>
            <li>Etäisyys suojatiehen</li>
            <li>Tiedotus tilapäisistä reiteistä</li>
          </ul>
        </Trans>
      </AdditionalSummary>
    </>
  );
};

const Card3Additional: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <MainHeading spacingBottom="xl">{t('workInstructions:cards:card3:header')}</MainHeading>
      <Text styleAs="h2" tag="h2" spacingBottom="l">
        {t('workInstructions:cards:additionalLevel')}
      </Text>
      <div className={styles.content}>
        <Trans
          i18nKey="workInstructions:cards:card3:additionalLevelContent"
          components={{
            p: <p />,
            h3: <h3 />,
            a: (
              <Link
                href="mailto:toimisto@hun.fi"
                aria-labelledby={`${t('components:link:mailTo')}: toimisto@hun.fi`}
                style={{ fontSize: 'var(--fontsize-body-l)' }}
              >
                linktext
              </Link>
            ),
          }}
        >
          <h3>Asiantuntijat ja kokemusasiantuntijat</h3>
          <p>
            Työmaan reittejä ja opastusta suunnitellessa hyödynnetään asiantuntijoita ja
            kokemusasiantuntijoita.
          </p>
          <br />
          <h3>Lisäliikennevalot</h3>
          <p>
            Alueen suojateillä hyödynnetään lisäliikennevaloja, vaikka liikennemäärät eivät sitä
            vaadi.
          </p>
          <br />
          <h3>Korostettu suojatie</h3>
          <p>
            Työmaa-alueella olevien suojateiden näkyvyyteen kiinnitetään erityistä huomiota muun
            muassa vilkkuvien huomiovalojen, varoitusheijastintolppien ja autoilijoille
            tarkoitettujen väliaikaisten hidastetöyssyjen avulla sekä lisäämällä suojatielle
            lisävalo valaisemaan aluetta. Toteutuksessa noudatetaan viranomaisvaatimuksia.
          </p>
          <br />
          <h3>Teipattu suojatie</h3>
          <p>Työmaalla hyödynnetään teipattua tilapäistä suojatietä (valkoiset suojatietarrat).</p>
          <br />
          <h3>Etäisyys suojatiehen</h3>
          <p>Kerrotaan kadunkäyttäjille etäisyys suojatiehen (kumpaankin suuntaan).</p>
          <br />
          <h3>Tiedotus tilapäisistä reiteistä</h3>
          <p>
            Näkövammaisten liittoa tulee informoida työmaan muutoksista ja reiteistä (
            <a href="mailto:toimisto@hun.fi">toimisto@hun.fi</a>).
          </p>
        </Trans>
        <div className={styles.images}>
          <div className={styles.imgContainer}>
            <img src={card3Img1} alt={t('workInstructions:cards:card3:image1AltText')}></img>
            <p>{t('workInstructions:cards:pictureBy')}: Susa Junnola</p>
          </div>
          <div className={styles.imgContainer}>
            <img src={card3Img2} alt={t('workInstructions:cards:card3:image2AltText')}></img>
            <p>{t('workInstructions:cards:pictureBy')}: Ramudden</p>
          </div>
        </div>
      </div>
    </>
  );
};

const Card4Basic: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <MainHeading spacingBottom="xl">{t('workInstructions:cards:card4:header')}</MainHeading>
      <Text styleAs="h2" tag="h2" spacingBottom="l">
        {t('workInstructions:cards:basicLevel')}
      </Text>
      <Puff>
        <Trans
          i18nKey="workInstructions:cards:card4:puff"
          components={{
            p: <p />,
            strong: <strong />,
          }}
        >
          <p>
            <strong>
              Pyöräliikenne tulee huomioida ajoradan ajojärjestelyissä kaduilla, joilla ei ole
              erillistä pyöräliikenteen väylää.
            </strong>{' '}
            Vilkkaimmilla kaduilla pyöräliikenne on eroteltu moottoriajoneuvoliikenteestä omalle
            väylälleen. Väylät voivat olla yksi- tai kaksisuuntaisia. Helsingissä jalankulku ja
            pyöräliikenne on yleensä lisäksi eroteltu toisistaan. Jokaisella työmaalla tulee
            huolehtia siitä, että pyöräliikenteen yhteydet jatkuvat loogisesti kulkusuuntaan nähden.
            Lisäksi pyörällä on päästävä mm. sivukaduille ja kiinteistöille.
          </p>
        </Trans>
      </Puff>
      <div className={styles.content}>
        <Trans
          i18nKey="workInstructions:cards:card4:content"
          components={{
            p: <p />,
            h3: <h3 />,
            strong: <strong />,
            a: (
              <Link
                href="https://www.hel.fi/static/hkr/luvat/pyoraliikenteen_tyomaaohje.pdf"
                external
                openInNewTab
                openInNewTabAriaLabel={t('common:components:link:openInNewTabAriaLabel')}
                openInExternalDomainAriaLabel={t(
                  'common:components:link:openInExternalDomainAriaLabel',
                )}
                style={{ fontSize: 'var(--fontsize-body-l)' }}
              >
                linktext
              </Link>
            ),
          }}
        >
          <p>
            <strong>
              Pyöräliikenne ja jalankulkijat pyritään erottamaan toisistaan myös työmaan aikana.
            </strong>{' '}
            Tämä voi edellyttää väylien tilapäistä kaventamista tai tilan lainaamista esimerkiksi
            ajoradan pysäköinniltä. Pyörätien leveys mitoitetaan käyttäjämäärän perusteella.
            Kaksisuuntaisen pyörätien on kuitenkin oltava vähintään 2 metriä leveä.
          </p>
          <br />
          <p>
            <strong>
              Poikkeustilanteissa erotellun väylän tilalla käytettävän yhdistetyn jalankulun ja
              pyöräliikenteen väylän tulee olla vähintään 3 metriä leveä,
            </strong>{' '}
            jotta molemmat kulkumuodot mahtuvat liikkumaan. Jos osuus on lyhyt ja jalankulkijoita on
            vähän, 2,5 metriä riittää.
          </p>
          <br />
          <p>
            <strong>
              Yksisuuntaisten pyöräteiden tai -kaistojen liikenne voidaan ohjata ajoradalle
              pyöräkaistoille tai sekaliikenteeseen turvallisten siirtymäkohtien avulla, jos
              ajoradan liikennemäärä on melko pieni ja nopeusrajoitus on alhainen (max 30 km/h).
              Kaksisuuntaisen pyörätien liikennettä ei voi osoittaa sekaliikenteeseen.{' '}
            </strong>{' '}
            Ajoradan puolelle väliaikaisesti siirrettävä kaksisuuntainen pyörätie tulee erotella
            raskaalla törmäyssuojalla ajoradan autoliikenteestä. Jalankulkijoiden ja pyöräilijöiden
            pääreitin tulee olla mahdollisimman selkeä. Pyöräilijöille täytyy tarjota riittävän
            tiheästi reittejä, joita pitkin työmaan tai autotien voi ylittää turvallisesti. Reittejä
            tulee kehittää edelleen myös työmaan aikana.
          </p>
          <br />
          <p>
            <strong>
              Työmaalle suunnitellut reititykset tulee käydä läpi kohteessa esimerkiksi kävelemällä
              tai pyöräilemällä.
            </strong>{' '}
            Samalla voidaan tarkistaa, minne kävelyn ja pyöräilyn opasteet tulee sijoittaa sekä
            arvioida miten helppo liiketiloihin ja kiinteistöihin on päästä jalan ja pyörällä.
          </p>
          <br />
          <p>
            <strong>
              Käytöstä poissaolevien liikennevalojen valot tulee huputtaa ja napit tarvittaessa
              peittää.
            </strong>{' '}
            Käytöstä poissaolevat liikennemerkit tulee huputtaa tai poistaa (myös työmaa-aitauksen
            sisälle jäävät) työn ajaksi, samoin kadunpintaan maalatut liikenteen ohjausmerkinnät,
            jotka ovat ristiriitaisia väliaikaisten liikennejärjestelyjen kanssa, poistetaan
            jyrsimällä.
          </p>
          <br />
          <p>
            <strong>
              Liikenteenohjaajia tulee käyttää, kun alueella on paljon erityisryhmiä (esim. lapsia).
            </strong>{' '}
            Liikenteenohjaajia on käytettävä myös tehtäessä lyhytaikaisia töitä alueella, joka ei
            ole aidattu ja jonne on pääsy käytöissä olevilta väyliltä.
          </p>
          <br />
          <p>
            <strong>Mikäli pyörätelineitä joudutaan poistamaan käytöstä työmaan ajaksi,</strong>{' '}
            työmaan läheisyyteen kasataan väliaikainen pyöräteline. Siihen tulee mahtua yhtä monta
            pyörää kuin poistettuun telineeseen. Kaupunkipyöräasemien osalta tulee olla yhteydessä
            Kaupunkiliikenne Oy:öön, jotta korvaava sijainti löydetään.
          </p>
          <br />
          <h3>Ohjeet</h3>
          <br />
          <a href="https://www.hel.fi/static/hkr/luvat/pyoraliikenteen_tyomaaohje.pdf">
            Pyöräliikenteen suunnitteluohje: Työmaat ja tapahtumat
          </a>
        </Trans>
      </div>
      <AdditionalSummary>
        <Trans
          i18nKey="workInstructions:cards:card4:additionalLevelSummary"
          components={{ ul: <ul />, li: <li /> }}
        >
          <ul>
            <li>Täristävät hidastetarrat pyöräilijöille</li>
            <li>Peilit tiukoissa mutkissa</li>
            <li>Asiantuntijat ja kokemusasiantuntijat</li>
          </ul>
        </Trans>
      </AdditionalSummary>
    </>
  );
};

const Card4Additional: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <MainHeading spacingBottom="xl">{t('workInstructions:cards:card4:header')}</MainHeading>
      <Text styleAs="h2" tag="h2" spacingBottom="l">
        {t('workInstructions:cards:additionalLevel')}
      </Text>
      <div className={styles.content}>
        <Trans
          i18nKey="workInstructions:cards:card4:additionalLevelContent"
          components={{
            p: <p />,
            h3: <h3 />,
          }}
        >
          <h3>Täristävät hidastetarrat pyöräilijöille</h3>
          <p>
            Ennen työmaata pyöräväylille laitetaan hidastetarrat, jotka hidastavat luonnollisesti
            pyöräilijöiden vauhtia työmaan kohdalla.
          </p>
          <br />
          <h3>Peilit tiukoissa mutkissa</h3>
          <p>
            Tarvittaviin kohtiin lisätään peilit pyöräilijöille paremman näkyvyyden takaamiseksi.
          </p>
          <br />
          <h3>Asiantuntijat ja kokemusasiantuntijat</h3>
          <p>
            Työmaan reittejä ja opastusta suunnitellessa hyödynnetään asiantuntijoita ja
            kokemusasiantuntijoita.
          </p>
        </Trans>
      </div>
    </>
  );
};

const Card5Basic: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <MainHeading spacingBottom="xl">{t('workInstructions:cards:card5:header')}</MainHeading>
      <Text styleAs="h2" tag="h2" spacingBottom="l">
        {t('workInstructions:cards:basicLevel')}
      </Text>
      <Puff>
        {' '}
        <Trans
          i18nKey="workInstructions:cards:card5:puff"
          components={{
            ul: <ul />,
            li: <li />,
            h3: <h3 />,
            a: (
              <Link
                href="mailto:infra@hsl.fi"
                aria-labelledby={`${t('components:link:mailTo')}: infra@hsl.fi`}
                style={{ fontSize: 'var(--fontsize-body-l)' }}
              >
                linktext
              </Link>
            ),
          }}
        >
          <h3>Siirrot:</h3>
          <ul>
            <li>
              <strong>
                Jos julkisen liikenteen pysäkkejä joudutaan siirtämään tai poistamaan käytöstä,
              </strong>{' '}
              niiden kohdalla täytyy ilmoittaa opasteilla seuraavan pysäkin etäisyys ja miten kauan
              sinne kestää kävellä. Opastaminen ja pysäkkien siirrot sovitaan yhdessä HSL:n kanssa (
              <a href="infra@hsl.fi">infra@hsl.fi</a>).
            </li>
            <li>
              <strong>Siirretyistä, tilapäisistä suojateistä ilmoitetaan opasteella,</strong> joka
              kertoo korvaavan suojatien suunnan ja etäisyyden metreissä. Opaste sijoitetaan
              poistuneen suojatien kohdalle.
            </li>
            <li>
              <strong>Siirrettäville taksitolpille etsitään uusi sijainti,</strong> jonne opastetaan
              työmaalta.
            </li>
          </ul>
        </Trans>
      </Puff>
      <div className={styles.content}>
        <Trans
          i18nKey="workInstructions:cards:card5:content"
          components={{
            p: <p />,
            strong: <strong />,
          }}
        >
          <p>
            <strong>
              Opastuksen tulee alkaa reilusti ennen työmaata, mikäli työmaa hankaloittaa liikkumista
              merkittävästi.
            </strong>{' '}
            Pyöräilijöitä, jalankulkijoita ja autoilijoita varoitetaan työmaasta niin hyvissä ajoin,
            että he ehtivät tarpeen tullen vielä muuttaa reittiään.
          </p>
          <br />
          <p>
            <strong>
              Jalkakäytävällä tai pyörätiellä tehtävästä työstä on aina varoitettava
              liikennemerkillä 142 (Tietyö).
            </strong>{' '}
            Jalankulku- ja pyöräteillä liikennemerkin alimman reunan tulee olla 2,2–3,2 metrin
            korkeudella. Opasteita ei saa kiinnittää pysyvien liikenteenohjauslaitteiden pylväisiin,
            eivätkä ne saa aiheuttaa näköestettä tai törmäysvaaraa. Opasteet on pystytettävä niin,
            että ne kestävät esimerkiksi tuuli- ja lumikuormat kaatumatta tai irtoamatta. Opasteet
            asennetaan kulkuväylän viereen esimerkiksi työmaa-aitaan tai erilliseen pylvääseen.
          </p>
          <br />
          <p>
            <strong>Väliaikaisten liikennejärjestelyjen opasteet ovat keltaisia ja mustia.</strong>{' '}
            Niiden tekstikoko on yleensä 80–200 millimetriä. Jalankulkijoille ja pyöräilijöille
            tekstikoko on yleensä 60–80 millimetriä. Liikennemerkeillä tulee viestiä
            jalankulkijoille ja pyöräilijöille selkeästi ja katkeamattomasti reitit, jotka vievät
            työmaan ohi.
          </p>
          <br />
          <p>
            <strong>Jos opasteissa käytetään karttoja,</strong> tulee niissä jättää pois
            ylimääräiset yksityiskohdat (esim. talonumerot ja korkeuskäyrät) ja näyttää vain
            olennainen yksinkertaisella tavalla.
          </p>
        </Trans>
      </div>
      <AdditionalSummary>
        <Trans
          i18nKey="workInstructions:cards:card5:additionalLevelSummary"
          components={{ ul: <ul />, li: <li />, h3: <h3 /> }}
        >
          <ul>
            <li>Esteetön reitti</li>
            <li>Täristävät hidastetarrat pyöräilijöille</li>
            <li>Jalankulkijan työmaan infotaulu</li>
            <li>Digitaalinen infotaulu</li>
            <li>”Taluta pyörää tässä”-kyltti</li>
            <li>Huomiotarrat ja –maalaukset sekä lisäkilvet</li>
          </ul>
        </Trans>
      </AdditionalSummary>
    </>
  );
};

const Card5Additional: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <MainHeading spacingBottom="xl">{t('workInstructions:cards:card5:header')}</MainHeading>
      <Text styleAs="h2" tag="h2" spacingBottom="l">
        {t('workInstructions:cards:additionalLevel')}
      </Text>
      <div className={styles.content}>
        <Trans
          i18nKey="workInstructions:cards:card5:additionalLevelContent"
          components={{
            h3: <h3 />,
            p: <p />,
            br: <br />,
            a1: (
              <Link
                href="mailto:toimisto@hun.fi"
                aria-labelledby={`${t('components:link:mailTo')}: toimisto@hun.fi`}
                style={{ fontSize: 'var(--fontsize-body-l)' }}
              >
                linktext
              </Link>
            ),
            a2: (
              <Link
                href="mailto:kymp.viestinta@hel.fi"
                aria-labelledby={`${t('components:link:mailTo')}: kymp.viestinta@hel.fi`}
                style={{ fontSize: 'var(--fontsize-body-l)' }}
              >
                linktext
              </Link>
            ),
          }}
        >
          <h3>Esteetön reitti</h3>
          <p>
            Ennakko-opasteissa kuvataan myös hyvissä ajoissa esteetön reitti. Lisäksi tehdään
            ilmoitus Näkövammaisten liitolle (<a href="mailto:toimisto@hun.fi">toimisto@hun.fi</a>)
            työmaan reittijärjestelyistä.
          </p>
          <br />
          <p>
            Työmaalla hyödynnetään esteettömän reitin opasteita. Kyltit toteutetaan kelta-mustina
            kuvastamaan väliaikaisia liikennejärjestelyitä.
          </p>
          <br />
          <h3>Täristävät hidastetarrat pyöräilijöille</h3>
          <p>
            Ennen työmaata pyöräväylille laitetaan hidastetarrat, jotka hidastavat luonnollisesti
            pyöräilijöiden vauhtia työmaan kohdalla.
          </p>
          <br />
          <h3>Jalankulkijan työmaan infotaulu</h3>
          <p>
            Jalankulun solmukohtiin pystytetään lukukorkeudelle työmaan infotaulu. Vaakasuora taulu
            sisältää työmaataulun tietojen lisäksi maaston suuntaan käännettynä kartan, jossa
            nykyisen sijainnin tunnistaa ”olet tässä” –merkistä. Kartalle on merkitty myös kävely-
            ja pyöräilyreitit, tärkeimmät etäisyydet metreinä ja minuutteina, tärkeimmät maamerkit
            sekä nuoli, joka osoittaa pohjoisen suunnan. Lisätietoa:{' '}
            <a href="mailto:kymp.viestinta@hel.fi">kymp.viestinta@hel.fi</a>
          </p>
          <br />
          <h3>Digitaalinen infotaulu</h3>
          <p>
            Tärkeimpiin jalankulun solmukohtiin tuodaan digitaaliset infotaulut, joissa on
            työmaa-alueen kartta sekä ajankohtaista tietoa esimerkiksi työmaan edistymisestä,
            työvaiheista, turvallisuudesta, alueen palveluista ja osallistumisen mahdollisuuksista.
            Jos käytät digitaalista infotaulua, suunnittele sen sisältö käyttäjälähtöisesti.
          </p>
          <br />
          <h3>”Taluta pyörää tässä”-kyltti</h3>
          <p>
            Jos Haitaton antaa tuloksen, että kohteessa on paljon haavoittuvia kohderyhmiä, käytä
            ”Taluta pyörää tässä” kylttiä. Harkitse käyttöä myös kohteessa, jota huomaat
            pyöräilijöiden suosivan, vaikka olet opastanut heidät muualle. Syy käyttöön saattaa olla
            siinä, että opastettu pyöräilijän reitti ei käyttäjän näkökulmasta ole paras mahdollinen
            (kiertolenkki on erittäin pitkä).
          </p>
          <br />
          <h3>Huomiotarrat ja –maalaukset sekä lisäkilvet</h3>
          <p>
            Työmaan kriittisiin kohtiin voidaan maalata huomiomaalauksia suoraan asfalttiin tai
            hyödyntää huomiotarroja. Tällaisia kohtia ovat esimerkiksi jyrkät kaarteet pyöräväylillä
            tai kiskourien kohdat.
          </p>
        </Trans>
        <div className={styles.images}>
          <div className={styles.imgContainer}>
            <img src={card5Img1} alt={t('workInstructions:cards:card5:image1AltText')}></img>
            <p>{t('workInstructions:cards:pictureBy')}: Silja Laine, Ramboll</p>
          </div>
          <div className={styles.imgContainer}>
            <img src={card5Img2} alt={t('workInstructions:cards:card5:image2AltText')}></img>
            <p>
              {t('workInstructions:cards:pictureBy')}: Vuoden katutyömaa -kilpailun raati / Aino
              Mensonen, Ramboll
            </p>
          </div>
          <div className={styles.imgContainer}>
            <img src={card5Img3} alt={t('workInstructions:cards:card5:image3AltText')}></img>
            <p>
              {t('workInstructions:cards:pictureBy')}: Vuoden katutyömaa -kilpailun raati / Aino
              Mensonen, Ramboll
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

const Card6Basic: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <MainHeading spacingBottom="xl">{t('workInstructions:cards:card6:header')}</MainHeading>
      <Text styleAs="h2" tag="h2" spacingBottom="l">
        {t('workInstructions:cards:basicLevel')}
      </Text>
      <div className={styles.content}>
        <Trans
          i18nKey="workInstructions:cards:card6:content"
          components={{
            p: <p />,
            strong: <strong />,
            h3: <h3 />,
            a: (
              <Link
                href="https://www.hel.fi/static/hkr/luvat/pks_kaivutyoohje.pdf"
                external
                openInNewTab
                openInNewTabAriaLabel={t('common:components:link:openInNewTabAriaLabel')}
                openInExternalDomainAriaLabel={t(
                  'common:components:link:openInExternalDomainAriaLabel',
                )}
                style={{ fontSize: 'var(--fontsize-body-l)' }}
              >
                linktext
              </Link>
            ),
          }}
        >
          <p>
            <strong>
              Jalkakäytävällä, pyörätiellä tai jommankumman vieressä oleva kaivanto reunustetaan{' '}
            </strong>{' '}
            kaiteella tai aidalla, jotta kaivantoon ei ole vaaraa suistua. Suojauslaitteen
            valinnassa otetaan huomioon, miten hyvin se pysyy paikallaan.
          </p>
          <br />
          <p>
            <strong>
              Jalkakäytävällä tai pyörätiellä oleva laaja kaivanto peitetään tilapäisellä sillalla.
            </strong>{' '}
            Sen kannen rakenteessa ei saa olla rakoja, eikä kahden sillan väliin saa tulla
            pyöräilijöille vaarallista uraa. Kansi ei saa olla sateella tai muuten liukas. Silloille
            tulee olla luiskat. Jos sillat tehdään kahdesta tai useammasta osasta, on ne asennettava
            tiiviisti kiinni toisiinsa.
          </p>
          <br />
          <p>
            <strong>
              Tilapäisen sillan on oltavat vähintään 1,5 metriä leveä jalankulkijoille.
            </strong>{' '}
            Silta rakennetaan väylän tasoon, mutta jos se ei onnistu, viisteiden kaltevuus saa olla
            enintään 1:10. Jos kaivantosillan kansi ei rajoitu kiinteään seinään, kannen reunassa
            tulee olla vähintään 5 senttimetrin korkuinen suojareunus.
          </p>
          <br />
          <p>
            <strong>
              Jalankulkijoille tarkoitetulla kaivantosillalla on oltava molemmilla puolilla
              käsijohde 0,9 metrin korkeudella.
            </strong>{' '}
            Jos myös pyöräilijät käyttävät siltaa, kaiteen yläreunan on oltava 1,2 metrin
            korkeudella ja sillan leveämpi. Kaivantosillan kaiteessa tulee aina olla osuus, joka
            estää kaiteen läpi putoamisen. Yli 1,5 metriä syvien kaivantojen kohdilla kaivantosillan
            kaiteen tulee aina olla vähintään 1,2 metriä.
          </p>
          <br />
          <p>
            <strong>Jos jalankulkijat joutuvat ylittämään työmaan, tehdään ylikulkusilta.</strong>{' '}
            Se suunnitellaan tapauskohtaisesti erillisen ohjeistuksen mukaan.
          </p>
          <br />
          <h3>Ohjeet</h3>
          <br />
          <a href="https://www.hel.fi/static/hkr/luvat/pks_kaivutyoohje.pdf">
            Yleisten alueiden käyttö, tilapäiset liikennejärjestelyt ja katutyöt
          </a>
        </Trans>
      </div>
      <AdditionalSummary>
        <Trans
          i18nKey="workInstructions:cards:card6:additionalLevelSummary"
          components={{ ul: <ul />, li: <li /> }}
        >
          <ul>
            <li>Kaivannon aitauksien valaistus</li>
            <li>Kaivantosillan asennuksen viimeistely</li>
            <li>Konttisilta</li>
            <li>Varoitusmerkit ylikulkusillan yhteydessä</li>
          </ul>
        </Trans>
      </AdditionalSummary>
    </>
  );
};

const Card6Additional: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <MainHeading spacingBottom="xl">{t('workInstructions:cards:card6:header')}</MainHeading>
      <Text styleAs="h2" tag="h2" spacingBottom="l">
        {t('workInstructions:cards:additionalLevel')}
      </Text>
      <div className={styles.content}>
        <Trans
          i18nKey="workInstructions:cards:card6:additionalLevelContent"
          components={{
            h3: <h3 />,
            p: <p />,
            br: <br />,
          }}
        >
          <h3>Kaivannon aitauksien valaistus</h3>
          <p>
            Turvallisuutta ja viihtyisyyttä lisätään tuomalla lisävalaistusta ledinauhalla
            aitauksiin.
          </p>
          <br />
          <h3>Kaivantosillan asennuksen viimeistely</h3>
          <p>
            Kaivantosilta tulee asentaa ja viimeistellä siten, ettei se aiheuta vaaraa liikkujille
            (esim. nostolenkkien kohdalle tulpat).
          </p>
          <br />
          <h3>Konttisilta</h3>
          <p>
            Ylikulkusillan voi tehdä myös konttiratkaisuilla, joka ratkaisee myös roiskumisen
            haasteet. Tällöin on hyvä huomioida myös konttien valaiseminen.
          </p>
          <br />
          <p>Konttisiltoihin voi myös tehdä paikallista taidetta.</p>
          <br />
          <h3>Varoitusmerkit ylikulkusillan yhteydessä</h3>
          <p>
            Ylikulkusillan ulostulojen läheisyydessä huomioidaan muu liikenne esimerkiksi
            maalaamalla maahan varoitusmerkki pyöräilijöistä tai lisäämällä liikennemerkkejä.
          </p>
          <br />
          <p>Pyöräilijöitä varoitetaan maahan maalatulla kävelijän kuvakkeella.</p>
        </Trans>
        <div className={styles.images}>
          <div className={styles.imgContainer}>
            <img src={card6Img1} alt={t('workInstructions:cards:card6:image1AltText')}></img>
            <p>
              {t('workInstructions:cards:pictureBy')}: Vuoden katutyömaa kilpailun raati / Aino
              Mensonen, Ramboll
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

const Card7Basic: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <MainHeading spacingBottom="xl">{t('workInstructions:cards:card7:header')}</MainHeading>
      <Text styleAs="h2" tag="h2" spacingBottom="l">
        {t('workInstructions:cards:basicLevel')}
      </Text>
      <div className={styles.content}>
        <Trans
          i18nKey="workInstructions:cards:card7:content"
          components={{
            p: <p />,
            br: <br />,
          }}
        >
          <p>
            <strong>Yhtenäiset työmaa-aidat</strong> rajaavat työmaa-alueen siististi ja
            aukottomasti. Pitkä-aikaisen aidan koon, materiaalin ja värin tai kuvituksen on
            sovelluttava ympäristöön. Työmaa-aidan tulee taata turvallinen näkyvyys (esim.
            raskasaita, jonka läpi näkyy).
          </p>
          <br />
          <p>
            <strong>
              Työmaa-aidan kannatinpalkin tai jalustan tulee olla sellainen, ettei se aiheuta
              kompastumisvaaraa jalankulkijalle.
            </strong>{' '}
            Sen täytyy myös sallia mahdollisimman yhtenäinen johde valkoiselle kepille.
          </p>
          <br />
          <p>
            <strong>
              Väylän vähimmäisleveyden on täytyttävä niin, että aidan jalusta tai kannatin on
              huomioitu.
            </strong>{' '}
            Jalustat tulee mahdollisuuksien mukaan asentaa siten, että ne vievät mahdollisimman
            vähän tilaa kulkuväylältä.
          </p>
          <br />
          <p>
            <strong>Jos työmaalla käytetään siirrettäviä työmaa-aitoja,</strong> suositaan kuvan
            kaltaisia malleja, jotka vastaavat esteettömyyssäädöksiä tai joissa on yhtenäinen
            kannatinpalkki tai jalusta.
          </p>
          <br />
          <p>
            <strong>
              Alueella liikkuminen ja kadun ylittäminen pidetään turvallisena järjestämällä korvaava
              tilapäinen valaistus,
            </strong>{' '}
            mikäli jalkakäytävän tai pyörätien valaistus joudutaan poistamaan työn aikana.
            Valaistuksella on olennainen merkitys reitin liikenneturvallisuuteen ja siihen, että
            jalankulkijat ja pyöräilijät on mahdollista havaita selkeästi tien ylityspaikoissa. Moni
            väylä kulkee valaistun tien varressa eikä siksi tarvitse omaa valaistusta. Jos tällaista
            väylää korvaava reitti kuitenkin kulkee kauempana tiestä, eikä tien valaistus riitä
            valaisemaan uutta reittiä, valaistus on taattava muulla keinolla.
          </p>
          <br />
          <p>
            <strong>
              Valaistukseen on kiinnitettävä erityisesti huomiota puistojen, vanhainkotien ja
              vammaispalveluiden läheisyydessä sekä alueella, jolla liikkuu lapsia.
            </strong>
          </p>
        </Trans>
        <div className={styles.images}>
          <div className={styles.imgContainer}>
            <img src={card7Img1} alt={t('workInstructions:cards:card7:image1AltText')}></img>
            <p>{t('workInstructions:cards:pictureBy')}: Susa Junnola</p>
          </div>
          <div className={styles.imgContainer}>
            <img src={card7Img2} alt={t('workInstructions:cards:card7:image2AltText')}></img>
            <p>{t('workInstructions:cards:pictureBy')}: Ramudden</p>
          </div>
          <div className={styles.imgContainer}>
            <img src={card7Img3} alt={t('workInstructions:cards:card7:image3AltText')}></img>
            <p>{t('workInstructions:cards:pictureBy')}: Ramudden</p>
          </div>
        </div>
      </div>
      <AdditionalSummary>
        <Trans
          i18nKey="workInstructions:cards:card7:additionalLevelSummary"
          components={{ ul: <ul />, li: <li /> }}
        >
          <ul>
            <li>Viistotut aidanjalat</li>
            <li>LED-valonauhat aidoissa</li>
            <li>Työmaatolppien suojaus</li>
            <li>Viihtyvyyden lisääminen</li>
            <li>Yhteneväinen ilme</li>
          </ul>
        </Trans>
      </AdditionalSummary>
    </>
  );
};

const Card7Additional: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <MainHeading spacingBottom="xl">{t('workInstructions:cards:card7:header')}</MainHeading>
      <Text styleAs="h2" tag="h2" spacingBottom="l">
        {t('workInstructions:cards:additionalLevel')}
      </Text>
      <div className={styles.content}>
        <Trans
          i18nKey="workInstructions:cards:card7:additionalLevelContent"
          components={{
            h3: <h3 />,
            p: <p />,
            br: <br />,
          }}
        >
          <h3>Viistotut aidanjalat</h3>
          <p>
            Työmaa-aidan jalkoina käytetään viistottuja malleja. Suositellaan kumi- tai
            eurojalustaa.
          </p>
          <br />
          <h3>LED-valonauhat aidoissa</h3>
          <p>Työmaa-aidoissa hyödynnetään led-valonauhoja, jotka korostavat ja ohjaavat reittiä.</p>
          <br />
          <h3>Työmaatolppien suojaus</h3>
          <p>
            Suojaa työmaatolpat esim. keltaisella salaojaputkella, harmaalla pehmeällä materiaalilla
            tai koteloimalla tolpat, käytä tolpissa lisäksi tarpeen mukaan heijastimia.
          </p>
          <br />
          <h3>Viihtyvyyden lisääminen</h3>
          <p>
            Jos työmaalla käytetään raskassuojia ja vaneriseinämiä, lisätään yleisilmeen
            viihtyvyyttä esim. seinän printtikuviolla, havainnekuvalla tai värimaailmalla.
          </p>
          <br />
          <h3>Yhteneväinen ilme</h3>
          <p>
            Työmaa-aidat ovat visuaalisesti yhtenevät ja kiinni koko matkalta. Hankkeen tarroitus
            aidoissa lisää selkeyttä. Johdonmukaisesti hyödynnetty visuaalinen ilme helpottaa
            työmaan hahmottamista.
          </p>
        </Trans>
      </div>
    </>
  );
};

const Card8Basic: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <MainHeading spacingBottom="xl">{t('workInstructions:cards:card8:header')}</MainHeading>
      <Text styleAs="h2" tag="h2" spacingBottom="l">
        {t('workInstructions:cards:basicLevel')}
      </Text>
      <div className={styles.content}>
        <Trans
          i18nKey="workInstructions:cards:card8:content"
          components={{
            p: <p />,
            strong: <strong />,
            br: <br />,
            a: (
              <Link
                href="mailto:infra@hsl.fi"
                aria-labelledby={`${t('components:link:mailTo')}: infra@hsl.fi`}
                style={{ fontSize: 'var(--fontsize-body-l)' }}
              >
                linktext
              </Link>
            ),
            Puff: <Puff />,
            ul: <ul />,
            li: <li />,
          }}
        >
          <p>
            <strong>
              Jos kadulla on julkista liikennettä, on tarpeen neuvotella HSL:n, Kaupunkiliikenteen
              ja/tai Linja-autoliiton kanssa{' '}
            </strong>{' '}
            hyvissä ajoin ennen liikennejärjestelyjä niiden vaikutuksista liikenteeseen.
            Paikalliseen joukkoliikenteeseen (raitiotie ja linja-autoliikenne) liittyvät
            muutostarpeet tulee ilmoittaa osoitteeseen{' '}
            <a href="mailto:infra@hsl.fi">infra@hsl.fi</a>. Lisäksi tulee olla tarpeen mukaan
            yhteydessä Kaupunkiliikenne Oy:öön (metrot ja raitiovaunut) ja Linja-autoliittoon
            (kaukoliikenne).
          </p>
          <br />
          <Puff>
            <p>
              <strong>
                Raitiotie- tai linja-autopysäkkien osalta on liikennejärjestelyissä huomioitava
                seuraavat asiat:
              </strong>
            </p>
            <ul>
              <li>
                Kävely-yhteydet pysäkeille on säilytettävä, ja niissä on huomioitava esteettömyys.
              </li>
              <li>
                Pysäkit on hyvä pitää lähellä niiden pysyviä paikkoja, jotta julkinen liikenne pysyy
                aikataulussa.
              </li>
              <li>Pysäkkien liikennöitävä kunto säilyy.</li>
              <li>Pysäkkien sijaintia muutettaessa on huolehdittava riittävästä opastuksesta.</li>
            </ul>
            <br />
            <p>
              <strong>
                HSL:ää tulee tiedottaa hyvissä ajoin työmaasta, mahdollisista reittimuutoksista ja
                pysäkeistä, joita saatetaan joutua siirtämään ja poistamaan käytöstä työmaan takia.
              </strong>{' '}
              Pysäkkien siirroissa tai linja-autojen poikkeusreiteissä on otettava yhteys HSL:ään
              vähintään kaksi viikkoa etukäteen. Mikäli työmaa sijaitsee linja-auton päätepysäkillä
              tai linja-autoliikenne estyy kadulla, yhteyttä on otettava vähintään 2,5 kuukautta
              etukäteen. Raitioliikenteen osalta yhteyttä on otettava vähintään 6 kuukautta
              etukäteen.
            </p>
          </Puff>
          <p>
            <strong>
              Kun pysäkki siirretään, urakoitsijan kontolla on asentaa väliaikainen pysäkkitolppa
              (vähintään 2,7 metriä korkea), liikennemerkki ja jalusta.
            </strong>{' '}
            Urakoitsija asentaa pysäkkitolppaan tarvittavan määrän tiedotekoteloita ja vastaa
            väliaikaisen pysäkkialueen kunnossapidosta. Työn loputtua urakoitsija purkaa
            väliaikaisen pysäkin ja palauttaa alkuperäisen.
          </p>
          <br />
          <p>
            <strong>
              HSL asentaa ja siirrättää liikennemerkin linjakilpikehikon väliaikaisille pysäkeille
              sovittuna ajankohtana.
            </strong>{' '}
            Kaupunki ja HSL voivat myös päättää, että pysäkille asennetaan katos ja/tai
            esteettömyyssäädökset täyttävä rampitettu koroke, joka nousee bussin tai raitiovaunun
            lattian tasolle.
          </p>
          <br />
          <p>
            <strong>Pysäkkejä ei saa siirtää tai poistaa ilman HSL:n lupaa.</strong> Urakoitsijan on
            noudatettava HSL:n yleisohjetta sekä sovittava HSL:n kanssa yksityiskohdista. Poistetun
            pysäkin kohdalle täytyy laittaa opaste, joka ohjaa korvaavan pysäkin luo. Opasteessa
            esitetään suunta (tarvittaessa kartta) pysäkille sekä matka metreinä.
          </p>
          <br />
          <p>
            <strong>Työmaan tietojen vieminen avoimeen rajapintaan, </strong> kuten HSL:n
            Digitransit-palveluun, tulee sopia yhdessä HSL:n kanssa.
          </p>
        </Trans>
      </div>
      <AdditionalSummary>
        <Trans
          i18nKey="workInstructions:cards:card8:additionalLevelSummary"
          components={{ ul: <ul />, li: <li /> }}
        >
          <ul>
            <li>Valmisrakenteinen bussipysäkki</li>
          </ul>
        </Trans>
      </AdditionalSummary>
    </>
  );
};

const Card8Additional: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <MainHeading spacingBottom="xl">{t('workInstructions:cards:card8:header')}</MainHeading>
      <Text styleAs="h2" tag="h2" spacingBottom="l">
        {t('workInstructions:cards:additionalLevel')}
      </Text>
      <div className={styles.content}>
        <Trans
          i18nKey="workInstructions:cards:card8:additionalLevelContent"
          components={{
            h3: <h3 />,
            p: <p />,
          }}
        >
          <h3>Valmisrakenteinen bussipysäkki</h3>
          <p>
            Työmaalla hyödynnetään valmisrakenteista bussipysäkkiä, jossa on katos, luiskat ja
            nihkeä, pitävä pinta.
          </p>
        </Trans>
      </div>
    </>
  );
};

const Card9Basic: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <MainHeading spacingBottom="xl">{t('workInstructions:cards:card9:header')}</MainHeading>
      <Text styleAs="h2" tag="h2" spacingBottom="l">
        {t('workInstructions:cards:basicLevel')}
      </Text>
      <div className={styles.content}>
        <Trans
          i18nKey="workInstructions:cards:card9:content"
          components={{
            h3: <h3 />,
            ul: <ul />,
            li: <li />,
          }}
        >
          <h3>Kadun liikkeiden osalta tulee työmaajärjestelyissä huomioida seuraavat asiat:</h3>
          <ul>
            <li>
              Kulkukelpoiset yhteydet on järjestettävä kaikille kadun liikkeille koko työn ajan.
            </li>
            <li>Liikkeenharjoittajien kanssa on selvitettävä tavaraliikenteen vaatimukset.</li>
            <li>
              Liikkeenharjoittajien näkyvyyttä katutilassa tulee häiritä mahdollisimman vähän.
            </li>
            <li>Liikkeenharjoittajia tulee kuulla ennen työmaata ja työmaan aikana.</li>
          </ul>
          <br />
          <h3>Kadun kiinteistöjen osalta tulee työmaajärjestelyissä huomioida seuraavat asiat:</h3>
          <ul>
            <li>Pelastusajon ja -toimen tarpeet</li>
            <li>
              Kulkukelpoiset yhteydet on järjestettävä kaikille kiinteistöille ja rakennuksille koko
              työn ajan.
            </li>
            <li>
              Kiinteistöjen asukkailla ja käyttäjillä tulee olla helposti saatavilla ajantasaista
              tietoa työmaan etenemisestä. Keinoina voidaan käyttää esimerkiksi taloyhtiötiedotetta,
              WhatsApp-ryhmää tai diginäyttöä kiinteistön edustalla.
            </li>
          </ul>
        </Trans>
      </div>
      <AdditionalSummary>
        <Trans
          i18nKey="workInstructions:cards:card9:additionalLevelSummary"
          components={{ ul: <ul />, li: <li /> }}
        >
          <ul>
            <li>Liikkeenharjoittajista muodostettu työmaaraati</li>
            <li>Liikkeenharjoittajien näkyvyys</li>
          </ul>
        </Trans>
      </AdditionalSummary>
    </>
  );
};

const Card9Additional: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <MainHeading spacingBottom="xl">{t('workInstructions:cards:card9:header')}</MainHeading>
      <Text styleAs="h2" tag="h2" spacingBottom="l">
        {t('workInstructions:cards:additionalLevel')}
      </Text>
      <div className={styles.content}>
        <Trans
          i18nKey="workInstructions:cards:card9:additionalLevelContent"
          components={{ h3: <h3 />, p: <p />, br: <br /> }}
        >
          <h3>Liikkeenharjoittajista muodostettu työmaaraati</h3>
          <p>
            Työmaan edustajat muodostavat yhdessä paikallisten liikkeenharjoittajien kanssa
            työmaaraadin, joka yhdessä pohtii ratkaisuja työmaanaikaiselle toiminnalle.
          </p>
          <br />
          <h3>Liikkeenharjoittajien näkyvyys</h3>
          <p>Liikkeenharjoittajien näkyvyyttä jopa lisätään mahdollisuuksien mukaan.</p>
        </Trans>
      </div>
    </>
  );
};

const Card10Basic: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <MainHeading spacingBottom="xl">{t('workInstructions:cards:card10:header')}</MainHeading>
      <Text styleAs="h2" tag="h2" spacingBottom="l">
        {t('workInstructions:cards:basicLevel')}
      </Text>
      <div className={styles.content}>
        <Trans
          i18nKey="workInstructions:cards:card10:content"
          components={{
            p: <p />,
            strong: <strong />,
            br: <br />,
            h3: <h3 />,
            a: (
              <Link
                href="https://www.hel.fi/fi/kaupunkiymparisto-ja-liikenne/ympariston-ja-luonnon-suojelu/ymparistohaittojen-ehkaisy/ymparistonsuojelumaaraykset"
                external
                openInNewTab
                openInNewTabAriaLabel={t('common:components:link:openInNewTabAriaLabel')}
                openInExternalDomainAriaLabel={t(
                  'common:components:link:openInExternalDomainAriaLabel',
                )}
                style={{ fontSize: 'var(--fontsize-body-l)' }}
              >
                linktext
              </Link>
            ),
          }}
        >
          <p>
            <strong>
              Työmaista syntyy väistämättä erilaisia melu- ja pölyhaittoja sekä mahdollisia
              tärinähaittoja.
            </strong>{' '}
            Niitä pyritään vähentämään mahdollisuuksien mukaan esimerkiksi työn aikataulutuksella,
            aidoilla, maa-aineksen kastelulla tai muulla työhön sopivalla menetelmällä esim. kiven
            tai betonin sahaustöissä käytetään vettä sitomaan pölyä, tai käytetään louhintatöiden
            porauksissa pölynkerääjää.
          </p>
          <br />
          <p>
            <strong>
              Työmenetelmän valinta on huomioitava, jos joudutaan louhimaan. Lisäksi
              tärinänsuojaukset tulee tehdä herkille laitteille.
            </strong>
          </p>
          <br />
          <h3>Ohjeet:</h3>
          <br />
          <a href="https://www.hel.fi/fi/kaupunkiymparisto-ja-liikenne/ympariston-ja-luonnon-suojelu/ymparistohaittojen-ehkaisy/ymparistonsuojelumaaraykset">
            Helsingin kaupungin ympäristönsuojelumääräykset
          </a>
          <br />
          <br />
          <p>
            <strong>
              Jokaisen työmaan työntekijän vastuulla on huolehtia siitä, että työmaa näyttäytyy
              kaupunkilaisille toimivana ja siistinä
            </strong>
            . Työmaalla säilytettävät tarvikkeet ja materiaalit tulee pitää järjestyksessä,
            mieluiten aidattuina. Reitit on pidettävä puhtaina esimerkiksi hiekka- tai sorakasoista,
            ja kuopat täytyy täyttää välittömästi. Työmaalle voidaan tuoda ylimääräisiä
            lajitteluastioita kaupunkilaisten ja työmaan työntekijöiden käyttöön.
          </p>
        </Trans>
      </div>
      <AdditionalSummary>
        <Trans
          i18nKey="workInstructions:cards:card10:additionalLevelSummary"
          components={{ ul: <ul />, li: <li /> }}
        >
          <ul>
            <li>Meluaidat</li>
            <li>Kaupunkilaisten huomioiminen</li>
            <li>Uudet menetelmät</li>
            <li>Siisteys ja järjestelyjen ylläpito</li>
            <li>Alueen viihtyisyys</li>
            <li>Lasten huomiointi</li>
          </ul>
        </Trans>
      </AdditionalSummary>
    </>
  );
};

const Card10Additional: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <MainHeading spacingBottom="xl">{t('workInstructions:cards:card10:header')}</MainHeading>
      <Text styleAs="h2" tag="h2" spacingBottom="l">
        {t('workInstructions:cards:additionalLevel')}
      </Text>
      <div className={styles.content}>
        <Trans
          i18nKey="workInstructions:cards:card10:additionalLevelContent"
          components={{ h3: <h3 />, p: <p />, br: <br /> }}
        >
          <h3>Meluaidat</h3>
          <p>
            Työmaa aidataan sopimuksien mukaisista suunnista ääntä vaimentavalla, siirreltävällä
            meluaidalla.
          </p>
          <br />
          <h3>Kaupunkilaisten huomioiminen</h3>
          <p>
            Lähellä asuvien ja työmaan läheisyydessä liikkuvien asukkaiden huomioiminen esim.
            jakamalla korvatulppia.
          </p>
          <br />
          <h3>Uudet menetelmät</h3>
          <p>
            Etsitään uusia tapoja, jotka vähentävät melu-, pöly- ja tärinähaittoja, esim.
            peruutusääni ”puhalluksena”.
          </p>
          <br />
          <h3>Siisteys ja järjestelyjen ylläpito</h3>
          <p>
            Päätoteuttajan ja turvallisuuskoordinaattorin lakisääteisten velvollisuuksien lisäksi
            työmaa yhdessä sitoutuu säännöllisesti tarkistamaan työmaan siisteyteen ja selkeyteen
            liittyvät järjestelyt sekä korjauttamaan havaitsemansa puutteet. Tarkastukset tulee
            tehdä päivittäin tai kerran viikossa riippuen työmaan järjestelyistä ja sijainnista.
          </p>
          <br />
          <p>
            Tarkastuksista pidetään kirjaa, ja niitä voidaan käsitellä työmaakokouksissa.
            Tarkastustiheyttä mietittäessä tulee huomioida esimerkiksi, kuinka todennäköisesti
            työmaa joutuu ilkivallan kohteeksi. Järjestelyt tulee tarkastaa myös poikkeuksellisten
            sääolosuhteiden jälkeen. Tarvittaessa kullekin työmaalle nimetään päivystäjä, joka
            lähtee mihin vuorokauden aikaan tahansa korjaamaan rikkoutuneita tai muuten
            vaarallisiksi todettuja järjestelyjä.
          </p>
          <br />
          <h3>Alueen viihtyisyys</h3>
          <p>
            Työmaalla kiinnitetään huomiota viihtyisyyteen. Työmaa voi yhteistyössä taiteilijoiden
            tai asukkaiden kanssa pohtia ja toteuttaa yhteistä viihtyvyyttä.
          </p>
          <br />
          <h3>Lasten huomiointi</h3>
          <p>
            Mieti tilaajan kanssa, miten lapset voitaisiin huomioida työmaallasi. Keinoja voivat
            olla esimerkiksi kurkistusaukot aidoissa, vierailut työmaalle, kaivuukoneiden
            nimikointi, työmaaturvallisuuspäivät, heijastimien jako ja aitojen maalaus. Koulujen ja
            päiväkotien kanssa keskustellaan erikseen sopivista ajankohdista, ettei työ osu
            välituntien/ulkoilun, koulun aloituksen tai päiväunien aikaan.
          </p>
        </Trans>
      </div>
    </>
  );
};

const Card: React.FC = () => {
  const { number = '', type = '' } = useParams<{ number: string; type: string }>();
  const { setBreadcrumbs } = useBreadcrumbs();
  const { t } = useTranslation();
  const { CARD } = useLocalizedRoutes();

  useEffect(() => {
    const breadcrumb: BreadcrumbListItem = {
      title: `workInstructions:cards:card${number}:header`,
      path:
        type === t('routes:CARD:additionalLevel')
          ? `${t('routes:CARD:path')}${number}/${t('routes:CARD:basicLevel')}`
          : '',
    };

    const updateBreadcrumbs = () => {
      if (type === t('routes:CARD:additionalLevel')) {
        setBreadcrumbs([BREADCRUMBS.cardsIndex, breadcrumb, BREADCRUMBS.additionalLevel]);
      } else {
        setBreadcrumbs([BREADCRUMBS.cardsIndex, breadcrumb]);
      }
    };

    updateBreadcrumbs();
  }, [setBreadcrumbs, number, type, t, CARD.path]);

  const renderCard = (cardNumber: string) => {
    switch (cardNumber) {
      case '1':
        return type === t('routes:CARD:basicLevel') ? <Card1Basic /> : <Card1Additional />;
      case '2':
        return type === t('routes:CARD:basicLevel') ? <Card2Basic /> : <Card2Additional />;
      case '3':
        return type === t('routes:CARD:basicLevel') ? <Card3Basic /> : <Card3Additional />;
      case '4':
        return type === t('routes:CARD:basicLevel') ? <Card4Basic /> : <Card4Additional />;
      case '5':
        return type === t('routes:CARD:basicLevel') ? <Card5Basic /> : <Card5Additional />;
      case '6':
        return type === t('routes:CARD:basicLevel') ? <Card6Basic /> : <Card6Additional />;
      case '7':
        return type === t('routes:CARD:basicLevel') ? <Card7Basic /> : <Card7Additional />;
      case '8':
        return type === t('routes:CARD:basicLevel') ? <Card8Basic /> : <Card8Additional />;
      case '9':
        return type === t('routes:CARD:basicLevel') ? <Card9Basic /> : <Card9Additional />;
      case '10':
        return type === t('routes:CARD:basicLevel') ? <Card10Basic /> : <Card10Additional />;
      default:
        return <div>{t('workInstructions:cards:notFound')}</div>;
    }
  };

  return <>{renderCard(number)}</>;
};

export { Card1Basic, Card1Additional, Card2Basic, Card2Additional, Card };
