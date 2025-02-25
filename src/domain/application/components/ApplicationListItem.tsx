import { Card, IconEye } from 'hds-react';
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
import { getCurrentDecisions, getDecisionFilename } from '../utils';

type Props = { application: HankkeenHakemus };

function ApplicationListItem({ application }: Readonly<Props>) {
  const { t } = useTranslation();
  const getApplicationPathView = useLinkPath(ROUTES.HAKEMUS);

  const { applicationData, alluStatus, applicationIdentifier, id, applicationType, paatokset } =
    application;
  const { name, startTime, endTime } = applicationData;

  const applicationId =
    applicationIdentifier || t(`hakemus:applicationTypeDraft:${applicationType}`);

  const applicationViewPath = getApplicationPathView({ id: (id as number).toString() });

  const currentDecisions = getCurrentDecisions(paatokset);

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
          <ApplicationDates startTime={startTime} endTime={endTime} />
          <Grid alignItems="start" templateColumns="auto 1fr" columnGap="var(--spacing-xs)">
            <ApplicationStatusTag status={alluStatus} />
            {applicationType === 'CABLE_REPORT' && alluStatus === AlluStatus.DECISION && (
              <JohtoselvitysDecisionLink
                applicationId={id}
                linkText={t('hakemus:labels:downloadDecision:PAATOS')}
                filename={applicationIdentifier}
              />
            )}
            {applicationType === 'EXCAVATION_NOTIFICATION' &&
              currentDecisions.map((paatos) => (
                <Box as="span" key={paatos.tyyppi}>
                  <KaivuilmoitusDecisionLink
                    id={paatos.id}
                    linkText={t(`hakemus:labels:downloadDecision:${paatos.tyyppi}`)}
                    filename={getDecisionFilename(paatos)}
                  />
                </Box>
              ))}
          </Grid>
        </div>
        <Link
          to={applicationViewPath}
          aria-label={t(`routes:${ROUTES.HAKEMUS}.meta.title`) + ` ${name}`}
          data-testid={`applicationViewLink-${id}`}
        >
          <IconEye aria-hidden="true" />
        </Link>
      </Flex>
      <Box as="p" color="var(--color-black-70)">
        {t(`hakemus:applicationTypes:${applicationType}`)}
      </Box>
    </Card>
  );
}

export default ApplicationListItem;
