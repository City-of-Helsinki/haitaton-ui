import { useTranslation } from 'react-i18next';
import { Notification } from 'hds-react';
import { Box } from '@chakra-ui/react';
import { Taydennyspyynto } from './types';
import { sortTaydennyspyyntoFields } from './utils';
import { ApplicationType } from '../types/application';

type Props = {
  taydennyspyynto: Taydennyspyynto;
  applicationType: ApplicationType;
};

export default function TaydennyspyyntoNotification({
  taydennyspyynto,
  applicationType,
}: Readonly<Props>) {
  const { t } = useTranslation();

  return (
    <Notification type="error" label={t('taydennyspyynto:taydennyspyynto')}>
      <p>{t('taydennyspyynto:notificationText')}:</p>
      <Box as="ul" ml="var(--spacing-m)">
        {taydennyspyynto.kentat.toSorted(sortTaydennyspyyntoFields).map((kentta) => {
          return (
            <li key={kentta.key}>
              <strong>{t(`taydennyspyynto:fields:${applicationType}:${kentta.key}`)}</strong>:{' '}
              {kentta.message}
            </li>
          );
        })}
      </Box>
    </Notification>
  );
}
