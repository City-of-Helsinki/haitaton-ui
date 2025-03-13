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
  SectionItemContentAdded,
  SectionItemContentRemoved,
  SectionItemTitle,
} from '../../forms/components/FormSummarySection';
import { HankeAlue, HankeData } from '../../types/hanke';
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
import ContactsSummary from '../components/summary/ContactsSummary';
import JohtoselvitysDecisionLink from '../../johtoselvitys/components/DecisionLink';
import KaivuilmoitusDecisionLink from '../../kaivuilmoitus/components/DecisionLink';
import { ApplicationCancel } from '../components/ApplicationCancel';
import AttachmentSummary from '../components/summary/AttachmentSummary';
import useAttachments from '../hooks/useAttachments';
import { CheckRightsByHanke } from '../../hanke/hankeUsers/UserRightsCheck';
import MainHeading from '../../../common/components/mainHeading/MainHeading';
import KaivuilmoitusAttachmentSummary from '../components/summary/KaivuilmoitusAttachmentSummary';
import InvoicingCustomerSummary from '../components/summary/InvoicingCustomerSummary';
import React, { useState } from 'react';
import { SignedInUser } from '../../hanke/hankeUsers/hankeUser';
import { validationSchema as johtoselvitysValidationSchema } from '../../johtoselvitys/validationSchema';
import { validationSchema as kaivuilmoitusValidationSchema } from '../../kaivuilmoitus/validationSchema';
import ApplicationReportCompletionDateDialog from '../../kaivuilmoitus/components/ApplicationReportCompletionDateDialog';
import { formatToFinnishDate, formatToFinnishDateTime } from '../../../common/utils/date';
import HaittaIndexes from '../../common/haittaIndexes/HaittaIndexes';
import {
  calculateLiikennehaittaindeksienYhteenveto,
  hasHaittaIndexesChanged,
} from '../../kaivuilmoitus/utils';
import styles from './ApplicationView.module.scss';
import ApplicationSendDialog from '../components/ApplicationSendDialog';
import TaydennyspyyntoNotification from '../taydennys/TaydennyspyyntoNotification';
import { useQueryClient } from 'react-query';
import AreaInformation from '../components/summary/AreaInformation';
import useIsInformationRequestFeatureEnabled from '../taydennys/hooks/useIsInformationRequestFeatureEnabled';
import useSendTaydennys from './hooks/useSendTaydennys';
import Sidebar from './Sidebar';
import FormPagesErrorSummary from '../../forms/components/FormPagesErrorSummary';
import TaydennysCancel from '../taydennys/components/TaydennysCancel';
import TaydennysAttachmentsList from '../taydennys/components/TaydennysAttachmentsList';
import { HaittojenhallintasuunnitelmaInfo } from '../../kaivuilmoitus/components/HaittojenhallintasuunnitelmaInfo';
import MuutosilmoitusNotification from '../muutosilmoitus/components/MuutosilmoitusNotification';
import MuutosilmoitusCancel from '../muutosilmoitus/components/MuutosilmoitusCancel';
import useSendMuutosilmoitus from './hooks/useSendMuutosilmoitus';

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

function TotalSurfaceArea({
  tyoalueet,
  changedAreas,
}: Readonly<{
  tyoalueet: ApplicationArea[];
  changedAreas?: ApplicationArea[];
}>) {
  const totalSurfaceArea = getTotalSurfaceArea(getAreaGeometries(tyoalueet));
  const changedTotalSurfaceArea =
    changedAreas && getTotalSurfaceArea(getAreaGeometries(changedAreas));

  return (
    <>
      {totalSurfaceArea > 0 && <p>{totalSurfaceArea} m²</p>}
      {changedTotalSurfaceArea !== undefined && changedTotalSurfaceArea !== totalSurfaceArea && (
        <SectionItemContentAdded marginTop="var(--spacing-s)">
          <p>{changedTotalSurfaceArea} m²</p>
        </SectionItemContentAdded>
      )}
    </>
  );
}

function JohtoselvitysAreasInfo({
  tyoalueet,
  changedAreas,
  muutokset,
}: {
  tyoalueet: ApplicationArea[];
  changedAreas?: ApplicationArea[];
  muutokset?: string[];
}) {
  const { t } = useTranslation();
  const areasChanged =
    changedAreas &&
    muutokset &&
    changedAreas.filter((_area, index) => muutokset.includes(`areas[${index}]`)).length > 0;
  const areasRemoved =
    changedAreas &&
    muutokset &&
    tyoalueet.filter(
      (_area, index) => muutokset.includes(`areas[${index}]`) && !changedAreas[index],
    );

  return (
    <FormSummarySection>
      <SectionItemTitle>{t('hakemus:labels:totalSurfaceArea')}</SectionItemTitle>
      <SectionItemContent>
        <TotalSurfaceArea tyoalueet={tyoalueet} changedAreas={changedAreas} />
      </SectionItemContent>
      <SectionItemTitle>{t('form:labels:areas')}</SectionItemTitle>
      <SectionItemContent>
        {tyoalueet.map((area, index) => {
          return (
            <AreaInformation
              area={area}
              areaName={getAreaDefaultName(t, index, tyoalueet.length)}
              key={index}
            />
          );
        })}
        {areasChanged && (
          <SectionItemContentAdded>
            {changedAreas.map((area, index) => {
              if (!muutokset?.includes(`areas[${index}]`)) {
                return null;
              }
              return (
                <AreaInformation
                  area={area}
                  areaName={getAreaDefaultName(t, index, tyoalueet.length)}
                  key={index}
                />
              );
            })}
          </SectionItemContentAdded>
        )}
        {areasRemoved && areasRemoved.length === tyoalueet.length && (
          <SectionItemContentRemoved marginTop="var(--spacing-s)">
            {areasRemoved.map((area, index) => {
              return (
                <AreaInformation
                  area={area}
                  areaName={getAreaDefaultName(t, tyoalueet.indexOf(area), tyoalueet.length)}
                  key={index}
                />
              );
            })}
          </SectionItemContentRemoved>
        )}
      </SectionItemContent>
    </FormSummarySection>
  );
}

function KaivuilmoitusAreaInfo({
  originalArea,
  areasHaveChanged,
  changedArea,
  muutokset,
  index,
}: Readonly<{
  originalArea?: KaivuilmoitusAlue;
  areasHaveChanged?: boolean;
  changedArea?: KaivuilmoitusAlue;
  muutokset?: string[];
  index: number;
}>) {
  const { t } = useTranslation();
  const locale = useLocale();

  if (originalArea === undefined && changedArea === undefined) {
    return null;
  }

  const changedPropertyPrefix = `areas[${index}]`;
  const { tyoalueet: originalTyoalueet } = originalArea ?? {};
  const { tyoalueet: changedTyoalueet } = changedArea ?? {};
  const haittaIndexesChanged = originalArea
    ? hasHaittaIndexesChanged(originalArea, changedArea)
    : false;
  const tyonTarkoituksetChanged =
    changedArea && muutokset?.includes(`${changedPropertyPrefix}.tyonTarkoitukset`);
  const tyonTarkoituksetAdded = changedArea?.tyonTarkoitukset?.filter(
    (tyonTarkoitus) => !originalArea?.tyonTarkoitukset?.includes(tyonTarkoitus),
  );
  const tyonTarkoituksetRemoved = originalArea?.tyonTarkoitukset?.filter(
    (tyonTarkoitus) => !changedArea?.tyonTarkoitukset?.includes(tyonTarkoitus),
  );

  return (
    <Accordion
      language={locale}
      heading={t('hakemus:labels:workAreasInProjectArea', {
        projectName: originalArea?.name ?? changedArea?.name ?? '',
      })}
      initiallyOpen
      key={originalArea?.hankealueId ?? changedArea?.hankealueId}
      className={styles.applicationAreaContainer}
    >
      <FormSummarySection style={{ marginBottom: 'var(--spacing-l)' }}>
        <SectionItemTitle>{t('form:yhteystiedot:labels:osoite')}</SectionItemTitle>
        <SectionItemContent>
          {originalArea?.katuosoite ?? changedArea?.katuosoite}
          {changedArea &&
            muutokset &&
            muutokset.includes(`${changedPropertyPrefix}.katuosoite`) && (
              <Box marginTop="var(--spacing-s)">
                {!changedArea.katuosoite ? (
                  <SectionItemContentRemoved>
                    <p>{originalArea?.katuosoite}</p>
                  </SectionItemContentRemoved>
                ) : (
                  <SectionItemContentAdded>
                    <p>{changedArea.katuosoite}</p>
                  </SectionItemContentAdded>
                )}
              </Box>
            )}
        </SectionItemContent>
        <SectionItemTitle>{t('hakemus:labels:tyonTarkoitus')}</SectionItemTitle>
        <SectionItemContent>
          {originalArea?.tyonTarkoitukset
            ?.map((tyyppi) => t(`hanke:tyomaaTyyppi:${tyyppi}`))
            .join(', ')}
          {tyonTarkoituksetChanged && (tyonTarkoituksetAdded?.length || 0) > 0 && (
            <SectionItemContentAdded marginTop="var(--spacing-s)">
              {tyonTarkoituksetAdded?.map((changed) => (
                <p key={changed}>{t(`hanke:tyomaaTyyppi:${changed}`)}</p>
              ))}
            </SectionItemContentAdded>
          )}
          {tyonTarkoituksetChanged && (tyonTarkoituksetRemoved?.length || 0) > 0 && (
            <SectionItemContentRemoved marginTop="var(--spacing-s)">
              {tyonTarkoituksetRemoved?.map((removed) => (
                <p key={removed}>{t(`hanke:tyomaaTyyppi:${removed}`)}</p>
              ))}
            </SectionItemContentRemoved>
          )}
        </SectionItemContent>
        {!areasHaveChanged && originalTyoalueet && (
          <>
            <SectionItemTitle>{t('form:labels:areas')}</SectionItemTitle>
            <SectionItemContent>
              <TyoalueetList tyoalueet={originalTyoalueet} />
            </SectionItemContent>
          </>
        )}
        <SectionItemTitle>{t('form:labels:kokonaisAla')}</SectionItemTitle>
        <SectionItemContent>
          <TotalSurfaceArea tyoalueet={originalTyoalueet || []} changedAreas={changedTyoalueet} />
        </SectionItemContent>
      </FormSummarySection>
      {haittaIndexesChanged && (
        <Box marginBottom="var(--spacing-l)">
          <Notification type="alert" size="small" label={t('hanke:alue:haittaIndexesChangedLabel')}>
            {t('hanke:alue:haittaIndexesChanged')}
          </Notification>
        </Box>
      )}
      <Box marginBottom="var(--spacing-l)">
        <HaittaIndexes
          heading={`${t('kaivuilmoitusForm:alueet:liikennehaittaindeksienYhteenveto')} (0-5)`}
          haittaIndexData={calculateLiikennehaittaindeksienYhteenveto(changedArea ?? originalArea)}
          initiallyOpen
          autoHaitanKestoHeading={t(
            'kaivuilmoitusForm:haittojenHallinta:carTrafficNuisanceType:haitanKesto',
          )}
          autoHaitanKestoTooltipTranslationKey="hankeIndexes:tooltips:autoTyonKesto"
        />
      </Box>
      <Box as="h2" className="heading-xxs" marginBottom="var(--spacing-m)">
        {t('kaivuilmoitusForm:alueet:areaNuisanceDefinitions')}
      </Box>
      <FormSummarySection style={{ marginBottom: 'var(--spacing-s)' }}>
        <SectionItemTitle>{t('hankeForm:labels:meluHaitta')}</SectionItemTitle>
        <SectionItemContent>
          {originalArea?.meluhaitta ? t(`hanke:meluHaitta:${originalArea.meluhaitta}`) : '-'}
          {changedArea &&
            muutokset &&
            muutokset.includes(`${changedPropertyPrefix}.meluhaitta`) && (
              <Box marginTop="var(--spacing-s)">
                <SectionItemContentAdded>
                  <p>{t(`hanke:meluHaitta:${changedArea.meluhaitta}`)}</p>
                </SectionItemContentAdded>
              </Box>
            )}
        </SectionItemContent>
        <SectionItemTitle>{t('hankeForm:labels:polyHaitta')}</SectionItemTitle>
        <SectionItemContent>
          {originalArea?.polyhaitta ? t(`hanke:polyHaitta:${originalArea.polyhaitta}`) : '-'}
          {changedArea &&
            muutokset &&
            muutokset.includes(`${changedPropertyPrefix}.polyhaitta`) && (
              <Box marginTop="var(--spacing-s)">
                <SectionItemContentAdded>
                  <p>{t(`hanke:polyHaitta:${changedArea.polyhaitta}`)}</p>
                </SectionItemContentAdded>
              </Box>
            )}
        </SectionItemContent>
        <SectionItemTitle>{t('hankeForm:labels:tarinaHaitta')}</SectionItemTitle>
        <SectionItemContent>
          {originalArea?.tarinahaitta ? t(`hanke:tarinaHaitta:${originalArea.tarinahaitta}`) : '-'}
          {changedArea &&
            muutokset &&
            muutokset.includes(`${changedPropertyPrefix}.tarinahaitta`) && (
              <Box marginTop="var(--spacing-s)">
                <SectionItemContentAdded>
                  <p>{t(`hanke:tarinaHaitta:${changedArea.tarinahaitta}`)}</p>
                </SectionItemContentAdded>
              </Box>
            )}
        </SectionItemContent>
        <SectionItemTitle>{t('hankeForm:labels:kaistaHaitta')}</SectionItemTitle>
        <SectionItemContent>
          {originalArea?.kaistahaitta ? t(`hanke:kaistaHaitta:${originalArea.kaistahaitta}`) : '-'}
          {changedArea &&
            muutokset &&
            muutokset.includes(`${changedPropertyPrefix}.kaistahaitta`) && (
              <Box marginTop="var(--spacing-s)">
                <SectionItemContentAdded>
                  <p>{t(`hanke:kaistaHaitta:${changedArea.kaistahaitta}`)}</p>
                </SectionItemContentAdded>
              </Box>
            )}
        </SectionItemContent>
        <SectionItemTitle>{t('hankeForm:labels:kaistaPituusHaitta')}</SectionItemTitle>
        <SectionItemContent>
          {originalArea?.kaistahaittojenPituus
            ? t(`hanke:kaistaPituusHaitta:${originalArea.kaistahaittojenPituus}`)
            : '-'}
          {changedArea &&
            muutokset &&
            muutokset.includes(`${changedPropertyPrefix}.kaistahaittojenPituus`) && (
              <Box marginTop="var(--spacing-s)">
                <SectionItemContentAdded>
                  <p>{t(`hanke:kaistaPituusHaitta:${changedArea.kaistahaittojenPituus}`)}</p>
                </SectionItemContentAdded>
              </Box>
            )}
        </SectionItemContent>
        <SectionItemTitle>{t('hakemus:labels:areaAdditionalInfo')}</SectionItemTitle>
        <SectionItemContent>
          {originalArea?.lisatiedot ?? '-'}
          {changedArea &&
            muutokset &&
            muutokset.includes(`${changedPropertyPrefix}.lisatiedot`) && (
              <Box marginTop="var(--spacing-s)">
                {!changedArea.lisatiedot ? (
                  <SectionItemContentRemoved>
                    <p>{originalArea?.lisatiedot}</p>
                  </SectionItemContentRemoved>
                ) : (
                  <SectionItemContentAdded>
                    <p>{changedArea.lisatiedot}</p>
                  </SectionItemContentAdded>
                )}
              </Box>
            )}
        </SectionItemContent>
      </FormSummarySection>
    </Accordion>
  );
}

function areasInclude(areas: KaivuilmoitusAlue[] | null, area: KaivuilmoitusAlue) {
  return areas?.some((a) => a.hankealueId === area.hankealueId);
}

function KaivuilmoitusAreasInfo({
  originalAreas,
  changedAreas,
  muutokset,
}: Readonly<{
  originalAreas: KaivuilmoitusAlue[] | null;
  changedAreas?: KaivuilmoitusAlue[];
  muutokset?: string[];
}>) {
  if (originalAreas === null && changedAreas === undefined) {
    return null;
  }

  const areasHaveChanged =
    changedAreas &&
    muutokset &&
    changedAreas.filter((_area, index) => muutokset.includes(`areas[${index}]`)).length > 0;
  const addedAreas = areasHaveChanged
    ? changedAreas.filter((area) => !areasInclude(originalAreas, area))
    : [];
  const removedAreas = areasHaveChanged
    ? originalAreas?.filter((area) => !areasInclude(changedAreas, area)) ?? []
    : [];

  return (
    <>
      {originalAreas?.map((area, index) => {
        if (areasInclude(removedAreas, area)) {
          return null;
        }
        const changedAlue = changedAreas?.find((a) => a.hankealueId === area.hankealueId);
        return (
          <KaivuilmoitusAreaInfo
            key={area.hankealueId}
            originalArea={area}
            areasHaveChanged={areasHaveChanged}
            changedArea={changedAlue}
            muutokset={muutokset}
            index={index}
          />
        );
      })}
      {addedAreas.length > 0 && (
        <SectionItemContentAdded>
          {addedAreas.map((area, index) => {
            return (
              <KaivuilmoitusAreaInfo
                key={area.hankealueId}
                originalArea={area}
                areasHaveChanged={false}
                index={index}
              />
            );
          })}
        </SectionItemContentAdded>
      )}
      {removedAreas.length > 0 && (
        <SectionItemContentRemoved marginTop="var(--spacing-s)">
          {removedAreas.map((area, index) => {
            return (
              <KaivuilmoitusAreaInfo
                key={area.hankealueId}
                originalArea={area}
                areasHaveChanged={false}
                index={index}
              />
            );
          })}
        </SectionItemContentRemoved>
      )}
    </>
  );
}

function KaivuilmoitusAreasNuisanceInfo({
  hankeAreas,
  originalAreas,
  changedAreas,
  muutokset,
}: Readonly<{
  hankeAreas?: HankeAlue[];
  originalAreas: KaivuilmoitusAlue[] | null;
  changedAreas?: KaivuilmoitusAlue[];
  muutokset?: string[];
}>) {
  const { t } = useTranslation();
  const locale = useLocale();

  if (originalAreas === null && changedAreas === undefined) {
    return null;
  }

  const areasHaveChanged =
    changedAreas &&
    muutokset &&
    changedAreas.filter((_area, index) => muutokset.includes(`areas[${index}]`)).length > 0;
  const addedAreas = areasHaveChanged
    ? changedAreas.filter((area) => !areasInclude(originalAreas, area))
    : [];
  const removedAreas = areasHaveChanged
    ? originalAreas?.filter((area) => !areasInclude(changedAreas, area)) ?? []
    : [];

  return (
    <>
      {originalAreas?.map((area, index) => {
        if (areasInclude(removedAreas, area)) {
          return null;
        }
        const hankeArea = hankeAreas?.find((ha) => ha.id === area.hankealueId);
        const changedArea = changedAreas?.find((a) => a.hankealueId === area.hankealueId);
        return (
          <Accordion
            language={locale}
            heading={t('hakemus:labels:workAreaPlural') + ' (' + area.name + ')'}
            initiallyOpen={index === 0}
            theme={{
              '--header-focus-outline-color': 'var(--color-white)',
            }}
            key={area.hankealueId}
          >
            <HaittojenhallintasuunnitelmaInfo
              key={area.hankealueId}
              alue={area}
              taydennysAlue={changedArea}
              hankealue={hankeArea}
            />
          </Accordion>
        );
      })}
      {addedAreas.length > 0 && (
        <SectionItemContentAdded>
          {addedAreas.map((area, index) => {
            const hankeArea = hankeAreas?.find((ha) => ha.id === area.hankealueId);
            return (
              <Accordion
                language={locale}
                heading={t('hakemus:labels:workAreaPlural') + ' (' + area.name + ')'}
                initiallyOpen={index === 0}
                theme={{
                  '--header-focus-outline-color': 'var(--color-white)',
                }}
                key={area.hankealueId}
              >
                <HaittojenhallintasuunnitelmaInfo
                  key={area.hankealueId}
                  alue={area}
                  hankealue={hankeArea}
                />
              </Accordion>
            );
          })}
        </SectionItemContentAdded>
      )}
      {removedAreas.length > 0 && (
        <SectionItemContentRemoved marginTop="var(--spacing-s)">
          {removedAreas.map((area, index) => {
            const hankeArea = hankeAreas?.find((ha) => ha.id === area.hankealueId);
            return (
              <Accordion
                language={locale}
                heading={t('hakemus:labels:workAreaPlural') + ' (' + area.name + ')'}
                initiallyOpen={index === 0}
                theme={{
                  '--header-focus-outline-color': 'var(--color-white)',
                }}
                key={area.hankealueId}
              >
                <HaittojenhallintasuunnitelmaInfo
                  key={area.hankealueId}
                  alue={area}
                  hankealue={hankeArea}
                />
              </Accordion>
            );
          })}
        </SectionItemContentRemoved>
      )}
    </>
  );
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
  const reports = [
    ...(valmistumisilmoitukset.TYO_VALMIS || []),
    ...(valmistumisilmoitukset.TOIMINNALLINEN_KUNTO || []),
  ];
  if (reports.length === 0) {
    return null;
  }
  const lastReport = reports.toSorted(
    (a, b) => new Date(b.reportedAt).getTime() - new Date(a.reportedAt).getTime(),
  )[0];
  return {
    type: lastReport.type,
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
  onEditTaydennys: () => void;
  creatingTaydennys?: boolean;
  onEditMuutosilmoitus: () => void;
  creatingMuutosilmoitus?: boolean;
};

function ApplicationView({
  application,
  hanke,
  signedInUser,
  onEditApplication,
  onEditTaydennys,
  creatingTaydennys,
  onEditMuutosilmoitus,
  creatingMuutosilmoitus,
}: Readonly<Props>) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [showSendDialog, setShowSendDialog] = useState(false);
  const [showReportOperationalConditionDialog, setShowReportOperationalConditionDialog] =
    useState(false);
  const [showReportWorkFinishedDialog, setShowReportWorkFinishedDialog] = useState(false);
  const {
    applicationData,
    applicationIdentifier,
    applicationType,
    alluStatus,
    id,
    paatokset,
    valmistumisilmoitukset,
    taydennyspyynto,
    taydennys,
    muutosilmoitus,
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

  const muutokset = taydennys?.muutokset ?? muutosilmoitus?.muutokset;
  const changedData = taydennys?.applicationData ?? muutosilmoitus?.applicationData;

  const tyoalueet =
    applicationType === 'CABLE_REPORT'
      ? (areas as ApplicationArea[])
      : (areas as KaivuilmoitusAlue[]).flatMap((area) => area.tyoalueet);
  const kaivuilmoitusTaydennysAlueet =
    applicationType === 'EXCAVATION_NOTIFICATION'
      ? (changedData?.areas as KaivuilmoitusAlue[] | undefined)
      : null;
  const taydennysTyoalueet =
    applicationType === 'CABLE_REPORT'
      ? (changedData?.areas as ApplicationArea[] | undefined)
      : kaivuilmoitusTaydennysAlueet?.flatMap((area) => area.tyoalueet);
  const kaivuilmoitusAlueet =
    applicationType === 'EXCAVATION_NOTIFICATION' ? (areas as KaivuilmoitusAlue[]) : null;
  const hankealueet = hanke?.alueet;
  const currentDecisions = getCurrentDecisions(paatokset);
  const applicationId =
    applicationIdentifier || t(`hakemus:applicationTypeDraft:${applicationType}`);

  const { data: attachments } = useAttachments(id);

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
  const informationRequestFeatureEnabled = useIsInformationRequestFeatureEnabled();

  const { sendTaydennysButton, sendTaydennysDialog } = useSendTaydennys(application, signedInUser);
  const { sendMuutosilmoitusButton, sendMuutosilmoitusDialog } = useSendMuutosilmoitus(
    application,
    signedInUser,
  );

  const showMuutosilmoitusButton =
    applicationType === 'EXCAVATION_NOTIFICATION' &&
    (alluStatus === AlluStatus.DECISION || alluStatus === AlluStatus.OPERATIONAL_CONDITION) &&
    !muutosilmoitus?.sent;

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
    queryClient.invalidateQueries(['application', id], { refetchInactive: true }).then(() => {});
    setShowReportOperationalConditionDialog(false);
  }

  function openReportWorkFinishedDialog() {
    setShowReportWorkFinishedDialog(true);
  }

  function closeReportWorkFinishedDialog() {
    queryClient.invalidateQueries(['application', id], { refetchInactive: true }).then(() => {});
    setShowReportWorkFinishedDialog(false);
  }

  return (
    <InformationViewContainer>
      <InformationViewHeader backgroundColor="var(--color-suomenlinna-light)">
        <MainHeading>{name}</MainHeading>
        <Text tag="h2" styleAs="h3" weight="bold" spacingBottom="l" data-testid="allu_tunnus">
          {applicationId}
        </Text>

        <Box mb="var(--spacing-l)">
          {informationRequestFeatureEnabled &&
            alluStatus === AlluStatus.WAITING_INFORMATION &&
            taydennyspyynto && (
              <TaydennyspyyntoNotification
                taydennyspyynto={taydennyspyynto}
                applicationType={applicationType}
              />
            )}
          {muutosilmoitus && <MuutosilmoitusNotification sent={muutosilmoitus.sent} />}
          <Box mt="var(--spacing-s)">
            <FormPagesErrorSummary
              data={taydennys ?? muutosilmoitus ?? application}
              schema={validationSchema}
              validationContext={{ application: taydennys ?? muutosilmoitus ?? application }}
              notificationLabel={t('hakemus:missingFields:notification:hakemusLabel')}
            />
          </Box>
        </Box>

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
                        i18nKey={`hakemus:labels:completionDate:${lastValmistumisilmoitus.type}`}
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
          {showMuutosilmoitusButton && (
            <CheckRightsByHanke requiredRight="EDIT_APPLICATIONS" hankeTunnus={hanke?.hankeTunnus}>
              <>
                <Button
                  theme="coat"
                  iconLeft={<IconPen />}
                  onClick={onEditMuutosilmoitus}
                  isLoading={creatingMuutosilmoitus}
                >
                  {!muutosilmoitus
                    ? t('muutosilmoitus:buttons:createMuutosilmoitus')
                    : t('muutosilmoitus:buttons:editMuutosilmoitus')}
                </Button>
                <MuutosilmoitusCancel application={application} />
              </>
            </CheckRightsByHanke>
          )}
          <CheckRightsByHanke requiredRight="EDIT_APPLICATIONS" hankeTunnus={hanke?.hankeTunnus}>
            {sendMuutosilmoitusButton}
          </CheckRightsByHanke>
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
          {informationRequestFeatureEnabled && alluStatus === AlluStatus.WAITING_INFORMATION && (
            <CheckRightsByHanke requiredRight="EDIT_APPLICATIONS" hankeTunnus={hanke?.hankeTunnus}>
              <>
                <Button
                  theme="coat"
                  iconLeft={<IconPen aria-hidden="true" />}
                  onClick={onEditTaydennys}
                  isLoading={creatingTaydennys}
                >
                  {!taydennys
                    ? t('taydennys:buttons:createTaydennys')
                    : t('taydennys:buttons:editTaydennys')}
                </Button>
                <TaydennysCancel application={application} />
              </>
            </CheckRightsByHanke>
          )}
          <CheckRightsByHanke requiredRight="EDIT_APPLICATIONS" hankeTunnus={hanke?.hankeTunnus}>
            {sendTaydennysButton}
          </CheckRightsByHanke>
        </InformationViewHeaderButtons>
      </InformationViewHeader>

      <InformationViewContentContainer>
        <InformationViewMainContent>
          <Tabs>
            <TabList style={{ marginBottom: 'var(--spacing-m)' }}>
              <Tab>{t('hankePortfolio:tabit:perustiedot')}</Tab>
              <Tab>{t('hankePortfolio:tabit:alueet')}</Tab>
              {applicationType === 'EXCAVATION_NOTIFICATION' && (
                <Tab>{t('hankePortfolio:tabit:haittojenHallinta')}</Tab>
              )}
              <Tab>{t('hankePortfolio:tabit:yhteystiedot')}</Tab>
              <Tab>{t('hankePortfolio:tabit:liitteet')}</Tab>
            </TabList>
            <TabPanel>
              {/* Basic information panel */}
              {applicationType === 'CABLE_REPORT' && (
                <JohtoselvitysBasicInformationSummary
                  formData={application as Application<JohtoselvitysData>}
                  changedData={changedData as JohtoselvitysData}
                  muutokset={muutokset}
                >
                  <SectionItemTitle>{t('hakemus:labels:totalSurfaceArea')}</SectionItemTitle>
                  <SectionItemContent>
                    <TotalSurfaceArea tyoalueet={tyoalueet} changedAreas={taydennysTyoalueet} />
                  </SectionItemContent>
                </JohtoselvitysBasicInformationSummary>
              )}
              {applicationType === 'EXCAVATION_NOTIFICATION' && (
                <KaivuilmoitusBasicInformationSummary
                  formData={application as Application<KaivuilmoitusData>}
                  changedData={changedData as KaivuilmoitusData}
                  muutokset={muutokset}
                >
                  <SectionItemTitle>{t('hakemus:labels:totalSurfaceArea')}</SectionItemTitle>
                  <SectionItemContent>
                    <TotalSurfaceArea tyoalueet={tyoalueet} changedAreas={taydennysTyoalueet} />
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
                  {muutokset?.includes('startTime') && (
                    <Box marginTop="var(--spacing-s)">
                      {!changedData?.startTime ? (
                        <SectionItemContentRemoved>
                          {startTime && <p>{formatToFinnishDate(startTime)}</p>}
                        </SectionItemContentRemoved>
                      ) : (
                        <SectionItemContentAdded>
                          <p>{formatToFinnishDate(changedData.startTime)}</p>
                        </SectionItemContentAdded>
                      )}
                    </Box>
                  )}
                </SectionItemContent>
                <SectionItemTitle>{t('kaivuilmoitusForm:alueet:endDate')}</SectionItemTitle>
                <SectionItemContent>
                  {endTime && <p>{formatToFinnishDate(endTime)}</p>}
                  {muutokset?.includes('endTime') && (
                    <Box marginTop="var(--spacing-s)">
                      {!changedData?.endTime ? (
                        <SectionItemContentRemoved>
                          {endTime && <p>{formatToFinnishDate(endTime)}</p>}
                        </SectionItemContentRemoved>
                      ) : (
                        <SectionItemContentAdded>
                          <p>{formatToFinnishDate(changedData.endTime)}</p>
                        </SectionItemContentAdded>
                      )}
                    </Box>
                  )}
                </SectionItemContent>
              </FormSummarySection>
              {applicationType === 'CABLE_REPORT' && (
                <JohtoselvitysAreasInfo
                  tyoalueet={tyoalueet}
                  changedAreas={taydennysTyoalueet}
                  muutokset={muutokset}
                />
              )}
              {applicationType === 'EXCAVATION_NOTIFICATION' && (
                <KaivuilmoitusAreasInfo
                  originalAreas={kaivuilmoitusAlueet}
                  changedAreas={changedData?.areas as KaivuilmoitusAlue[]}
                  muutokset={muutokset}
                />
              )}
            </TabPanel>
            <TabPanel>
              {/* Nuisance management panel */}
              {applicationType === 'EXCAVATION_NOTIFICATION' && (
                <KaivuilmoitusAreasNuisanceInfo
                  hankeAreas={hankealueet}
                  originalAreas={kaivuilmoitusAlueet}
                  changedAreas={changedData?.areas as KaivuilmoitusAlue[]}
                  muutokset={muutokset}
                />
              )}
            </TabPanel>
            <TabPanel>
              {/* Contacts information panel */}
              <FormSummarySection>
                <ContactsSummary
                  customerWithContacts={customerWithContacts}
                  title={t('form:yhteystiedot:titles:customerWithContacts')}
                />
                {muutokset?.includes('customerWithContacts') &&
                  changedData?.customerWithContacts && (
                    <ContactsSummary
                      customerWithContacts={changedData?.customerWithContacts}
                      ContentContainer={SectionItemContentAdded}
                    />
                  )}
                <ContactsSummary
                  customerWithContacts={contractorWithContacts}
                  title={t('form:yhteystiedot:titles:contractorWithContacts')}
                />
                {muutokset?.includes('contractorWithContacts') &&
                  changedData?.contractorWithContacts && (
                    <ContactsSummary
                      customerWithContacts={changedData?.contractorWithContacts}
                      ContentContainer={SectionItemContentAdded}
                    />
                  )}
                <ContactsSummary
                  customerWithContacts={propertyDeveloperWithContacts}
                  title={t('form:yhteystiedot:titles:rakennuttajat')}
                />
                {muutokset?.includes('propertyDeveloperWithContacts') && (
                  <ContactsSummary
                    customerWithContacts={
                      changedData?.propertyDeveloperWithContacts ?? propertyDeveloperWithContacts
                    }
                    title={
                      !propertyDeveloperWithContacts
                        ? t('form:yhteystiedot:titles:rakennuttajat')
                        : undefined
                    }
                    ContentContainer={
                      changedData?.propertyDeveloperWithContacts
                        ? SectionItemContentAdded
                        : SectionItemContentRemoved
                    }
                  />
                )}
                <ContactsSummary
                  customerWithContacts={representativeWithContacts}
                  title={t('form:yhteystiedot:titles:representativeWithContacts')}
                />
                {muutokset?.includes('representativeWithContacts') && (
                  <ContactsSummary
                    customerWithContacts={
                      changedData?.representativeWithContacts ?? representativeWithContacts
                    }
                    title={
                      !representativeWithContacts
                        ? t('form:yhteystiedot:titles:representativeWithContacts')
                        : undefined
                    }
                    ContentContainer={
                      changedData?.representativeWithContacts
                        ? SectionItemContentAdded
                        : SectionItemContentRemoved
                    }
                  />
                )}
                {applicationType === 'EXCAVATION_NOTIFICATION' && (
                  <>
                    <InvoicingCustomerSummary
                      invoicingCustomer={(applicationData as KaivuilmoitusData).invoicingCustomer}
                      title={t('form:yhteystiedot:titles:invoicingCustomerInfo')}
                    />
                    {muutokset?.includes('invoicingCustomer') &&
                      (changedData as KaivuilmoitusData).invoicingCustomer && (
                        <InvoicingCustomerSummary
                          invoicingCustomer={
                            (changedData as KaivuilmoitusData).invoicingCustomer ??
                            (applicationData as KaivuilmoitusData).invoicingCustomer
                          }
                          title={
                            !(applicationData as KaivuilmoitusData).invoicingCustomer
                              ? t('form:yhteystiedot:titles:invoicingCustomerInfo')
                              : undefined
                          }
                          ContentContainer={SectionItemContentAdded}
                        />
                      )}
                  </>
                )}
                {paperDecisionReceiver && (
                  <PaperDecisionReceiverSummary paperDecisionReceiver={paperDecisionReceiver} />
                )}
              </FormSummarySection>
            </TabPanel>
            <TabPanel>
              {/* Attachments panel */}
              {applicationType === 'EXCAVATION_NOTIFICATION' ? (
                <KaivuilmoitusAttachmentSummary
                  formData={application as Application<KaivuilmoitusData>}
                  attachments={attachments}
                  taydennysAttachments={taydennys?.liitteet}
                  taydennysAdditionalInfo={
                    (taydennys?.applicationData as KaivuilmoitusData)?.additionalInfo
                  }
                />
              ) : attachments ? (
                <AttachmentSummary
                  attachments={attachments}
                  children={
                    taydennys?.liitteet &&
                    taydennys.liitteet.length > 0 && (
                      <SectionItemContentAdded mt="var(--spacing-xs)">
                        <TaydennysAttachmentsList attachments={taydennys.liitteet} />
                      </SectionItemContentAdded>
                    )
                  }
                />
              ) : null}
            </TabPanel>
          </Tabs>
        </InformationViewMainContent>
        <InformationViewSidebar testId="application-view-sidebar">
          {hanke && <Sidebar hanke={hanke} application={application} />}
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
        application={application}
        isOpen={showSendDialog}
        onClose={closeSendDialog}
      />
      {sendTaydennysDialog}
      {sendMuutosilmoitusDialog}
    </InformationViewContainer>
  );
}

export default ApplicationView;
