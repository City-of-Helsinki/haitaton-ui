import { Accordion, Button, IconPen, IconTrash, Tab, TabList, TabPanel, Tabs } from 'hds-react';
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
  JohtoselvitysData,
  KaivuilmoitusData,
} from '../types/application';
import JohtoselvitysBasicInformationSummary from '../components/summary/JohtoselvitysBasicInformationSummary';
import KaivuilmoitusBasicInformationSummary from '../components/summary/KaivuilmoitusBasicInformationSummary';
import { getAreaGeometries, getAreaGeometry } from '../../johtoselvitys/utils';
import { formatSurfaceArea, getTotalSurfaceArea } from '../../map/utils';
import useLocale from '../../../common/hooks/useLocale';
import { getAreaDefaultName, isApplicationSent } from '../utils';
import ApplicationDates from '../components/ApplicationDates';
import ContactsSummary from '../components/ContactsSummary';
import OwnHankeMapHeader from '../../map/components/OwnHankeMap/OwnHankeMapHeader';
import OwnHankeMap from '../../map/components/OwnHankeMap/OwnHankeMap';
import Link from '../../../common/components/Link/Link';
import useHankeViewPath from '../../hanke/hooks/useHankeViewPath';
import DecisionLink from '../components/DecisionLink';
import { ApplicationCancel } from '../components/ApplicationCancel';
import AttachmentSummary from '../components/AttachmentSummary';
import useAttachments from '../hooks/useAttachments';
import FeatureFlags from '../../../common/components/featureFlags/FeatureFlags';
import { CheckRightsByHanke } from '../../hanke/hankeUsers/UserRightsCheck';
import MainHeading from '../../../common/components/mainHeading/MainHeading';
import KaivuilmoitusAttachmentSummary from '../components/summary/KaivuilmoitusAttachmentSummary';

type Props = {
  application: Application;
  hanke: HankeData | undefined;
  onEditApplication: () => void;
};

function ApplicationView({ application, hanke, onEditApplication }: Readonly<Props>) {
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

  const applicationId =
    applicationIdentifier || t(`hakemus:applicationTypeDraft:${applicationType}`);

  const { data: attachments } = useAttachments(id);

  // Text for the link leading back to hanke view
  const hankeLinkText = `${hanke?.nimi} (${hanke?.hankeTunnus})`;

  const geometries: Geometry[] = getAreaGeometries(areas);
  const totalSurfaceArea = getTotalSurfaceArea(geometries);

  const isSent = isApplicationSent(alluStatus);

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
          <FeatureFlags flags={['accessRights']}>
            <SectionItemTitle>{t('hankePortfolio:labels:oikeudet')}:</SectionItemTitle>
            <SectionItemContent />
          </FeatureFlags>
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
              {areas.map((_, index) => {
                const areaName = getAreaDefaultName(t, index, areas.length);
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
                  title={t('form:yhteystiedot:titles:contractorWithContactsPlural')}
                />
                <ContactsSummary
                  customerWithContacts={propertyDeveloperWithContacts}
                  title={t('form:yhteystiedot:titles:rakennuttajatPlural')}
                />
                <ContactsSummary
                  customerWithContacts={representativeWithContacts}
                  title={t('form:yhteystiedot:titles:representativeWithContactsPlural')}
                />
              </FormSummarySection>
            </TabPanel>
            <TabPanel>
              {applicationType === 'EXCAVATION_NOTIFICATION' ? (
                <SectionTitle>{t('form:headers:liitteetJaLisatiedot')}</SectionTitle>
              ) : (
                <SectionTitle>{t('hankePortfolio:tabit:liitteet')}</SectionTitle>
              )}
              {applicationType === 'EXCAVATION_NOTIFICATION' &&
              attachments &&
              attachments.length > 0 ? (
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
              {areas.map((area, index) => {
                const areaName = getAreaDefaultName(t, index, areas.length);
                const geometry = getAreaGeometry(area);
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
