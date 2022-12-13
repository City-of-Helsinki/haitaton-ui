import React from 'react';
import {
  Button,
  IconCross,
  IconPen,
  IconPlusCircle,
  IconTrash,
  IconUser,
  Tab,
  TabList,
  TabPanel,
  Tabs,
} from 'hds-react';
import { useTranslation } from 'react-i18next';
import Container from '../../../common/components/container/Container';
import Text from '../../../common/components/text/Text';
import { HankeDataDraft } from '../../types/hanke';
import styles from './HankeView.module.scss';
import BasicInformationSummary from '../edit/components/BasicInformationSummary';
import {
  FormSummarySection,
  SectionItemContent,
  SectionItemTitle,
} from '../../forms/components/FormSummarySection';
import { calculateTotalSurfaceArea } from '../edit/utils';
import ContactsSummary from '../edit/components/ContactsSummary';

type Props = {
  hankeData?: HankeDataDraft;
  onEditHanke: () => void;
  onDeleteHanke: () => void;
};

const HankeView: React.FC<Props> = ({ hankeData, onEditHanke, onDeleteHanke }) => {
  const { t } = useTranslation();

  if (!hankeData) {
    return null;
  }

  const areasTotalSurfaceArea = calculateTotalSurfaceArea(hankeData.alueet);

  const { omistajat, rakennuttajat, toteuttajat, muut } = hankeData;

  return (
    <article className={styles.hankeViewContainer}>
      <header className={styles.headerContainer}>
        <Container>
          <Text tag="h1" styleAs="h1" weight="bold">
            {hankeData?.nimi}
          </Text>
          <Text tag="h2" styleAs="h3" weight="bold" spacingBottom="l">
            {hankeData?.hankeTunnus}
          </Text>
          <Text tag="p" styleAs="body-s" weight="bold" spacingBottom="l">
            {t('hankePortfolio:labels:oikeudet')}:
          </Text>

          <div className={styles.buttonContainer}>
            <Button
              onClick={onEditHanke}
              variant="primary"
              iconLeft={<IconPen aria-hidden="true" />}
              theme="coat"
            >
              {t('hankeList:buttons:edit')}
            </Button>
            <Button variant="primary" iconLeft={<IconPlusCircle aria-hidden="true" />} theme="coat">
              {t('hankeList:buttons:addApplication')}
            </Button>
            <Button variant="primary" iconLeft={<IconUser aria-hidden="true" />} theme="coat">
              {t('hankeList:buttons:editRights')}
            </Button>
            <Button variant="primary" iconLeft={<IconCross aria-hidden="true" />} theme="black">
              {t('hankeList:buttons:endHanke')}
            </Button>
            <Button
              onClick={onDeleteHanke}
              variant="danger"
              iconLeft={<IconTrash aria-hidden="true" />}
            >
              {t('hankeList:buttons:delete')}
            </Button>
          </div>
        </Container>
      </header>

      <div className={styles.contentContainerOut}>
        <Container className={styles.contentContainerIn}>
          <div className={styles.mainContent}>
            <Tabs>
              <TabList className={styles.tabList}>
                <Tab>{t('hankePortfolio:tabit:perustiedot')}</Tab>
                <Tab>{t('hankePortfolio:tabit:alueet')}</Tab>
                <Tab>{t('hankePortfolio:tabit:haittojenHallinta')}</Tab>
                <Tab>{t('hankePortfolio:tabit:yhteystiedot')}</Tab>
                <Tab>{t('hankePortfolio:tabit:hakemukset')}</Tab>
              </TabList>
              <TabPanel>
                <BasicInformationSummary formData={hankeData}>
                  <SectionItemTitle>Hanke-alueiden kokonaispinta-ala</SectionItemTitle>
                  <SectionItemContent>
                    {areasTotalSurfaceArea && <p>{areasTotalSurfaceArea} m²</p>}
                  </SectionItemContent>
                </BasicInformationSummary>
              </TabPanel>
              <TabPanel>Alueet</TabPanel>
              <TabPanel>Haittojen hallinta</TabPanel>
              <TabPanel>
                <FormSummarySection>
                  {omistajat && omistajat.length > 0 && (
                    <ContactsSummary
                      contacts={omistajat}
                      title={t('form:yhteystiedot:titles:omistaja')}
                    />
                  )}
                  {rakennuttajat && rakennuttajat.length > 0 && (
                    <ContactsSummary
                      contacts={rakennuttajat}
                      title={t('form:yhteystiedot:titles:rakennuttajatPlural')}
                    />
                  )}
                  {toteuttajat && toteuttajat?.length > 0 && (
                    <ContactsSummary
                      contacts={toteuttajat}
                      title={t('form:yhteystiedot:titles:toteuttajatPlural')}
                    />
                  )}
                  {muut && muut?.length > 0 && (
                    <ContactsSummary
                      contacts={muut}
                      title={t('form:yhteystiedot:titles:muutPlural')}
                    />
                  )}
                </FormSummarySection>
              </TabPanel>
              <TabPanel>Hakemukset</TabPanel>
            </Tabs>
          </div>
          <div className={styles.sideBar}>
            <p>Side content</p>
          </div>
        </Container>
      </div>
    </article>
  );
};

export default HankeView;
