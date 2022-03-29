import {
  IconDocument,
  IconInfoCircle,
  IconMap,
  IconPlusCircle,
  Link,
  Notification,
} from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import Text from '../../common/components/text/Text';
import { useLocalizedRoutes } from '../../common/hooks/useLocalizedRoutes';
import styles from './Homepage.module.scss';

const Homepage: React.FC = () => {
  const { t } = useTranslation();
  const { MAP, PROJECTS, HANKEPORTFOLIO, NEW_HANKE } = useLocalizedRoutes();
  const Icons = {
    plus: React.createElement(() => <IconPlusCircle size="s" aria-hidden />),
    document: React.createElement(() => <IconDocument size="s" aria-hidden />),
    map: React.createElement(() => <IconMap size="s" aria-hidden />),
    info: React.createElement(() => <IconInfoCircle size="s" aria-hidden />),
  };
  const basicInfo = [
    {
      key: 'hanke',
      title: 'Hanke',
      actionIcon: Icons.plus,
      actionLink: NEW_HANKE.path,
    },
    /*
    {
      key: 'hakemus',
      title: 'Hakemus/Työvaihe',
      actionIcon: Icons.plus,
      actionLink: '/#',
    },
    */
    {
      key: 'johtotietoselvitys',
      title: 'Johtotietoselvitys',
      actionIcon: Icons.plus,
      actionLink: '/fi/johtoselvityshakemus',
    },
    /*
    {
      key: 'valmistelu',
      title: 'Valmisteluvaiheessa oleva hanke',
      actionIcon: Icons.plus,
      actionLink: '/#',
    },
    */
    {
      key: 'hankesalkku',
      title: 'Hankesalkku',
      actionIcon: Icons.document,
      actionLink: HANKEPORTFOLIO.path,
    },
    {
      key: 'hankelista',
      title: 'Hankelista',
      actionIcon: Icons.document,
      actionLink: PROJECTS.path,
    },
    {
      key: 'kartta',
      title: 'Kartta',
      actionIcon: Icons.map,
      actionLink: MAP.path,
    },
    {
      key: 'tietoja_haitattomasta',
      title: 'Tietoja Haitattomasta',
      actionIcon: Icons.info,
      actionLink: '/fi/tietoja',
    },
  ];

  return (
    <div className={styles.container}>
      <div>
        <Text tag="h1" styleAs="h2" spacing="s" weight="bold">
          {t('homepage:pageTitle')}
        </Text>
        <div className={styles.feedbackInfo}>
          <Notification
            label="Auta meitä tekemään Haitattomasta vielä parempi!"
            type="info"
            autoClose={false}
          >
            <p>
              Ideoita ja havaintoja voit lähettää osoitteeseen{' '}
              <a href="mailto:haitaton@hel.fi">haitaton@hel.fi</a>
            </p>
          </Notification>
        </div>
        <div className={styles.contentContainer}>
          {basicInfo.map((item) => {
            return (
              <div className={styles.basicInfoContainer} key={item.key}>
                <div>
                  <Text tag="h2" styleAs="h4" spacing="s" weight="bold">
                    {t(`homepage:${item.key}:title`)}
                  </Text>
                  <Text tag="p" styleAs="body-s" spacing="s">
                    {t(`homepage:${item.key}:description`)}
                  </Text>
                  <Link
                    className={styles.link}
                    iconLeft={item.actionIcon}
                    size="M"
                    href={item.actionLink}
                    style={{ display: 'block', width: 'fit-content' }}
                  >
                    {t(`homepage:${item.key}:actionText`)}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Homepage;
