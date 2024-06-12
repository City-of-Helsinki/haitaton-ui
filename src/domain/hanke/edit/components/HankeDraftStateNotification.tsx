import React from 'react';
import { Notification } from 'hds-react';
import { useTranslation } from 'react-i18next';
import { Box } from '@chakra-ui/react';
import { uniq } from 'lodash';
import { $enum } from 'ts-enum-util';
import { HankeData } from '../../../types/hanke';
import { useValidationErrors } from '../../../forms/hooks/useValidationErrors';
import { Message, hankePublicSchema } from '../hankePublicSchema';
import { HANKE_PAGES } from '../types';

const pageOrder = $enum(HANKE_PAGES).getValues();

function sortPages(a: string, b: string) {
  return pageOrder.indexOf(a as HANKE_PAGES) - pageOrder.indexOf(b as HANKE_PAGES);
}

type Props = {
  /** Hanke data */
  hanke: HankeData;
  /** Additional class names to apply to the notification */
  className?: string;
};

/**
 * Show hanke draft state notification if there are required fields missing
 */
const HankeDraftStateNotification: React.FC<Readonly<Props>> = ({ hanke, className }) => {
  const { t } = useTranslation();
  const hankePublicErrors = useValidationErrors(hankePublicSchema, hanke);
  const errorPages = uniq(
    hankePublicErrors.map((error) => (error.message as unknown as Message).values.page),
  ).toSorted(sortPages);

  if (errorPages.length > 0) {
    return (
      <Notification
        label={t('hankePortfolio:draftState:labels:insufficientPhases')}
        className={className}
        type="alert"
        dataTestId="hankeDraftStateNotification"
      >
        <Box as="ul" marginLeft="var(--spacing-m)">
          {errorPages.map((page) => {
            return (
              <li key={page} aria-label={t(`hankePortfolio:tabit:${page}`)}>
                {t(`hankePortfolio:tabit:${page}`)}
              </li>
            );
          })}
        </Box>
      </Notification>
    );
  }

  return null;
};

export default HankeDraftStateNotification;
