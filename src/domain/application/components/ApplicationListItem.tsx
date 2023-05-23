import React from 'react';
import { Card, IconEye } from 'hds-react';
import { Box, Flex, Grid } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { AlluStatus, Application } from '../types/application';
import styles from './ApplicationListItem.module.scss';
import Text from '../../../common/components/text/Text';
import ApplicationStatusTag from './ApplicationStatusTag';
import useLinkPath from '../../../common/hooks/useLinkPath';
import { ROUTES } from '../../../common/types/route';
import ApplicationDates from './ApplicationDates';
import DecisionLink from './DecisionLink';

type Props = { application: Application };

function ApplicationListItem({ application }: Props) {
  const { t } = useTranslation();
  const getApplicationPathView = useLinkPath(ROUTES.HAKEMUS);

  const { applicationData, alluStatus, applicationIdentifier, id } = application;
  const { name, applicationType, startTime, endTime } = applicationData;

  const applicationId =
    applicationIdentifier || t(`hakemus:applicationTypeDraft:${applicationType}`);

  const applicationViewPath = getApplicationPathView({ id: (id as number).toString() });

  return (
    <Card border className={styles.applicationCard} data-testid="application-card">
      <Flex>
        <div className={styles.applicationInfoRow}>
          <Flex mr="var(--spacing-s)" flexWrap="wrap">
            <Box mr="var(--spacing-s)">
              <Link
                to={applicationViewPath}
                aria-label={
                  // eslint-disable-next-line
                  t(`routes:${ROUTES.HAKEMUS}.meta.title`) + ` ${name}` + ` ${applicationId}`
                }
                data-testid={`applicationViewLinkIdentifier-${id}`}
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
            {alluStatus === AlluStatus.DECISION && (
              <DecisionLink
                applicationId={id}
                linkText={t('hakemus:labels:downloadDecision')}
                filename={applicationIdentifier}
              />
            )}
          </Grid>
        </div>
        <Box flex="0 0 60px">
          <Link
            to={applicationViewPath}
            aria-label={
              // eslint-disable-next-line
              t(`routes:${ROUTES.HAKEMUS}.meta.title`) + ` ${name}`
            }
            data-testid={`applicationViewLink-${id}`}
          >
            <IconEye aria-hidden="true" />
          </Link>
        </Box>
      </Flex>
      <p>{t(`hakemus:applicationTypes:${applicationType}`)}</p>
    </Card>
  );
}

export default ApplicationListItem;
