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
import { BreadcrumbListItem, Link } from 'hds-react';

const Card1Basic: React.FC = () => {
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
            <strong>
              Kerro alueen asukkaille, yrityksille ja muille toimijoille työmaasta vähintään viikkoa
              ennen sen alkua.
            </strong>{' '}
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
          components={{ p: <p />, strong: <strong />, a: <a /> }}
        >
          <p>
            <strong>Valitse sopivat viestintäkanavat yhdessä tilaajan viestinnän kanssa,</strong> ja
            joukkoliikenteestä tiedottaminen sovitaan yhdessä HSL:n kanssa. Herkkien kohteiden
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
};

const Card1Additional: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <MainHeading spacingBottom="xl">{t('workInstructions:cards:1:header')}</MainHeading>
      <Text styleAs="h2" tag="h2" spacingBottom="l">
        {t('workInstructions:cards:additionalLevel')}
      </Text>
      <div className={styles.content}>
        <Trans
          i18nKey="workInstructions:cards:1:additionalLevelContent"
          components={{
            p: <p />,
            h3: <h3 />,
            a: (
              <Link
                href="https://oma.media.fi/lehti/helsingin-uutiset/yhteystiedot/laheta-juttuvinkki/"
                external
                openInNewTab
                openInNewTabAriaLabel="components:link:openInNewTabAriaLabel"
                openInExternalDomainAriaLabel={t('components:link:openInExternalDomainAriaLabel')}
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
      <MainHeading spacingBottom="xl">{t('workInstructions:cards:2:header')}</MainHeading>
      <Text styleAs="h2" tag="h2" spacingBottom="l">
        {t('workInstructions:cards:basicLevel')}
      </Text>
      <div className={styles.content}>
        <Trans
          i18nKey="workInstructions:cards:2:content"
          components={{
            p: <p />,
            strong: <strong />,
            a: (
              <Link
                href=""
                external
                openInNewTab
                openInNewTabAriaLabel="components:link:openInNewTabAriaLabel"
                openInExternalDomainAriaLabel={t('components:link:openInExternalDomainAriaLabel')}
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
          i18nKey="workInstructions:cards:2:content2"
          components={{
            p: <p />,
            h3: <h3 />,
            a1: (
              <Link
                href="https://www.hel.fi/static/hki4all/ohjeet/2022/suraku-kortti-1.pdf"
                external
                openInNewTab
                openInNewTabAriaLabel="components:link:openInNewTabAriaLabel"
                openInExternalDomainAriaLabel={t('components:link:openInExternalDomainAriaLabel')}
                style={{ fontSize: 'var(--fontsize-body-l)' }}
              >
                linktext
              </Link>
            ),
            a2: (
              <Link
                href={t('workInstructions:cards:2:link2Url')}
                external
                openInNewTab
                openInNewTabAriaLabel="components:link:openInNewTabAriaLabel"
                openInExternalDomainAriaLabel={t('components:link:openInExternalDomainAriaLabel')}
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
          i18nKey="workInstructions:cards:2:additionalLevelSummary"
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
      <MainHeading spacingBottom="xl">{t('workInstructions:cards:2:header')}</MainHeading>
      <Text styleAs="h2" tag="h2" spacingBottom="l">
        {t('workInstructions:cards:additionalLevel')}
      </Text>
      <div className={styles.content}>
        <Trans
          i18nKey="workInstructions:cards:2:additionalLevelContent"
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
      </div>
    </>
  );
};

const Card3Basic: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <MainHeading spacingBottom="xl">{t('workInstructions:cards:3:header')}</MainHeading>
      <Text styleAs="h2" tag="h2" spacingBottom="l">
        {t('workInstructions:cards:basicLevel')}
      </Text>
      <Puff>
        <Trans
          i18nKey="workInstructions:cards:3:puff"
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
          i18nKey="workInstructions:cards:3:content"
          components={{
            p: <p />,
            h3: <h3 />,
            br: <br />,
            a1: (
              <Link
                href="https://www.hel.fi/static/hki4all/ohjeet/2022/suraku-kortti-1.pdf"
                external
                openInNewTab
                openInNewTabAriaLabel="components:link:openInNewTabAriaLabel"
                openInExternalDomainAriaLabel={t('components:link:openInExternalDomainAriaLabel')}
                style={{ fontSize: 'var(--fontsize-body-l)' }}
              >
                linktext
              </Link>
            ),
            a2: (
              <Link
                href={t('workInstructions:cards:2:link2Url')}
                external
                openInNewTab
                openInNewTabAriaLabel="components:link:openInNewTabAriaLabel"
                openInExternalDomainAriaLabel={t('components:link:openInExternalDomainAriaLabel')}
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
            Käytöstä poissaolevien liikennevalojen valot tulee huputtaa ja napit tarvittaessa
            peittää. Käytöstä poissaolevat liikennemerkit tulee huputtaa tai poistaa (myös
            työmaa-aitauksen sisälle jäävät) työn ajaksi samoin kadunpintaan maalatut liikenteen
            ohjausmerkinnät, jotka ovat ristiriitaisia väliaikaisten liikennejärjestelyjen kanssa,
            poistetaan jyrsimällä. Ääniopastus tulee huomioida myös työmaan aikana.
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
          i18nKey="workInstructions:cards:3:additionalLevelSummary"
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
      <MainHeading spacingBottom="xl">{t('workInstructions:cards:3:header')}</MainHeading>
      <Text styleAs="h2" tag="h2" spacingBottom="l">
        {t('workInstructions:cards:additionalLevel')}
      </Text>
      <div className={styles.content}>
        <Trans
          i18nKey="workInstructions:cards:3:additionalLevelContent"
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
      </div>
    </>
  );
};

const Card4Basic: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <MainHeading spacingBottom="xl">{t('workInstructions:cards:4:header')}</MainHeading>
      <Text styleAs="h2" tag="h2" spacingBottom="l">
        {t('workInstructions:cards:basicLevel')}
      </Text>
      <Puff></Puff>
      <div className={styles.content}></div>
      <AdditionalSummary></AdditionalSummary>
    </>
  );
};

const Card4Additional: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <MainHeading spacingBottom="xl">{t('workInstructions:cards:4:header')}</MainHeading>
      <Text styleAs="h2" tag="h2" spacingBottom="l">
        {t('workInstructions:cards:additionalLevel')}
      </Text>
      <div className={styles.content}></div>
    </>
  );
};

const Card5Basic: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <MainHeading spacingBottom="xl">{t('workInstructions:cards:5:header')}</MainHeading>
      <Text styleAs="h2" tag="h2" spacingBottom="l">
        {t('workInstructions:cards:basicLevel')}
      </Text>
      <Puff></Puff>
      <div className={styles.content}></div>
      <AdditionalSummary></AdditionalSummary>
    </>
  );
};

const Card5Additional: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <MainHeading spacingBottom="xl">{t('workInstructions:cards:5:header')}</MainHeading>
      <Text styleAs="h2" tag="h2" spacingBottom="l">
        {t('workInstructions:cards:additionalLevel')}
      </Text>
      <div className={styles.content}></div>
    </>
  );
};

const Card6Basic: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <MainHeading spacingBottom="xl">{t('workInstructions:cards:6:header')}</MainHeading>
      <Text styleAs="h2" tag="h2" spacingBottom="l">
        {t('workInstructions:cards:basicLevel')}
      </Text>
      <Puff></Puff>
      <div className={styles.content}></div>
      <AdditionalSummary></AdditionalSummary>
    </>
  );
};

const Card6Additional: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <MainHeading spacingBottom="xl">{t('workInstructions:cards:6:header')}</MainHeading>
      <Text styleAs="h2" tag="h2" spacingBottom="l">
        {t('workInstructions:cards:additionalLevel')}
      </Text>
      <div className={styles.content}></div>
    </>
  );
};

const Card7Basic: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <MainHeading spacingBottom="xl">{t('workInstructions:cards:7:header')}</MainHeading>
      <Text styleAs="h2" tag="h2" spacingBottom="l">
        {t('workInstructions:cards:basicLevel')}
      </Text>
      <Puff></Puff>
      <div className={styles.content}></div>
      <AdditionalSummary></AdditionalSummary>
    </>
  );
};

const Card7Additional: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <MainHeading spacingBottom="xl">{t('workInstructions:cards:7:header')}</MainHeading>
      <Text styleAs="h2" tag="h2" spacingBottom="l">
        {t('workInstructions:cards:additionalLevel')}
      </Text>
      <div className={styles.content}></div>
    </>
  );
};

const Card8Basic: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <MainHeading spacingBottom="xl">{t('workInstructions:cards:8:header')}</MainHeading>
      <Text styleAs="h2" tag="h2" spacingBottom="l">
        {t('workInstructions:cards:basicLevel')}
      </Text>
      <Puff></Puff>
      <div className={styles.content}></div>
      <AdditionalSummary></AdditionalSummary>
    </>
  );
};

const Card8Additional: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <MainHeading spacingBottom="xl">{t('workInstructions:cards:8:header')}</MainHeading>
      <Text styleAs="h2" tag="h2" spacingBottom="l">
        {t('workInstructions:cards:additionalLevel')}
      </Text>
      <div className={styles.content}></div>
    </>
  );
};

const Card9Basic: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <MainHeading spacingBottom="xl">{t('workInstructions:cards:9:header')}</MainHeading>
      <Text styleAs="h2" tag="h2" spacingBottom="l">
        {t('workInstructions:cards:basicLevel')}
      </Text>
      <Puff></Puff>
      <div className={styles.content}></div>
      <AdditionalSummary></AdditionalSummary>
    </>
  );
};

const Card9Additional: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <MainHeading spacingBottom="xl">{t('workInstructions:cards:9:header')}</MainHeading>
      <Text styleAs="h2" tag="h2" spacingBottom="l">
        {t('workInstructions:cards:additionalLevel')}
      </Text>
      <div className={styles.content}></div>
    </>
  );
};

const Card10Basic: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <MainHeading spacingBottom="xl">{t('workInstructions:cards:10:header')}</MainHeading>
      <Text styleAs="h2" tag="h2" spacingBottom="l">
        {t('workInstructions:cards:basicLevel')}
      </Text>
      <Puff></Puff>
      <div className={styles.content}></div>
      <AdditionalSummary></AdditionalSummary>
    </>
  );
};

const Card10Additional: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <MainHeading spacingBottom="xl">{t('workInstructions:cards:10:header')}</MainHeading>
      <Text styleAs="h2" tag="h2" spacingBottom="l">
        {t('workInstructions:cards:additionalLevel')}
      </Text>
      <div className={styles.content}></div>
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
      setBreadcrumbs([
        BREADCRUMBS.cardsIndex,
        breadcrumb,
        type === t('routes:CARD:basicLevel') ? BREADCRUMBS.basicLevel : BREADCRUMBS.additionalLevel,
      ]);

    updateBreadcrumbs();
  }, [setBreadcrumbs, number, type, t]);

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
