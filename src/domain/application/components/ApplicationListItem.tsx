import { Card, IconEye, IconPen } from 'hds-react';
import { Box, Flex, Grid } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { AlluStatus, HankkeenHakemus } from '../types/application';
import styles from './ApplicationListItem.module.scss';
import Text from '../../../common/components/text/Text';
import ApplicationStatusTag from './ApplicationStatusTag';
import useLinkPath from '../../../common/hooks/useLinkPath';
import { ROUTES } from '../../../common/types/route';
import ApplicationDates from './ApplicationDates';
import JohtoselvitysDecisionLink from '../../johtoselvitys/components/DecisionLink';
import KaivuilmoitusDecisionLink from '../../kaivuilmoitus/components/DecisionLink';
import { getCurrentDecisions, getDecisionFilename, isApplicationSent } from '../utils';
import { CheckRightsByHanke } from '../../hanke/hankeUsers/UserRightsCheck';
import React from 'react';

type Props = { hankeTunnus: string; application: HankkeenHakemus };

function ApplicationListItem({ hankeTunnus, application }: Readonly<Props>) {
  const { t } = useTranslation();
  const getApplicationPathView = useLinkPath(ROUTES.HAKEMUS);

  const {
    applicationData,
    alluStatus,
    applicationIdentifier,
    id,
    applicationType,
    paatokset,
    muutosilmoitus,
  } = application;

  const editRoute =
    applicationType === 'CABLE_REPORT'
      ? ROUTES.EDIT_JOHTOSELVITYSHAKEMUS
      : ROUTES.EDIT_KAIVUILMOITUSHAKEMUS;
  const editMuutosilmoitusRoute =
    applicationType === 'CABLE_REPORT'
      ? ROUTES.HAKEMUS /* TODO change when cable report muutosilmoitus is supported */
      : ROUTES.EDIT_KAIVUILMOITUSMUUTOSILMOITUS;
  const getApplicationPathEdit = useLinkPath(editRoute);
  const getMuutosilmoitusPathEdit = useLinkPath(editMuutosilmoitusRoute);
  const isSent = isApplicationSent(alluStatus);
  const { name, startTime, endTime } = applicationData;
  const muutosilmoitusStatus: AlluStatus | null = muutosilmoitus?.sent ? AlluStatus.PENDING : null;
  const isMuutosilmoitusSent = isApplicationSent(muutosilmoitusStatus);
  const {
    name: muutosilmoitusName,
    startTime: muutosilmoitusStartTime,
    endTime: muutosilmoitusEndTime,
  } = muutosilmoitus?.applicationData || {};
  const applicationId =
    applicationIdentifier || t(`hakemus:applicationTypeDraft:${applicationType}`);
  const applicationViewPath = getApplicationPathView({ id: (id as number).toString() });
  const applicationEditPath = getApplicationPathEdit({ id: (id as number).toString() });
  const muutosilmoitusEditPath =
    muutosilmoitus && getMuutosilmoitusPathEdit({ id: (id as number).toString() });

  const currentDecisions = getCurrentDecisions(paatokset, true);

  return (
    <Card
      theme={{
        '--padding-horizontal': 'var(--spacing-s)',
        '--padding-vertical': 'var(--spacing-m)',
      }}
      border
      className={styles.applicationCard}
      data-testid="application-card"
    >
      <Flex>
        <div className={styles.applicationInfoRow}>
          <Flex flexWrap="wrap">
            <Box mr="var(--spacing-s)">
              <Link
                to={applicationViewPath}
                aria-label={
                  t(`routes:${ROUTES.HAKEMUS}.meta.title`) + ` ${name}` + ` ${applicationId}`
                }
                data-testid={`applicationViewLinkIdentifier-${applicationIdentifier ?? id}`}
                className={styles.applicationLink}
              >
                {applicationId}
              </Link>
            </Box>
            <Text tag="p">{name}</Text>
          </Flex>
          <Box>
            <ApplicationDates startTime={startTime} endTime={endTime} />
          </Box>
          <Grid alignItems="start" templateColumns="auto 1fr">
            <ApplicationStatusTag status={alluStatus} />
          </Grid>
        </div>
        <Box paddingRight="var(--spacing-xs)">
          {!isSent && (
            <CheckRightsByHanke requiredRight="EDIT_APPLICATIONS" hankeTunnus={hankeTunnus}>
              <Link
                to={applicationEditPath}
                aria-label={t(`routes:${editRoute}.meta.title`) + ` ${name}`}
                data-testid={`applicationEditLink-${id}`}
              >
                <IconPen aria-hidden="true" />
              </Link>
            </CheckRightsByHanke>
          )}
        </Box>
        <Box paddingRight="14px">
          <Link
            to={applicationViewPath}
            aria-label={t(`routes:${ROUTES.HAKEMUS}.meta.title`) + ` ${name}`}
            data-testid={`applicationViewLink-${id}`}
          >
            <IconEye aria-hidden="true" />
          </Link>
        </Box>
      </Flex>
      <Box as="p" color="var(--color-black-70)">
        {t(`hakemus:applicationTypes:${applicationType}`)}
      </Box>
      {applicationType === 'CABLE_REPORT' && alluStatus === AlluStatus.DECISION && (
        <Box paddingTop="var(--spacing-s)">
          <JohtoselvitysDecisionLink
            applicationId={id}
            linkText={t('hanke:hakemuslista:labels:downloadDecision:PAATOS')}
            filename={applicationIdentifier}
          />
        </Box>
      )}
      {applicationType === 'EXCAVATION_NOTIFICATION' && currentDecisions.length > 0 && (
        <Flex paddingTop="var(--spacing-xs)" columnGap="var(--spacing-xs)">
          {currentDecisions.map((paatos) => (
            <Box key={paatos.tyyppi}>
              <KaivuilmoitusDecisionLink
                id={paatos.id}
                linkText={t(`hanke:hakemuslista:labels:downloadDecision:${paatos.tyyppi}`)}
                filename={getDecisionFilename(paatos)}
              />
            </Box>
          ))}
        </Flex>
      )}
      {muutosilmoitus && (
        <Card
          theme={{
            '--padding-horizontal': 'var(--spacing-xs)',
            '--padding-vertical': 'var(--spacing-s)',
          }}
          border
          className={styles.muutosilmoitusCard}
          data-testid="muutosilmoitus-card"
        >
          <Flex>
            <div className={styles.applicationInfoRow}>
              <Flex flexWrap="wrap">
                <Box mr="var(--spacing-s)">
                  <Link
                    to={applicationViewPath || ''}
                    aria-label={
                      t(`routes:${ROUTES.HAKEMUS}.meta.title`) +
                      ` ${muutosilmoitusName}` +
                      ` ${applicationId}`
                    }
                    data-testid={`muutosilmoitusViewLinkIdentifier-${id}`}
                    className={styles.applicationLink}
                  >
                    {t(`muutosilmoitus:labels:muutosilmoitus`)}
                  </Link>
                </Box>
                <Text tag="p">{muutosilmoitusName}</Text>
              </Flex>
              <Box paddingLeft="var(--spacing-3-xs)">
                <ApplicationDates
                  startTime={muutosilmoitusStartTime || null}
                  endTime={muutosilmoitusEndTime || null}
                />
              </Box>
              <Grid alignItems="start" templateColumns="auto 1fr">
                <ApplicationStatusTag status={muutosilmoitusStatus} />
              </Grid>
            </div>
            <Box paddingRight="var(--spacing-xs)">
              {!isMuutosilmoitusSent && (
                <CheckRightsByHanke requiredRight="EDIT_APPLICATIONS" hankeTunnus={hankeTunnus}>
                  <Link
                    to={muutosilmoitusEditPath ?? ''}
                    aria-label={t(`routes:${editRoute}.meta.title`) + ` ${name}`}
                    data-testid={`muutosilmoitusEditLink-${id}`}
                  >
                    <IconPen aria-hidden="true" />
                  </Link>
                </CheckRightsByHanke>
              )}
            </Box>
            <Link
              to={applicationViewPath}
              aria-label={t(`routes:${ROUTES.HAKEMUS}.meta.title`) + ` ${muutosilmoitusName}`}
              data-testid={`muutosilmoitusViewLink-${id}`}
            >
              <IconEye aria-hidden="true" />
            </Link>
          </Flex>
          <Box as="p" color="var(--color-black-70)">
            {t(`hakemus:applicationTypes:${applicationType}`)}
          </Box>
        </Card>
      )}
    </Card>
  );
}

export default ApplicationListItem;
