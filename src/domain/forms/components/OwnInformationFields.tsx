import { useTranslation } from 'react-i18next';
import { Box } from '@chakra-ui/react';
import { TextInput as HDSTextInput } from 'hds-react';
import TextInput from '../../../common/components/textInput/TextInput';
import useUser from '../../auth/useUser';

function OwnInformationFields() {
  const { t } = useTranslation();
  const user = useUser();

  return (
    <>
      <Box marginBottom="var(--spacing-s)">
        <h3 className="heading-s">{t('form:labels:omatTiedot')}</h3>
      </Box>
      <Box marginBottom="var(--spacing-m)">
        <HDSTextInput
          id="user-name"
          label={t('form:yhteystiedot:labels:nimi')}
          value={`${user?.profile?.name}`}
          helperText={t('form:labels:fromHelsinkiProfile')}
          readOnly
          onPointerEnterCapture={() => {}}
          onPointerLeaveCapture={() => {}}
          crossOrigin=""
        />
      </Box>
      <Box marginBottom="var(--spacing-s)" maxWidth={328}>
        <TextInput
          name="perustaja.sahkoposti"
          label={t('hankeForm:labels:email')}
          required
          defaultValue={user?.profile.email}
        />
      </Box>
      <Box maxWidth={328}>
        <TextInput
          name="perustaja.puhelinnumero"
          label={t('hankeForm:labels:puhelinnumero')}
          required
        />
      </Box>
    </>
  );
}

export default OwnInformationFields;
