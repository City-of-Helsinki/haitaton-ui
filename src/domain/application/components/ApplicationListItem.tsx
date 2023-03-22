import React from 'react';
import { Card, IconEye } from 'hds-react';
import { Box, Flex } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { Application } from '../types/application';
import { formatToFinnishDate } from '../../../common/utils/date';
import styles from './ApplicationListItem.module.scss';
import Text from '../../../common/components/text/Text';
import ApplicationStatusTag from './ApplicationStatusTag';

function ApplicationDates({
  startTime,
  endTime,
}: {
  startTime: string | null;
  endTime: string | null;
}) {
  if (startTime === null || endTime === null) {
    return <div />;
  }

  return (
    <p>
      {formatToFinnishDate(startTime)}–{formatToFinnishDate(endTime)}
    </p>
  );
}

type Props = { application: Application };

function ApplicationListItem({ application }: Props) {
  const { t } = useTranslation();
  const { applicationData, alluStatus, applicationIdentifier } = application;
  const { name, applicationType, startTime, endTime } = applicationData;

  const applicationId =
    applicationIdentifier || t(`hakemus:applicationTypeDraft:${applicationType}`);

  return (
    <Card border className={styles.applicationCard} data-testid="application-card">
      <Flex>
        <div className={styles.applicationInfoRow}>
          <Flex mr="var(--spacing-s)" flexWrap="wrap">
            <Box mr="var(--spacing-s)">
              <Text tag="p" weight="bold">
                {applicationId}
              </Text>
            </Box>
            <Text tag="p">{name}</Text>
          </Flex>
          <ApplicationDates startTime={startTime} endTime={endTime} />
          <div>
            <ApplicationStatusTag status={alluStatus} />
          </div>
        </div>
        <Box flex="0 0 60px">
          <IconEye />
        </Box>
      </Flex>
      <p>{t(`hakemus:applicationTypes:${applicationType}`)}</p>
    </Card>
  );
}

export default ApplicationListItem;
