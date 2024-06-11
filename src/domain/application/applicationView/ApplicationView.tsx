import {
  Accordion,
  Button,
  IconEnvelope,
  IconPen,
  IconTrash,
  Notification,
  Tab,
  TabList,
  TabPanel,
  Tabs,
} from 'hds-react';
import { Box } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
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
  Application,
  ApplicationArea,
  JohtoselvitysData,
  KaivuilmoitusAlue,
  KaivuilmoitusData,
} from '../types/application';
import JohtoselvitysBasicInformationSummary from '../components/summary/JohtoselvitysBasicInformationSummary';
import KaivuilmoitusBasicInformationSummary from '../components/summary/KaivuilmoitusBasicInformationSummary';
import { getAreaGeometries, getAreaGeometry } from '../../johtoselvitys/utils';
import { formatSurfaceArea, getTotalSurfaceArea } from '../../map/utils';
import useLocale from '../../../common/hooks/useLocale';
import { getAreaDefaultName, isApplicationSent, isContactIn, sendApplication } from '../utils';
import ApplicationDates from '../components/ApplicationDates';
import ContactsSummary from '../components/summary/ContactsSummary';
import OwnHankeMapHeader from '../../map/components/OwnHankeMap/OwnHankeMapHeader';
import OwnHankeMap from '../../map/components/OwnHankeMap/OwnHankeMap';
import Link from '../../../common/components/Link/Link';
import useHankeViewPath from '../../hanke/hooks/useHankeViewPath';
import DecisionLink from '../components/DecisionLink';
import { ApplicationCancel } from '../components/ApplicationCancel';
import AttachmentSummary from '../components/summary/AttachmentSummary';
import useAttachments from '../hooks/useAttachments';
import { CheckRightsByHanke } from '../../hanke/hankeUsers/UserRightsCheck';
import MainHeading from '../../../common/components/mainHeading/MainHeading';
import KaivuilmoitusAttachmentSummary from '../components/summary/KaivuilmoitusAttachmentSummary';
import InvoicingCustomerSummary from '../components/summary/InvoicingCustomerSummary';
import React from 'react';
import { useMutation, useQueryClient } from 'react-query';
import useApplicationSendNotification from '../hooks/useApplicationSendNotification';
import { SignedInUser } from '../../hanke/hankeUsers/hankeUser';

type Props = {
  application: Application;
  hanke: HankeData | undefined;
  signedInUser: SignedInUser | undefined;
  onEditApplication: () => void;
};

function ApplicationView({ application, hanke, signedInUser, onEditApplication }: Readonly<Props>) {
  const { t } = useTranslation();

  const locale = useLocale();

  const hankeViewPath = useHankeViewPath(application.hankeTunnus);

  const { applicationData, applicationIdentifier, applicationType, alluStatus, id } = application;
  const {
    name,
    areas,
    startTime,
    endTime,
    customerWithContacts,
    contractorWithContacts,
    propertyDeveloperWithContacts,
    representativeWithContacts,
  } = applicationData;
  const tyoalueet =
    applicationType === 'CABLE_REPORT'
      ? (areas as ApplicationArea[])
      : (areas as KaivuilmoitusAlue[]).flatMap((area) => area.tyoalueet);

  const applicationId =
    applicationIdentifier || t(`hakemus:applicationTypeDraft:${applicationType}`);

  const { data: attachments } = useAttachments(id);

  // Text for the link leading back to hanke view
  const hankeLinkText = `${hanke?.nimi} (${hanke?.hankeTunnus})`;

  const geometries: Geometry[] = getAreaGeometries(tyoalueet);
  const totalSurfaceArea = getTotalSurfaceArea(geometries);

  const isSent = isApplicationSent(alluStatus);

  const isContact = isContactIn(signedInUser, applicationData);
  const showSendButton = !isSent;
  const disableSendButton = showSendButton && !isContact;
  const { showSendSuccess, showSendError } = useApplicationSendNotification(
    'hakemus:notifications:sendErrorTextNoSave',
  );
  const queryClient = useQueryClient();
  const applicationSendMutation = useMutation(sendApplication, {
    onError() {
      showSendError();
    },
    async onSuccess() {
      showSendSuccess();
      await queryClient.invalidateQueries('application', { refetchInactive: true });
    },
  });
  async function onSendApplication() {
    applicationSendMutation.mutate(id as number);
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
            <Box display="flex">
              <Box as="span" mr="var(--spacing-2-xs)">
                <ApplicationStatusTag status={alluStatus} />
              </Box>
              {alluStatus === AlluStatus.DECISION && (
                <DecisionLink
                  applicationId={id}
                  linkText={t('hakemus:labels:downloadDecisionShort')}
                  filename={applicationIdentifier}
                />
              )}
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
                onClick={onSendApplication}
                isLoading={applicationSendMutation.isLoading}
                loadingText={t('common:buttons:sendingText')}
                disabled={disableSendButton}
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
              {tyoalueet.map((_, index) => {
                const areaName = getAreaDefaultName(t, index, tyoalueet.length);
                return (
                  <Accordion language={locale} heading={areaName} initiallyOpen key={areaName}>
                    <FormSummarySection style={{ marginBottom: 'auto' }}>
                      <SectionItemTitle>{t('hakemus:labels:areaDuration')}</SectionItemTitle>
                      <SectionItemContent>
                        <ApplicationDates startTime={startTime} endTime={endTime} />
                      </SectionItemContent>
                    </FormSummarySection>
                  </Accordion>
                );
              })}
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
        <InformationViewSidebar>
          {hanke && (
            <>
              <Box mb="var(--spacing-s)">
                <OwnHankeMapHeader hankeTunnus={hanke.hankeTunnus} showLink={false} />
                <OwnHankeMap hanke={hanke} application={application} />
              </Box>
              {tyoalueet.map((alue, index) => {
                const areaName = getAreaDefaultName(t, index, tyoalueet.length);
                const geometry = getAreaGeometry(alue);
                return (
                  <Box
                    padding="var(--spacing-s)"
                    paddingRight="var(--spacing-m)"
                    borderBottom="1px solid var(--color-black-30)"
                    key={areaName}
                  >
                    <Text tag="p" styleAs="body-m" weight="bold" spacingBottom="2-xs">
                      {areaName} ({formatSurfaceArea(geometry)})
                    </Text>
                    <ApplicationDates startTime={startTime} endTime={endTime} />
                  </Box>
                );
              })}
            </>
          )}
        </InformationViewSidebar>
      </InformationViewContentContainer>
    </InformationViewContainer>
  );
}

export default ApplicationView;
