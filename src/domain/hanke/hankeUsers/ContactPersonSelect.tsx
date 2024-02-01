import { useTranslation } from 'react-i18next';
import { IconUser } from 'hds-react';
import { HankeUser } from './hankeUser';
import { HankeYhteyshenkilo } from '../../types/hanke';
import { mapHankeUserToHankeYhteyshenkilo } from './utils';
import DropdownMultiselect from '../../../common/components/dropdown/DropdownMultiselect';

/**
 * Combobox component for selecting hanke user as contact person (yhteyshenkilö) for a contact (yhteystieto)
 */
function ContactPersonSelect({
  name,
  defaultValue,
  hankeUsers,
}: Readonly<{
  name: string;
  defaultValue?: HankeYhteyshenkilo[];
  hankeUsers?: HankeUser[];
}>) {
  const { t } = useTranslation();

  function mapUserToLabel(user: HankeUser | HankeYhteyshenkilo | null) {
    return user !== null ? `${user.etunimi} ${user.sukunimi} (${user.sahkoposti})` : '';
  }

  return (
    <DropdownMultiselect<HankeYhteyshenkilo>
      id={name}
      name={name}
      label={t('form:yhteystiedot:titles:subContacts')}
      helperText={t('form:yhteystiedot:helperTexts:yhteyshenkilo')}
      icon={<IconUser />}
      clearable={false}
      mapValueToLabel={mapUserToLabel}
      defaultValue={defaultValue?.map((value: HankeYhteyshenkilo) => ({
        value,
        label: mapUserToLabel(value),
      }))}
      options={
        hankeUsers?.map((hankeUser) => ({
          value: mapHankeUserToHankeYhteyshenkilo(hankeUser),
          label: mapUserToLabel(hankeUser),
        })) ?? []
      }
    />
  );
}

export default ContactPersonSelect;
