import React, { useState } from 'react';
import {
  Accordion,
  Button,
  ButtonPresetTheme,
  ButtonVariant,
  IconPen,
  IconPlusCircle,
  IconTrash,
  IconUser,
  Notification,
  Tab,
  TabList,
  TabPanel,
  Tabs,
} from 'hds-react';
import { useTranslation } from 'react-i18next';
import { Box, Flex } from '@chakra-ui/react';
import { useLocation } from 'react-router-dom';
import Text from '../../../common/components/text/Text';
import { HankeAlue, HankeData } from '../../types/hanke';
import styles from './HankeView.module.scss';
import BasicInformationSummary from '../edit/components/BasicInformationSummary';
import {
  FormSummarySection,
  SectionItemContent,
  SectionItemTitle,
} from '../../forms/components/FormSummarySection';
import { calculateTotalSurfaceArea, canHankeBeCancelled } from '../edit/utils';
import ContactsSummary from '../edit/components/ContactsSummary';
import { FORMFIELD } from '../edit/types';
import useLocale from '../../../common/hooks/useLocale';
import { formatToFinnishDate } from '../../../common/utils/date';
import { formatSurfaceArea, getFeatureFromHankeGeometry } from '../../map/utils';
import ApplicationAddDialog from '../../application/components/ApplicationAddDialog';
import OwnHankeMap from '../../map/components/OwnHankeMap/OwnHankeMap';
import OwnHankeMapHeader from '../../map/components/OwnHankeMap/OwnHankeMapHeader';
import CompressedAreaIndex from '../hankeIndexes/CompressedAreaIndex';
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
import { SignedInUser } from '../hankeUsers/hankeUser';
import { CheckRightsByHanke } from '../hankeUsers/UserRightsCheck';
import AttachmentSummary from '../edit/components/AttachmentSummary';
import useHankeAttachments from '../hankeAttachments/useHankeAttachments';
import MainHeading from '../../../common/components/mainHeading/MainHeading';
import HankeGeneratedStateNotification from '../edit/components/HankeGeneratedStateNotification';
import MapPlaceholder from '../../map/components/MapPlaceholder/MapPlaceholder';
import HaittaIndexes from '../../common/haittaIndexes/HaittaIndexes';
import LoadingSpinner from '../../../common/components/spinner/LoadingSpinner';
import HaittaIndex from '../../common/haittaIndexes/HaittaIndex';
import HaittaTooltipContent from '../../common/haittaIndexes/HaittaTooltipContent';
import FormPagesErrorSummary from '../../forms/components/FormPagesErrorSummary';
import { hankeSchema } from '../edit/hankeSchema';
import HankeStatusTag from '../components/HankeStatusTag';

type AreaProps = {
  area: HankeAlue;
  index: number;
};

const HankeAreaInfo: React.FC<AreaProps> = ({ area, index }) => {
  const { t } = useTranslation();
  const locale = useLocale();

  const areaGeometry =
    area.geometriat && getFeatureFromHankeGeometry(area.geometriat).getGeometry();

  return (
    <Accordion
      language={locale}
      heading={area.nimi || t('hanke:alue:title', { index: index + 1 })}
      initiallyOpen
      className={styles.hankeAreaContainer}
    >
      <Box width="100%">
        <FormSummarySection>
          <SectionItemTitle>{t('hanke:alue:duration')}</SectionItemTitle>
          <SectionItemContent>
            {formatToFinnishDate(area.haittaAlkuPvm)}–{formatToFinnishDate(area.haittaLoppuPvm)}
          </SectionItemContent>
          <SectionItemTitle>{t('hanke:alue:surfaceArea')}</SectionItemTitle>
          <SectionItemContent>{formatSurfaceArea(areaGeometry)}</SectionItemContent>
        </FormSummarySection>

        <HaittaIndexes
          heading={`${t('hanke:alue:liikennehaittaIndeksit')} (0-5)`}
          haittaIndexData={area.tormaystarkasteluTulos}
          className={styles.areaIndexes}
          initiallyOpen
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
      </Box>
    </Accordion>
  );
};

const HaittojenhallintasuunnitelmaInfo: React.FC<AreaProps> = ({ area, index }) => {
  const { t } = useTranslation();
  const locale = useLocale();

  return (
    <Accordion
      language={locale}
      heading={area.nimi || t('hanke:alue:title', { index: index + 1 })}
      initiallyOpen
      className={styles.haittojenhallintasuunnitelmaContainer}
    >
      <div>
        <FormSummarySection className={styles.odd}>
          <SectionItemTitle>
            {t('hankeForm:haittojenHallintaForm:nuisanceType:YLEINEN')}
          </SectionItemTitle>
          <SectionItemContent>
            <Box pr="calc(var(--spacing-l) * 3)">
              <Text tag="p" styleAs="body-s">
                {area.haittojenhallintasuunnitelma?.YLEINEN || ''}
              </Text>
            </Box>
          </SectionItemContent>
        </FormSummarySection>

        <FormSummarySection className={styles.even}>
          <SectionItemTitle>
            {t('hankeForm:haittojenHallintaForm:nuisanceType:PYORALIIKENNE')}
          </SectionItemTitle>
          <SectionItemContent>
            <Flex alignItems="flex-start" justifyContent="space-between">
              <Text tag="p" styleAs="body-s">
                {area.haittojenhallintasuunnitelma?.PYORALIIKENNE || ''}
              </Text>
              <Box pl="var(--spacing-s)">
                <HaittaIndex
                  index={area.tormaystarkasteluTulos?.pyoraliikenneindeksi}
                  testId="test-pyoraliikenneindeksi"
                  tooltipContent={
                    <HaittaTooltipContent translationKey="hankeIndexes:tooltips:PYORALIIKENNE" />
                  }
                />
              </Box>
            </Flex>
          </SectionItemContent>
        </FormSummarySection>

        <FormSummarySection className={styles.odd}>
          <SectionItemTitle>
            {t('hankeForm:haittojenHallintaForm:nuisanceType:AUTOLIIKENNE')}
          </SectionItemTitle>
          <SectionItemContent>
            <Flex alignItems="flex-start" justifyContent="space-between">
              <Text tag="p" styleAs="body-s">
                {area.haittojenhallintasuunnitelma?.AUTOLIIKENNE || ''}
              </Text>
              <Box pl="var(--spacing-s)">
                <HaittaIndex
                  index={area.tormaystarkasteluTulos?.autoliikenne.indeksi}
                  testId="test-autoliikenneindeksi"
                  tooltipContent={
                    <HaittaTooltipContent translationKey="hankeIndexes:tooltips:AUTOLIIKENNE" />
                  }
                />
              </Box>
            </Flex>
          </SectionItemContent>
        </FormSummarySection>

        <FormSummarySection className={styles.even}>
          <SectionItemTitle>
            {t('hankeForm:haittojenHallintaForm:nuisanceType:LINJAAUTOLIIKENNE')}
          </SectionItemTitle>
          <SectionItemContent>
            <Flex alignItems="flex-start" justifyContent="space-between">
              <Text tag="p" styleAs="body-s">
                {area.haittojenhallintasuunnitelma?.LINJAAUTOLIIKENNE || ''}
              </Text>
              <Box pl="var(--spacing-s)">
                <HaittaIndex
                  index={area.tormaystarkasteluTulos?.linjaautoliikenneindeksi}
                  testId="test-linjaautoliikenneindeksi"
                  tooltipContent={
                    <HaittaTooltipContent translationKey="hankeIndexes:tooltips:LINJAAUTOLIIKENNE" />
                  }
                />
              </Box>
            </Flex>
          </SectionItemContent>
        </FormSummarySection>

        <FormSummarySection className={styles.odd}>
          <SectionItemTitle>
            {t('hankeForm:haittojenHallintaForm:nuisanceType:RAITIOLIIKENNE')}
          </SectionItemTitle>
          <SectionItemContent>
            <Flex alignItems="flex-start" justifyContent="space-between">
              <Text tag="p" styleAs="body-s">
                {area.haittojenhallintasuunnitelma?.RAITIOLIIKENNE || ''}
              </Text>
              <Box pl="var(--spacing-s)">
                <HaittaIndex
                  index={area.tormaystarkasteluTulos?.raitioliikenneindeksi}
                  testId="test-raitioliikenneindeksi"
                  tooltipContent={
                    <HaittaTooltipContent translationKey="hankeIndexes:tooltips:RAITIOLIIKENNE" />
                  }
                />
              </Box>
            </Flex>
          </SectionItemContent>
        </FormSummarySection>

        <FormSummarySection className={styles.even}>
          <SectionItemTitle>
            {t('hankeForm:haittojenHallintaForm:nuisanceType:MUUT')}
          </SectionItemTitle>
          <SectionItemContent>
            <Box pr="calc(var(--spacing-l) * 3)">
              <Text tag="p" styleAs="body-s">
                {area.haittojenhallintasuunnitelma?.MUUT || ''}
              </Text>
            </Box>
          </SectionItemContent>
        </FormSummarySection>
      </div>
    </Accordion>
  );
};

type Props = {
  hankeData?: HankeData;
  signedInUser?: SignedInUser;
  onEditHanke: () => void;
  onCancelHanke: () => void;
  onEditRights: () => void;
};

const HankeView: React.FC<Props> = ({
  hankeData,
  signedInUser,
  onEditHanke,
  onCancelHanke,
  onEditRights,
}) => {
  const { t } = useTranslation();
  const location = useLocation();
  const features = useFeatureFlags();
  const {
    data: applicationsResponse,
    isLoading,
    error,
  } = useApplicationsForHanke(hankeData?.hankeTunnus);
  const { data: attachments } = useHankeAttachments(hankeData?.hankeTunnus);

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

  if (!hankeData) {
    return (
      <Flex justify="center" mt="var(--spacing-xl)">
        <LoadingSpinner />
      </Flex>
    );
  }

  const areasTotalSurfaceArea = calculateTotalSurfaceArea(hankeData.alueet);

  const {
    omistajat,
    rakennuttajat,
    toteuttajat,
    muut,
    alueet,
    status,
    deletionDate,
    alkuPvm,
    loppuPvm,
  } = hankeData;
  const isHankePublic = status === 'PUBLIC';
  const isHankeCompleted = status === 'COMPLETED';
  const isCancelPossible =
    !isHankeCompleted &&
    (applicationsResponse ? canHankeBeCancelled(applicationsResponse.applications) : true);

  const tabList = features.hanke ? (
    <TabList className={styles.tabList}>
      <Tab>{t('hankePortfolio:tabit:perustiedot')}</Tab>
      <Tab>{t('hankePortfolio:tabit:alueet')}</Tab>
      <Tab>{t('hankePortfolio:tabit:haittojenHallinta')}</Tab>
      <Tab>{t('hankePortfolio:tabit:yhteystiedot')}</Tab>
      <Tab>{t('hankePortfolio:tabit:liitteet')}</Tab>
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
        <MainHeading>{hankeData?.nimi}</MainHeading>
        <Flex marginBottom="var(--spacing-m)" gap="4">
          <Text tag="h2" styleAs="h3" weight="bold" data-testid="hanke-tunnus">
            {hankeData?.hankeTunnus}
          </Text>
          <HankeStatusTag status={status} />
        </Flex>
        <FormSummarySection>
          <>
            <SectionItemTitle>{t('hankePortfolio:labels:hankkeenKesto')}:</SectionItemTitle>
            <SectionItemContent>
              {`${formatToFinnishDate(alkuPvm) ?? ''} - ${formatToFinnishDate(loppuPvm) ?? ''}`}{' '}
            </SectionItemContent>
          </>
          <>
            <SectionItemTitle>{t('hankePortfolio:labels:oikeudet')}:</SectionItemTitle>
            <SectionItemContent>
              {t(`hankeUsers:accessRightLevels:${signedInUser?.kayttooikeustaso}`)}
            </SectionItemContent>
          </>
        </FormSummarySection>

        <InformationViewHeaderButtons>
          <FeatureFlags flags={['hanke']}>
            <CheckRightsByHanke requiredRight="EDIT" hankeTunnus={hankeData.hankeTunnus}>
              {!isHankeCompleted ? (
                <Button
                  onClick={onEditHanke}
                  variant={ButtonVariant.Primary}
                  iconStart={<IconPen />}
                  theme={ButtonPresetTheme.Coat}
                >
                  {t('hankePortfolio:buttons:edit')}
                </Button>
              ) : null}
            </CheckRightsByHanke>
            <CheckRightsByHanke
              requiredRight="EDIT_APPLICATIONS"
              hankeTunnus={hankeData.hankeTunnus}
            >
              {isHankePublic ? (
                <Button
                  variant={ButtonVariant.Primary}
                  iconStart={<IconPlusCircle />}
                  theme={ButtonPresetTheme.Coat}
                  onClick={addApplication}
                >
                  {t('hankePortfolio:buttons:addApplication')}
                </Button>
              ) : null}
            </CheckRightsByHanke>
          </FeatureFlags>
          <Button
            onClick={onEditRights}
            variant={ButtonVariant.Primary}
            iconStart={<IconUser />}
            theme={ButtonPresetTheme.Coat}
          >
            {t('hankeUsers:userManagementTitle')}
          </Button>
          {!isLoading && isCancelPossible && (
            <CheckRightsByHanke requiredRight="DELETE" hankeTunnus={hankeData.hankeTunnus}>
              <Button
                onClick={onCancelHanke}
                variant={ButtonVariant.Danger}
                iconStart={<IconTrash />}
              >
                {t('hankeForm:cancelButton')}
              </Button>
            </CheckRightsByHanke>
          )}
        </InformationViewHeaderButtons>
      </InformationViewHeader>

      <InformationViewContentContainer hideSideBar={!features.hanke}>
        <InformationViewMainContent>
          <FeatureFlags flags={['hanke']}>
            <HankeGeneratedStateNotification
              generated={hankeData.generated}
              className={styles.stateNotification}
            />
            {!isHankeCompleted && (
              <FormPagesErrorSummary
                data={hankeData}
                schema={hankeSchema}
                validationContext={{ hanke: hankeData }}
                notificationLabel={t('hankePortfolio:draftState:labels:insufficientPhases')}
                testId="hankeDraftStateNotification"
              />
            )}
            {isHankeCompleted && (
              <Notification
                type="success"
                label={t('hankePortfolio:completedState:labels:completed')}
              >
                {t('hankePortfolio:completedState:notifications:completed', {
                  date: formatToFinnishDate(deletionDate ?? null),
                })}
              </Notification>
            )}
          </FeatureFlags>

          <Tabs small initiallyActiveTab={features.hanke ? initiallyActiveTab : 0}>
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
                  return <HankeAreaInfo key={area.id} area={area} index={index} />;
                })}
              </TabPanel>
            )}
            {features.hanke && (
              <TabPanel>
                {alueet?.map((area, index) => {
                  return (
                    <HaittojenhallintasuunnitelmaInfo key={area.id} area={area} index={index} />
                  );
                })}
              </TabPanel>
            )}
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
            {features.hanke && (
              <TabPanel>
                {attachments && (
                  <AttachmentSummary
                    hankeTunnus={hankeData.hankeTunnus}
                    attachments={attachments}
                  />
                )}
              </TabPanel>
            )}
            <TabPanel>
              <>
                {isLoading && (
                  <Flex justify="center" mt="var(--spacing-xl)">
                    <LoadingSpinner />
                  </Flex>
                )}
                {applicationsResponse?.applications && (
                  <ApplicationList
                    hankeTunnus={hankeData.hankeTunnus}
                    hankeStatus={hankeData.status}
                    applications={applicationsResponse.applications}
                  />
                )}
                {error && <ErrorLoadingText />}
              </>
            </TabPanel>
          </Tabs>
        </InformationViewMainContent>
        <InformationViewSidebar testId="hanke-map">
          <OwnHankeMapHeader hankeTunnus={hankeData.hankeTunnus} showLink={alueet.length > 0} />
          {alueet?.length > 0 ? (
            <>
              <OwnHankeMap hanke={hankeData} />
              {alueet?.map((area, index) => {
                return (
                  <CompressedAreaIndex
                    key={area.id}
                    area={area}
                    haittaIndex={area.tormaystarkasteluTulos?.liikennehaittaindeksi?.indeksi}
                    index={index}
                    className={styles.compressedAreaIndex}
                  />
                );
              })}
            </>
          ) : (
            <MapPlaceholder />
          )}
        </InformationViewSidebar>
      </InformationViewContentContainer>
    </InformationViewContainer>
  );
};

export default HankeView;
