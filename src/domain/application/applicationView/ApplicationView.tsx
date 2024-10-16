import {
  Accordion,
  Button,
  IconCheck,
  IconCheckCircle,
  IconEnvelope,
  IconPen,
  IconTrash,
  Notification,
  Tab,
  TabList,
  TabPanel,
  Tabs,
} from 'hds-react';
import { Box, Flex } from '@chakra-ui/react';
import { Trans, useTranslation } from 'react-i18next';
import Geometry from 'ol/geom/Geometry';
import Text from '../../../common/components/text/Text';
import {
  InformationViewContainer,
  InformationViewContentContainer,
  InformationViewHeader,
  InformationViewHeaderButtons,
  InformationViewMainContent,
  InformationViewSidebar,
} from '../../common/components/hankeInformationView/HankeInformationView';
import {
  FormSummarySection,
  SectionItemContent,
  SectionItemTitle,
  SectionTitle,
} from '../../forms/components/FormSummarySection';
import { HankeData } from '../../types/hanke';
import ApplicationStatusTag from '../components/ApplicationStatusTag';
import {
  AlluStatus,
  AlluStatusStrings,
  Application,
  ApplicationArea,
  JohtoselvitysData,
  KaivuilmoitusAlue,
  KaivuilmoitusData,
  PaperDecisionReceiver,
  Valmistumisilmoitukset,
} from '../types/application';
import JohtoselvitysBasicInformationSummary from '../components/summary/JohtoselvitysBasicInformationSummary';
import KaivuilmoitusBasicInformationSummary from '../components/summary/KaivuilmoitusBasicInformationSummary';
import { getAreaGeometries, getAreaGeometry } from '../../johtoselvitys/utils';
import { formatSurfaceArea, getTotalSurfaceArea } from '../../map/utils';
import useLocale from '../../../common/hooks/useLocale';
import {
  getAreaDefaultName,
  getCurrentDecisions,
  getDecisionFilename,
  isApplicationReportableInOperationalCondition,
  isApplicationReportableWorkFinished,
  isApplicationSent,
  isContactIn,
} from '../utils';
import ApplicationDates from '../components/ApplicationDates';
import ContactsSummary from '../components/summary/ContactsSummary';
import OwnHankeMapHeader from '../../map/components/OwnHankeMap/OwnHankeMapHeader';
import OwnHankeMap from '../../map/components/OwnHankeMap/OwnHankeMap';
import Link from '../../../common/components/Link/Link';
import useHankeViewPath from '../../hanke/hooks/useHankeViewPath';
import JohtoselvitysDecisionLink from '../../johtoselvitys/components/DecisionLink';
import KaivuilmoitusDecisionLink from '../../kaivuilmoitus/components/DecisionLink';
import { ApplicationCancel } from '../components/ApplicationCancel';
import AttachmentSummary from '../components/summary/AttachmentSummary';
import useAttachments from '../hooks/useAttachments';
import { CheckRightsByHanke } from '../../hanke/hankeUsers/UserRightsCheck';
import MainHeading from '../../../common/components/mainHeading/MainHeading';
import KaivuilmoitusAttachmentSummary from '../components/summary/KaivuilmoitusAttachmentSummary';
import InvoicingCustomerSummary from '../components/summary/InvoicingCustomerSummary';
import { useState } from 'react';
import { SignedInUser } from '../../hanke/hankeUsers/hankeUser';
import useSendApplication from '../hooks/useSendApplication';
import { validationSchema as johtoselvitysValidationSchema } from '../../johtoselvitys/validationSchema';
import { validationSchema as kaivuilmoitusValidationSchema } from '../../kaivuilmoitus/validationSchema';
import ApplicationReportCompletionDateDialog from '../../kaivuilmoitus/components/ApplicationReportCompletionDateDialog';
import { formatToFinnishDate, formatToFinnishDateTime } from '../../../common/utils/date';
import HaittaIndexes from '../../common/haittaIndexes/HaittaIndexes';
import { calculateLiikennehaittaindeksienYhteenveto } from '../../kaivuilmoitus/utils';
import styles from './ApplicationView.module.scss';
import CustomAccordion from '../../../common/components/customAccordion/CustomAccordion';
import useFilterHankeAlueetByApplicationDates from '../hooks/useFilterHankeAlueetByApplicationDates';
import ApplicationSendDialog from '../components/ApplicationSendDialog';

function SidebarTyoalueet({
  tyoalueet,
  startTime,
  endTime,
}: {
  tyoalueet: ApplicationArea[];
  startTime: Date | null;
  endTime: Date | null;
}) {
  const { t } = useTranslation();

  return tyoalueet.map((tyoalue, index) => {
    const areaName = getAreaDefaultName(t, index, tyoalueet.length);
    const geometry = getAreaGeometry(tyoalue);
    return (
      <Box
        key={areaName}
        padding="var(--spacing-s)"
        paddingRight="var(--spacing-m)"
        _notLast={{ borderBottom: '1px solid var(--color-black-30)' }}
      >
        <Text tag="p" styleAs="body-m" weight="bold" spacingBottom="2-xs">
          {areaName} ({formatSurfaceArea(geometry)})
        </Text>
        <ApplicationDates startTime={startTime} endTime={endTime} />
      </Box>
    );
  });
}

function TyoalueetList({ tyoalueet }: { tyoalueet: ApplicationArea[] }) {
  const { t } = useTranslation();

  return (
    <ul>
      {tyoalueet.map((tyoalue, tyoalueIndex) => {
        const geom = getAreaGeometry(tyoalue);
        return (
          <Box
            as="li"
            key={tyoalueIndex}
            listStyleType="none"
            marginBottom="var(--spacing-s)"
            _last={{ marginBottom: '0px' }}
          >
            <Box as="p" marginBottom="var(--spacing-xs)">
              <strong>{getAreaDefaultName(t, tyoalueIndex, tyoalueet.length)}</strong>
            </Box>
            <p>
              {t('form:labels:pintaAla')}: {formatSurfaceArea(geom)}
            </p>
          </Box>
        );
      })}
    </ul>
  );
}

function JohtoselvitysAreasInfo({
  tyoalueet,
  startTime,
  endTime,
}: {
  tyoalueet: ApplicationArea[];
  startTime: Date | null;
  endTime: Date | null;
}) {
  const { t } = useTranslation();
  const locale = useLocale();

  return tyoalueet.map((_, index) => {
    const areaName = getAreaDefaultName(t, index, tyoalueet.length);
    return (
      <Accordion
        language={locale}
        heading={areaName}
        initiallyOpen
        key={areaName}
        className={styles.applicationAreaContainer}
      >
        <FormSummarySection style={{ marginBottom: 'auto' }}>
          <SectionItemTitle>{t('hakemus:labels:areaDuration')}</SectionItemTitle>
          <SectionItemContent>
            <ApplicationDates startTime={startTime} endTime={endTime} />
          </SectionItemContent>
        </FormSummarySection>
      </Accordion>
    );
  });
}

function KaivuilmoitusAreasInfo({ areas }: { areas: KaivuilmoitusAlue[] | null }) {
  const { t } = useTranslation();
  const locale = useLocale();

  if (!areas) {
    return null;
  }

  return areas.map((alue) => {
    const { tyoalueet } = alue;
    const geometries: Geometry[] = getAreaGeometries(tyoalueet);
    const totalSurfaceArea = getTotalSurfaceArea(geometries);
    return (
      <Accordion
        language={locale}
        heading={alue.name}
        initiallyOpen
        key={alue.hankealueId}
        className={styles.applicationAreaContainer}
      >
        <FormSummarySection style={{ marginBottom: 'var(--spacing-l)' }}>
          <SectionItemTitle>{t('form:yhteystiedot:labels:osoite')}</SectionItemTitle>
          <SectionItemContent>{alue.katuosoite}</SectionItemContent>
          <SectionItemTitle>{t('hakemus:labels:tyonTarkoitus')}</SectionItemTitle>
          <SectionItemContent>
            {alue.tyonTarkoitukset?.map((tyyppi) => t(`hanke:tyomaaTyyppi:${tyyppi}`)).join(', ')}
          </SectionItemContent>
          <SectionItemTitle>{t('form:headers:alueet')}</SectionItemTitle>
          <SectionItemContent>
            <TyoalueetList tyoalueet={tyoalueet} />
          </SectionItemContent>
          <SectionItemTitle>{t('form:labels:kokonaisAla')}</SectionItemTitle>
          <SectionItemContent>{totalSurfaceArea} m²</SectionItemContent>
        </FormSummarySection>
        <Box marginBottom="var(--spacing-l)">
          <HaittaIndexes
            heading={`${t('kaivuilmoitusForm:alueet:liikennehaittaindeksienYhteenveto')} (0-5)`}
            haittaIndexData={calculateLiikennehaittaindeksienYhteenveto(alue)}
            initiallyOpen
          />
        </Box>
        <Box as="h2" className="heading-xxs" marginBottom="var(--spacing-m)">
          {t('kaivuilmoitusForm:alueet:areaNuisanceDefinitions')}
        </Box>
        <FormSummarySection style={{ marginBottom: 'var(--spacing-s)' }}>
          <SectionItemTitle>{t('hankeForm:labels:meluHaitta')}</SectionItemTitle>
          <SectionItemContent>
            {alue.meluhaitta ? t(`hanke:meluHaitta:${alue.meluhaitta}`) : '-'}
          </SectionItemContent>
          <SectionItemTitle>{t('hankeForm:labels:polyHaitta')}</SectionItemTitle>
          <SectionItemContent>
            {alue.polyhaitta ? t(`hanke:polyHaitta:${alue.polyhaitta}`) : '-'}
          </SectionItemContent>
          <SectionItemTitle>{t('hankeForm:labels:tarinaHaitta')}</SectionItemTitle>
          <SectionItemContent>
            {alue.tarinahaitta ? t(`hanke:tarinaHaitta:${alue.tarinahaitta}`) : '-'}
          </SectionItemContent>
          <SectionItemTitle>{t('hankeForm:labels:kaistaHaitta')}</SectionItemTitle>
          <SectionItemContent>
            {alue.kaistahaitta ? t(`hanke:kaistaHaitta:${alue.kaistahaitta}`) : '-'}
          </SectionItemContent>
          <SectionItemTitle>{t('hankeForm:labels:kaistaPituusHaitta')}</SectionItemTitle>
          <SectionItemContent>
            {alue.kaistahaittojenPituus
              ? t(`hanke:kaistaPituusHaitta:${alue.kaistahaittojenPituus}`)
              : '-'}
          </SectionItemContent>
          <SectionItemTitle>{t('hakemus:labels:areaAdditionalInfo')}</SectionItemTitle>
          <SectionItemContent>{alue.lisatiedot ? alue.lisatiedot : '-'}</SectionItemContent>
        </FormSummarySection>
      </Accordion>
    );
  });
}

function PaperDecisionReceiverSummary({
  paperDecisionReceiver,
}: {
  paperDecisionReceiver: PaperDecisionReceiver;
}) {
  const { t } = useTranslation();

  return (
    <>
      <SectionItemTitle>{t('hakemus:labels:paperDecisionOrdered')}</SectionItemTitle>
      <SectionItemContent>
        <p>{paperDecisionReceiver.name}</p>
        <p>{paperDecisionReceiver.streetAddress}</p>
        <p>
          {paperDecisionReceiver.postalCode} {paperDecisionReceiver.city}
        </p>
      </SectionItemContent>
    </>
  );
}

function getLastValmistumisilmoitus(
  alluStatus: AlluStatusStrings | null,
  valmistumisilmoitukset: Valmistumisilmoitukset | null | undefined,
) {
  if (alluStatus == null || valmistumisilmoitukset == null) {
    return null;
  }
  const reports =
    alluStatus === 'OPERATIONAL_CONDITION'
      ? valmistumisilmoitukset['TOIMINNALLINEN_KUNTO']
      : valmistumisilmoitukset['TYO_VALMIS'];
  if (!reports) {
    return null;
  }
  const tyyppi = alluStatus === 'OPERATIONAL_CONDITION' ? 'TOIMINNALLINEN_KUNTO' : 'TYO_VALMIS';
  const lastReport = reports.toSorted(
    (a, b) => new Date(b.reportedAt).getTime() - new Date(a.reportedAt).getTime(),
  )[0];
  return {
    tyyppi,
    reportedAt: formatToFinnishDateTime(lastReport.reportedAt),
    dateReported: formatToFinnishDate(lastReport.dateReported),
  };
}

const validationSchemas = {
  CABLE_REPORT: johtoselvitysValidationSchema,
  EXCAVATION_NOTIFICATION: kaivuilmoitusValidationSchema,
};

type Props = {
  application: Application;
  hanke: HankeData | undefined;
  signedInUser: SignedInUser | undefined;
  onEditApplication: () => void;
};

function ApplicationView({ application, hanke, signedInUser, onEditApplication }: Readonly<Props>) {
  const { t } = useTranslation();
  const [isSendButtonDisabled, setIsSendButtonDisabled] = useState(false);
  const [showSendDialog, setShowSendDialog] = useState(false);
  const [showReportOperationalConditionDialog, setShowReportOperationalConditionDialog] =
    useState(false);
  const [showReportWorkFinishedDialog, setShowReportWorkFinishedDialog] = useState(false);
  const hankeViewPath = useHankeViewPath(application.hankeTunnus);
  const {
    applicationData,
    applicationIdentifier,
    applicationType,
    alluStatus,
    id,
    paatokset,
    valmistumisilmoitukset,
  } = application;
  const {
    name,
    areas,
    startTime,
    endTime,
    customerWithContacts,
    contractorWithContacts,
    propertyDeveloperWithContacts,
    representativeWithContacts,
    paperDecisionReceiver,
  } = applicationData;
  const tyoalueet =
    applicationType === 'CABLE_REPORT'
      ? (areas as ApplicationArea[])
      : (areas as KaivuilmoitusAlue[]).flatMap((area) => area.tyoalueet);
  const kaivuilmoitusAlueet =
    applicationType === 'EXCAVATION_NOTIFICATION' ? (areas as KaivuilmoitusAlue[]) : null;
  const currentDecisions = getCurrentDecisions(paatokset);
  const applicationId =
    applicationIdentifier || t(`hakemus:applicationTypeDraft:${applicationType}`);

  const { data: attachments } = useAttachments(id);

  // Text for the link leading back to hanke view
  const hankeLinkText = `${hanke?.nimi} (${hanke?.hankeTunnus})`;

  const geometries: Geometry[] = getAreaGeometries(tyoalueet);
  const totalSurfaceArea = getTotalSurfaceArea(geometries);

  const lastValmistumisilmoitus = getLastValmistumisilmoitus(alluStatus, valmistumisilmoitukset);

  const isSent = isApplicationSent(alluStatus);

  const validationSchema = validationSchemas[applicationType];
  const isValid = validationSchema.isValidSync(application);
  const isContact = isContactIn(signedInUser, applicationData);
  const showSendButton = !isSent && isValid;
  const disableSendButton = showSendButton && !isContact;
  const showReportOperationalConditionButton = isApplicationReportableInOperationalCondition(
    applicationType,
    alluStatus,
  );
  const showReportWorkFinishedButton = isApplicationReportableWorkFinished(
    applicationType,
    alluStatus,
  );
  const applicationSendMutation = useSendApplication();

  const filterHankeAlueet = useFilterHankeAlueetByApplicationDates({
    applicationStartDate: startTime,
    applicationEndDate: endTime,
  });

  async function onSendApplication(pdr: PaperDecisionReceiver | undefined | null) {
    applicationSendMutation.mutate({
      id: id as number,
      paperDecisionReceiver: pdr,
    });
    setIsSendButtonDisabled(true);
    setShowSendDialog(false);
  }

  function openSendDialog() {
    setShowSendDialog(true);
  }

  function closeSendDialog() {
    setShowSendDialog(false);
  }

  function openReportOperationalConditionDialog() {
    setShowReportOperationalConditionDialog(true);
  }

  function closeReportOperationalConditionDialog() {
    setShowReportOperationalConditionDialog(false);
  }

  function openReportWorkFinishedDialog() {
    setShowReportWorkFinishedDialog(true);
  }

  function closeReportWorkFinishedDialog() {
    setShowReportWorkFinishedDialog(false);
  }

  function getHankeWithAlueetFilteredByDates(hankeData: HankeData): HankeData {
    return {
      ...hankeData,
      alueet: filterHankeAlueet(hankeData.alueet),
    };
  }

  return (
    <InformationViewContainer>
      <InformationViewHeader backgroundColor="var(--color-suomenlinna-light)">
        <MainHeading>{name}</MainHeading>
        <Text tag="h2" styleAs="h3" weight="bold" spacingBottom="l">
          {applicationId}
        </Text>

        <FormSummarySection>
          <SectionItemTitle>{t('hakemus:labels:applicationType')}:</SectionItemTitle>
          <SectionItemContent>
            {t(`hakemus:applicationTypes:${applicationType}`)}
          </SectionItemContent>
          <SectionItemTitle>{t('hakemus:labels:applicationState')}:</SectionItemTitle>
          <SectionItemContent>
            <Box>
              <Flex mb="var(--spacing-2-xs)" alignItems="center">
                <ApplicationStatusTag status={alluStatus} />
                {lastValmistumisilmoitus && (
                  <>
                    <IconCheck aria-hidden="true" />
                    <Box as="span">
                      <Trans
                        i18nKey={`hakemus:labels:completionDate:${lastValmistumisilmoitus.tyyppi}`}
                      >
                        Ilmoitettu {{ lastValmistumisilmoitus }}
                      </Trans>
                    </Box>
                  </>
                )}
              </Flex>
              {applicationType === 'CABLE_REPORT' && alluStatus === AlluStatus.DECISION && (
                <JohtoselvitysDecisionLink
                  applicationId={id}
                  linkText={t('hakemus:labels:downloadDecision:PAATOS')}
                  filename={applicationIdentifier}
                />
              )}
              {applicationType === 'EXCAVATION_NOTIFICATION' &&
                currentDecisions.map((paatos) => (
                  <Box key={paatos.tyyppi} mt="var(--spacing-2-xs)">
                    <KaivuilmoitusDecisionLink
                      id={paatos.id}
                      linkText={t(`hakemus:labels:downloadDecision:${paatos.tyyppi}`)}
                      filename={getDecisionFilename(paatos)}
                    />
                  </Box>
                ))}
            </Box>
          </SectionItemContent>
          <SectionItemTitle>{t('hakemus:labels:relatedHanke')}:</SectionItemTitle>
          <SectionItemContent>
            {hanke && <Link href={hankeViewPath}>{hankeLinkText}</Link>}
          </SectionItemContent>
          <SectionItemTitle>{t('hankePortfolio:labels:oikeudet')}:</SectionItemTitle>
          <SectionItemContent>
            {t(`hankeUsers:accessRightLevels:${signedInUser?.kayttooikeustaso}`)}
          </SectionItemContent>
        </FormSummarySection>

        <InformationViewHeaderButtons>
          {!isSent ? (
            <CheckRightsByHanke requiredRight="EDIT_APPLICATIONS" hankeTunnus={hanke?.hankeTunnus}>
              <Button
                theme="coat"
                iconLeft={<IconPen aria-hidden="true" />}
                onClick={onEditApplication}
              >
                {t('hakemus:buttons:editApplication')}
              </Button>
            </CheckRightsByHanke>
          ) : null}
          {hanke ? (
            <CheckRightsByHanke requiredRight="EDIT_APPLICATIONS" hankeTunnus={hanke?.hankeTunnus}>
              <ApplicationCancel
                applicationId={id}
                alluStatus={alluStatus}
                hankeTunnus={hanke?.hankeTunnus}
                buttonIcon={<IconTrash aria-hidden />}
              />
            </CheckRightsByHanke>
          ) : null}
          {showSendButton && (
            <CheckRightsByHanke requiredRight="EDIT_APPLICATIONS" hankeTunnus={hanke?.hankeTunnus}>
              <Button
                theme="coat"
                iconLeft={<IconEnvelope aria-hidden="true" />}
                onClick={openSendDialog}
                disabled={disableSendButton || isSendButtonDisabled}
              >
                {t('hakemus:buttons:sendApplication')}
              </Button>
            </CheckRightsByHanke>
          )}
          {disableSendButton && (
            <CheckRightsByHanke requiredRight="EDIT_APPLICATIONS" hankeTunnus={hanke?.hankeTunnus}>
              <Notification
                size="small"
                style={{ marginTop: 'var(--spacing-xs)' }}
                type="info"
                label={t('hakemus:notifications:sendApplicationDisabled')}
              >
                {t('hakemus:notifications:sendApplicationDisabled')}
              </Notification>
            </CheckRightsByHanke>
          )}
          {showReportOperationalConditionButton && (
            <CheckRightsByHanke requiredRight="EDIT_APPLICATIONS" hankeTunnus={hanke?.hankeTunnus}>
              <Button
                theme="coat"
                iconLeft={<IconCheck aria-hidden="true" />}
                onClick={openReportOperationalConditionDialog}
              >
                {t('hakemus:buttons:reportOperationalCondition')}
              </Button>
            </CheckRightsByHanke>
          )}
          {showReportWorkFinishedButton && (
            <CheckRightsByHanke requiredRight="EDIT_APPLICATIONS" hankeTunnus={hanke?.hankeTunnus}>
              <Button
                variant="success"
                theme="coat"
                iconLeft={<IconCheckCircle aria-hidden="true" />}
                onClick={openReportWorkFinishedDialog}
              >
                {t('hakemus:buttons:reportWorkFinished')}
              </Button>
            </CheckRightsByHanke>
          )}
        </InformationViewHeaderButtons>
      </InformationViewHeader>

      <InformationViewContentContainer>
        <InformationViewMainContent>
          <Tabs>
            <TabList style={{ marginBottom: 'var(--spacing-m)' }}>
              <Tab>{t('hankePortfolio:tabit:perustiedot')}</Tab>
              <Tab>{t('hankePortfolio:tabit:alueet')}</Tab>
              <Tab>{t('hankePortfolio:tabit:yhteystiedot')}</Tab>
              <Tab>{t('hankePortfolio:tabit:liitteet')}</Tab>
            </TabList>
            <TabPanel>
              {/* Basic information panel */}
              {applicationType === 'CABLE_REPORT' && (
                <JohtoselvitysBasicInformationSummary
                  formData={application as Application<JohtoselvitysData>}
                >
                  <SectionItemTitle>{t('hakemus:labels:totalSurfaceArea')}</SectionItemTitle>
                  <SectionItemContent>
                    {totalSurfaceArea > 0 && <p>{totalSurfaceArea} m²</p>}
                  </SectionItemContent>
                </JohtoselvitysBasicInformationSummary>
              )}
              {applicationType === 'EXCAVATION_NOTIFICATION' && (
                <KaivuilmoitusBasicInformationSummary
                  formData={application as Application<KaivuilmoitusData>}
                >
                  <SectionItemTitle>{t('hakemus:labels:totalSurfaceArea')}</SectionItemTitle>
                  <SectionItemContent>
                    {totalSurfaceArea > 0 && <p>{totalSurfaceArea} m²</p>}
                  </SectionItemContent>
                </KaivuilmoitusBasicInformationSummary>
              )}
            </TabPanel>
            <TabPanel>
              {/* Areas information panel */}
              <FormSummarySection style={{ marginBottom: 'var(--spacing-m)' }}>
                <SectionItemTitle>{t('kaivuilmoitusForm:alueet:startDate')}</SectionItemTitle>
                <SectionItemContent>
                  {startTime && <p>{formatToFinnishDate(startTime)}</p>}
                </SectionItemContent>
                <SectionItemTitle>{t('kaivuilmoitusForm:alueet:endDate')}</SectionItemTitle>
                <SectionItemContent>
                  {endTime && <p>{formatToFinnishDate(endTime)}</p>}
                </SectionItemContent>
              </FormSummarySection>
              {applicationType === 'CABLE_REPORT' && (
                <JohtoselvitysAreasInfo
                  tyoalueet={tyoalueet}
                  startTime={startTime}
                  endTime={endTime}
                />
              )}
              {applicationType === 'EXCAVATION_NOTIFICATION' && (
                <KaivuilmoitusAreasInfo areas={kaivuilmoitusAlueet} />
              )}
            </TabPanel>
            <TabPanel>
              {/* Contacts information panel */}
              <SectionTitle>{t('form:yhteystiedot:header')}</SectionTitle>
              <FormSummarySection>
                <ContactsSummary
                  customerWithContacts={customerWithContacts}
                  title={t('form:yhteystiedot:titles:customerWithContacts')}
                />
                <ContactsSummary
                  customerWithContacts={contractorWithContacts}
                  title={t('form:yhteystiedot:titles:contractorWithContacts')}
                />
                <ContactsSummary
                  customerWithContacts={propertyDeveloperWithContacts}
                  title={t('form:yhteystiedot:titles:rakennuttajat')}
                />
                <ContactsSummary
                  customerWithContacts={representativeWithContacts}
                  title={t('form:yhteystiedot:titles:representativeWithContacts')}
                />
                {applicationType === 'EXCAVATION_NOTIFICATION' && (
                  <InvoicingCustomerSummary
                    invoicingCustomer={(applicationData as KaivuilmoitusData).invoicingCustomer}
                  />
                )}
                {paperDecisionReceiver && (
                  <PaperDecisionReceiverSummary paperDecisionReceiver={paperDecisionReceiver} />
                )}
              </FormSummarySection>
            </TabPanel>
            <TabPanel>
              {applicationType === 'EXCAVATION_NOTIFICATION' ? (
                <SectionTitle>{t('form:headers:liitteetJaLisatiedot')}</SectionTitle>
              ) : (
                <SectionTitle>{t('hankePortfolio:tabit:liitteet')}</SectionTitle>
              )}
              {applicationType === 'EXCAVATION_NOTIFICATION' ? (
                <KaivuilmoitusAttachmentSummary
                  formData={application as Application<KaivuilmoitusData>}
                  attachments={attachments}
                />
              ) : attachments && attachments.length > 0 ? (
                <AttachmentSummary attachments={attachments} />
              ) : null}
            </TabPanel>
          </Tabs>
        </InformationViewMainContent>
        <InformationViewSidebar testId="application-view-sidebar">
          {hanke && (
            <>
              <Box mb="var(--spacing-s)">
                <OwnHankeMapHeader hankeTunnus={hanke.hankeTunnus} showLink={false} />
                <OwnHankeMap
                  hanke={getHankeWithAlueetFilteredByDates(hanke)}
                  application={application}
                />
              </Box>
              {applicationType === 'CABLE_REPORT' && (
                <SidebarTyoalueet tyoalueet={tyoalueet} startTime={startTime} endTime={endTime} />
              )}
              {applicationType === 'EXCAVATION_NOTIFICATION' &&
                kaivuilmoitusAlueet?.map((kaivuilmoitusAlue) => {
                  const hankeAlue = hanke.alueet.find(
                    (alue) => alue.id === kaivuilmoitusAlue.hankealueId,
                  );
                  return (
                    <CustomAccordion
                      key={kaivuilmoitusAlue.hankealueId}
                      accordionBorderBottom
                      headingSize="s"
                      heading={kaivuilmoitusAlue.name}
                      subHeading={
                        <Box marginTop="var(--spacing-2-xs)">
                          <ApplicationDates
                            startTime={hankeAlue?.haittaAlkuPvm ?? null}
                            endTime={hankeAlue?.haittaLoppuPvm ?? null}
                          />
                        </Box>
                      }
                    >
                      <Box marginLeft="var(--spacing-s)">
                        <SidebarTyoalueet
                          tyoalueet={kaivuilmoitusAlue.tyoalueet}
                          startTime={startTime}
                          endTime={endTime}
                        />
                      </Box>
                    </CustomAccordion>
                  );
                })}
            </>
          )}
        </InformationViewSidebar>
      </InformationViewContentContainer>
      {applicationType === 'EXCAVATION_NOTIFICATION' && (
        <ApplicationReportCompletionDateDialog
          type="TOIMINNALLINEN_KUNTO"
          isOpen={showReportOperationalConditionDialog}
          onClose={closeReportOperationalConditionDialog}
          applicationId={application.id as number}
        />
      )}
      {applicationType === 'EXCAVATION_NOTIFICATION' && (
        <ApplicationReportCompletionDateDialog
          type="TYO_VALMIS"
          isOpen={showReportWorkFinishedDialog}
          onClose={closeReportWorkFinishedDialog}
          applicationId={application.id as number}
        />
      )}
      <ApplicationSendDialog
        isOpen={showSendDialog}
        isLoading={applicationSendMutation.isLoading}
        onClose={closeSendDialog}
        onSend={onSendApplication}
        applicationId={application.id as number}
      />
    </InformationViewContainer>
  );
}

export default ApplicationView;
