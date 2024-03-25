import { useTranslation } from 'react-i18next';
import { IconUser } from 'hds-react';
import { HankeUser } from './hankeUser';
import DropdownMultiselect from '../../../common/components/dropdown/DropdownMultiselect';

/**
 * Combobox component for selecting hanke user as contact person (yhteyshenkilö) for a contact (yhteystieto)
 */
function ContactPersonSelect<T>({
  name,
  hankeUsers,
  mapHankeUserToValue,
  mapValueToLabel,
  transformValue,
}: Readonly<{
  name: string;
  hankeUsers?: HankeUser[];
  mapHankeUserToValue: (user: HankeUser) => T;
  mapValueToLabel: (value: T) => string;
  transformValue?: (value: T) => T;
}>) {
  const { t } = useTranslation();

  function mapHankeUserToLabel(user: HankeUser): string {
    return `${user.etunimi} ${user.sukunimi} (${user.sahkoposti})`;
  }

  return (
    <DropdownMultiselect<T>
      id={name}
      name={name}
      label={t('form:yhteystiedot:titles:subContacts')}
      helperText={t('form:yhteystiedot:helperTexts:yhteyshenkilo')}
      icon={<IconUser />}
      clearable={false}
      mapValueToLabel={mapValueToLabel}
      transformValue={transformValue}
      defaultValue={[]}
      options={
        hankeUsers?.map((hankeUser) => ({
          value: mapHankeUserToValue(hankeUser),
          label: mapHankeUserToLabel(hankeUser),
        })) ?? []
      }
    />
  );
}

export default ContactPersonSelect;
