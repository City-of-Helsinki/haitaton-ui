import React, { useState } from 'react';
import {
  Accordion,
  Button,
  IconCross,
  IconPen,
  IconPlusCircle,
  IconTrash,
  IconUser,
  LoadingSpinner,
  Tab,
  TabList,
  TabPanel,
  Tabs,
} from 'hds-react';
import { useTranslation } from 'react-i18next';
import { Flex } from '@chakra-ui/react';
import { useLocation } from 'react-router-dom';
import Text from '../../../common/components/text/Text';
import { HankeAlue, HankeData, HankeIndexData } from '../../types/hanke';
import styles from './HankeView.module.scss';
import BasicInformationSummary from '../edit/components/BasicInformationSummary';
import {
  FormSummarySection,
  SectionItemContent,
  SectionItemTitle,
} from '../../forms/components/FormSummarySection';
import { calculateTotalSurfaceArea, canHankeBeCancelled } from '../edit/utils';
import ContactsSummary from '../edit/components/ContactsSummary';
import HankeIndexes from '../hankeIndexes/HankeIndexes';
import { FORMFIELD } from '../edit/types';
import useLocale from '../../../common/hooks/useLocale';
import { formatToFinnishDate } from '../../../common/utils/date';
import { formatSurfaceArea, getFeatureFromHankeGeometry } from '../../map/utils';
import ApplicationAddDialog from '../../application/components/ApplicationAddDialog';
import OwnHankeMap from '../../map/components/OwnHankeMap/OwnHankeMap';
import OwnHankeMapHeader from '../../map/components/OwnHankeMap/OwnHankeMapHeader';
import CompressedAreaIndex from '../hankeIndexes/CompressedAreaIndex';
import HankeDraftStateNotification from '../edit/components/HankeDraftStateNotification';
import { useIsHankeValid } from '../edit/hooks/useIsHankeValid';
import { SKIP_TO_ELEMENT_ID } from '../../../common/constants/constants';
import { useApplicationsForHanke } from '../../application/hooks/useApplications';
import ApplicationList from '../../application/components/ApplicationList';
import ErrorLoadingText from '../../../common/components/errorLoadingText/ErrorLoadingText';
import {
  InformationViewContainer,
  InformationViewContentContainer,
  InformationViewHeader,
  InformationViewHeaderButtons,
  InformationViewMainContent,
  InformationViewSidebar,
} from '../../common/components/hankeInformationView/HankeInformationView';
import FeatureFlags from '../../../common/components/featureFlags/FeatureFlags';
import { useFeatureFlags } from '../../../common/components/featureFlags/FeatureFlagsContext';

type AreaProps = {
  area: HankeAlue;
  hankeIndexData: HankeIndexData | null | undefined;
  index: number;
};

const HankeAreaInfo: React.FC<AreaProps> = ({ area, hankeIndexData, index }) => {
  const { t } = useTranslation();
  const locale = useLocale();

  const areaGeometry =
    area.geometriat && getFeatureFromHankeGeometry(area.geometriat).getGeometry();

  return (
    <Accordion
      language={locale}
      heading={t('hanke:alue:title', { index: index + 1 })}
      initiallyOpen
      className={styles.hankeAreaContainer}
    >
      <div className={styles.hankeAreaContent}>
        <FormSummarySection>
          <SectionItemTitle>{t('hanke:alue:duration')}</SectionItemTitle>
          <SectionItemContent>
            {formatToFinnishDate(area.haittaAlkuPvm)}–{formatToFinnishDate(area.haittaLoppuPvm)}
          </SectionItemContent>
          <SectionItemTitle>{t('hanke:alue:surfaceArea')}</SectionItemTitle>
          <SectionItemContent>{formatSurfaceArea(areaGeometry)}</SectionItemContent>
        </FormSummarySection>

        <HankeIndexes
          hankeIndexData={hankeIndexData}
          indexTitle={t('hanke:alue:liikenneverkollinenHaitta')}
          containerClassName={styles.areaIndexes}
        />

        <Text tag="h2" styleAs="h4" weight="bold" spacingBottom="xs">
          {t('hanke:alue:haittaMaarittelyt')}
        </Text>

        <Text tag="p" styleAs="body-s" spacingBottom="3-xs">
          {t(`hankeForm:labels:${FORMFIELD.MELUHAITTA}`)}:{' '}
          {t(`hanke:${FORMFIELD.MELUHAITTA}:${area.meluHaitta}`)}
        </Text>
        <Text tag="p" styleAs="body-s" spacingBottom="3-xs">
          {t(`hankeForm:labels:${FORMFIELD.POLYHAITTA}`)}:{' '}
          {t(`hanke:${FORMFIELD.POLYHAITTA}:${area.polyHaitta}`)}
        </Text>
        <Text tag="p" styleAs="body-s" spacingBottom="3-xs">
          {t(`hankeForm:labels:${FORMFIELD.TARINAHAITTA}`)}:{' '}
          {t(`hanke:${FORMFIELD.TARINAHAITTA}:${area.tarinaHaitta}`)}
        </Text>
        <Text tag="p" styleAs="body-s" spacingBottom="3-xs">
          {t(`hankeForm:labels:${FORMFIELD.KAISTAHAITTA}`)}:{' '}
          {t(`hanke:${FORMFIELD.KAISTAHAITTA}:${area.kaistaHaitta}`)}
        </Text>
        <Text tag="p" styleAs="body-s">
          {t(`hankeForm:labels:${FORMFIELD.KAISTAPITUUSHAITTA}`)}:{' '}
          {t(`hanke:${FORMFIELD.KAISTAPITUUSHAITTA}:${area.kaistaPituusHaitta}`)}
        </Text>
      </div>
    </Accordion>
  );
};

type Props = {
  hankeData?: HankeData;
  onEditHanke: () => void;
  onCancelHanke: () => void;
};

const HankeView: React.FC<Props> = ({ hankeData, onEditHanke, onCancelHanke }) => {
  const { t } = useTranslation();
  const location = useLocation();
  const features = useFeatureFlags();
  const { data: applicationsResponse, isLoading, error } = useApplicationsForHanke(
    hankeData?.hankeTunnus
  );

  // Get initially active tab from location state if there is such defined
  const initiallyActiveTab: number | undefined =
    location.state !== null
      ? (location.state as { initiallyActiveTab: number | undefined }).initiallyActiveTab
      : undefined;

  const [showAddApplicationDialog, setShowAddApplicationDialog] = useState(false);

  function addApplication() {
    setShowAddApplicationDialog(true);
  }

  function closeAddApplicationDialog() {
    setShowAddApplicationDialog(false);
  }

  const isHankeValid = useIsHankeValid(hankeData);
  const isCancelPossible = applicationsResponse
    ? canHankeBeCancelled(applicationsResponse.applications)
    : true;

  if (!hankeData) {
    return (
      <Flex justify="center" mt="var(--spacing-xl)">
        <LoadingSpinner />
      </Flex>
    );
  }

  const areasTotalSurfaceArea = calculateTotalSurfaceArea(hankeData.alueet);

  const { omistajat, rakennuttajat, toteuttajat, muut, tormaystarkasteluTulos, alueet } = hankeData;

  const tabList = features.hanke ? (
    <TabList className={styles.tabList}>
      <Tab>{t('hankePortfolio:tabit:perustiedot')}</Tab>
      <Tab>{t('hankePortfolio:tabit:alueet')}</Tab>
      <Tab>{t('hankePortfolio:tabit:haittojenHallinta')}</Tab>
      <Tab>{t('hankePortfolio:tabit:yhteystiedot')}</Tab>
      <Tab>{t('hankePortfolio:tabit:hakemukset')}</Tab>
    </TabList>
  ) : (
    <TabList className={styles.tabList}>
      <Tab>{t('hankePortfolio:tabit:hakemukset')}</Tab>
    </TabList>
  );

  return (
    <InformationViewContainer>
      <ApplicationAddDialog
        isOpen={showAddApplicationDialog}
        onClose={closeAddApplicationDialog}
        hanke={hankeData}
      />

      <InformationViewHeader backgroundColor="var(--color-summer-light)">
        <Text tag="h1" styleAs="h1" weight="bold" id={SKIP_TO_ELEMENT_ID} tabIndex={-1}>
          {hankeData?.nimi}
        </Text>
        <Text tag="h2" styleAs="h3" weight="bold" spacingBottom="l">
          {hankeData?.hankeTunnus}
        </Text>
        <FeatureFlags flags={['hanke', 'accessRights']}>
          <Text tag="p" styleAs="body-s" weight="bold" spacingBottom="l">
            {t('hankePortfolio:labels:oikeudet')}:
          </Text>
        </FeatureFlags>

        <InformationViewHeaderButtons>
          <FeatureFlags flags={['hanke']}>
            <Button
              onClick={onEditHanke}
              variant="primary"
              iconLeft={<IconPen aria-hidden="true" />}
              theme="coat"
            >
              {t('hankeList:buttons:edit')}
            </Button>
            <Button
              variant="primary"
              iconLeft={<IconPlusCircle aria-hidden="true" />}
              theme="coat"
              onClick={addApplication}
              disabled={!isHankeValid}
            >
              {t('hankeList:buttons:addApplication')}
            </Button>
          </FeatureFlags>
          <FeatureFlags flags={['hanke', 'accessRights']}>
            <Button variant="primary" iconLeft={<IconUser aria-hidden="true" />} theme="coat">
              {t('hankeList:buttons:editRights')}
            </Button>
          </FeatureFlags>
          <FeatureFlags flags={['hanke']}>
            <Button
              variant="primary"
              iconLeft={<IconCross aria-hidden="true" />}
              theme="black"
              disabled={!isHankeValid}
            >
              {t('hankeList:buttons:endHanke')}
            </Button>
          </FeatureFlags>
          {!isLoading && isCancelPossible && (
            <Button
              onClick={onCancelHanke}
              variant="danger"
              iconLeft={<IconTrash aria-hidden="true" />}
            >
              {t('hankeForm:cancelButton')}
            </Button>
          )}
        </InformationViewHeaderButtons>
      </InformationViewHeader>

      <InformationViewContentContainer>
        <InformationViewMainContent>
          <FeatureFlags flags={['hanke']}>
            <div className={styles.draftStateNotification}>
              <HankeDraftStateNotification hanke={hankeData} />
            </div>
          </FeatureFlags>

          <Tabs initiallyActiveTab={features.hanke ? initiallyActiveTab : 0}>
            {tabList}
            {features.hanke && (
              <TabPanel>
                <BasicInformationSummary formData={hankeData}>
                  <SectionItemTitle>{t('hanke:alue:totalSurfaceAreaLong')}</SectionItemTitle>
                  <SectionItemContent>
                    {areasTotalSurfaceArea && <p>{areasTotalSurfaceArea} m²</p>}
                  </SectionItemContent>
                </BasicInformationSummary>
              </TabPanel>
            )}
            {features.hanke && (
              <TabPanel>
                {alueet?.map((area, index) => {
                  return (
                    <HankeAreaInfo
                      key={area.id}
                      area={area}
                      hankeIndexData={tormaystarkasteluTulos}
                      index={index}
                    />
                  );
                })}
              </TabPanel>
            )}
            {features.hanke && <TabPanel>Haittojen hallinta</TabPanel>}
            {features.hanke && (
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
            )}
            <TabPanel>
              {isLoading && (
                <Flex justify="center" mt="var(--spacing-xl)">
                  <LoadingSpinner />
                </Flex>
              )}
              {applicationsResponse?.applications && (
                <ApplicationList applications={applicationsResponse.applications} />
              )}
              {error && <ErrorLoadingText />}
            </TabPanel>
          </Tabs>
        </InformationViewMainContent>
        <FeatureFlags flags={['hanke']}>
          <InformationViewSidebar>
            <OwnHankeMapHeader hankeTunnus={hankeData.hankeTunnus} />
            <OwnHankeMap hanke={hankeData} />
            {alueet?.map((area, index) => {
              return (
                <CompressedAreaIndex
                  key={area.id}
                  area={area}
                  haittaIndex={tormaystarkasteluTulos?.liikennehaittaIndeksi.indeksi}
                  index={index}
                  className={styles.compressedAreaIndex}
                />
              );
            })}
          </InformationViewSidebar>
        </FeatureFlags>
      </InformationViewContentContainer>
    </InformationViewContainer>
  );
};

export default HankeView;
