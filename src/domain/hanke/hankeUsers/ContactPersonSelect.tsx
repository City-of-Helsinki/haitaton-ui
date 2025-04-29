import { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { Tooltip } from 'hds-react';
import { HankeUser } from './hankeUser';
import DropdownMultiselect from '../../../common/components/dropdown/DropdownMultiselect';
import { TooltipProps } from '../../../common/types/tooltip';

/**
 * Combobox component for selecting hanke user as contact person (yhteyshenkilö) for a contact (yhteystieto)
 */
function ContactPersonSelect<T>({
  name,
  hankeUsers,
  tooltip,
  required,
  mapHankeUserToValue,
  mapValueToLabel,
  transformValue,
}: Readonly<{
  name: string;
  hankeUsers?: HankeUser[];
  tooltip?: ReactElement<TooltipProps, typeof Tooltip>;
  required?: boolean;
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
      placeholder={t('form:yhteystiedot:placeholders:yhteyshenkilo')}
      clearable={false}
      mapValueToLabel={mapValueToLabel}
      transformValue={transformValue}
      required={required}
      options={
        hankeUsers?.map((hankeUser) => ({
          value: JSON.stringify(mapHankeUserToValue(hankeUser)),
          label: mapHankeUserToLabel(hankeUser),
        })) ?? []
      }
      tooltip={tooltip}
    />
  );
}

export default ContactPersonSelect;
