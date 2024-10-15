import { useTranslation } from 'react-i18next';
import { Notification } from 'hds-react';
import { Box } from '@chakra-ui/react';
import { Taydennyspyynto } from './types';

type Props = {
  taydennyspyynto: Taydennyspyynto;
};

export default function TaydennyspyyntoNotification({ taydennyspyynto }: Readonly<Props>) {
  const { t } = useTranslation();

  return (
    <Notification type="error" label={t('taydennyspyynto:taydennyspyynto')}>
      <p>{t('taydennyspyynto:notificationText')}:</p>
      <Box as="ul" ml="var(--spacing-m)">
        {taydennyspyynto.kentat.map((kentta) => {
          return (
            <li key={kentta.key}>
              <strong>{t(`taydennyspyynto:fields:${kentta.key}`)}</strong>: {kentta.message}
            </li>
          );
        })}
      </Box>
    </Notification>
  );
}
