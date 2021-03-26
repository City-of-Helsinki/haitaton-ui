import React from 'react';
import { Container as HdsContainer } from 'hds-react';
import { useTranslation } from 'react-i18next';
import PageMeta from '../components/PageMeta';
import { useLocalizedRoutes } from '../../common/hooks/useLocalizedRoutes';
import Container from '../../common/components/container/Container';
import Text from '../../common/components/text/Text';
import styles from './StaticContent.module.scss';

const InfoPage: React.FC = () => {
  const { HAITATON_INFO } = useLocalizedRoutes();
  const { t } = useTranslation();

  return (
    <Container>
      <PageMeta routeData={HAITATON_INFO} />
      <Text tag="h1" styleAs="h2" spacing="s" weight="bold">
        {t('staticPages:info:title')}
      </Text>

      <HdsContainer style={{ padding: '2rem', backgroundColor: 'white' }}>
        <Text tag="p" spacing="s">
          Arviointi perustuu yksittäiselle hankegeometrialle tehtävään kolmen eri alaindeksin
          kriittisyyden määrittämiseen:
        </Text>

        <ol className={styles.orderedList}>
          <li>
            Pyöräilyindeksin osalta tunnistetaan pääpyöräilyverkon ja pyöräilyn priorisoitujen
            reittien olemassaolo;
          </li>
          <li>
            Joukkoliikenneindeksin osalta tunnistetaan raitiotielinjat ja merkittävimmät
            bussireitit;
          </li>
          <li>
            Perusindeksiin lasketaan hankkeen keston, autoliikennemäärän, liikenteellisen
            katuluokituksen sekä käyttäjän karkeasti arvioimien kaistavaikutusten pohjalta
            autoliikenteen merkittävyys (ruuhkautumisherkkyys).
          </li>
        </ol>

        <Text tag="p" spacing="s">
          Suurin alaindeksiluku määrittää koko hankkeen indeksiluvun eli hankkeen kriittisyyden.
          Yksittäisten hankkeiden liikenneverkollisia yhteisvaikutuksia arvioidaan karttanäkymän
          avulla. Kartalla yksittäiset hankkeet on rasteroitu niiden saaman indeksiarvon mukaan,
          mutta kaikkien alaindeksien tuloksia voi myös tarkastella hankekohtaisesti.
          Kartta-arvioinnin pohjalta käyttäjä voi arvioida eri hankkeiden aikatauluja ja
          yhteensovitustarpeita erityisesti liikenneverkon osalta, mutta myös muita vaikutuksia
          hankkeiden ympäristössä. Haitattoman kehitystoiveita voi laittaa osoitteeseen:
          haitaton(at)hel.fi
        </Text>
      </HdsContainer>
    </Container>
  );
};

export default InfoPage;
