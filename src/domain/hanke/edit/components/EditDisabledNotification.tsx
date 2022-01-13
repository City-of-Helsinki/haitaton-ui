import React from 'react';
import { useTranslation } from 'react-i18next';
import { Notification } from 'hds-react';
import '../HankeForm.styles.scss';
import { isHankeEditingDisabled } from '../utils';
import { FormProps } from '../types';

type Props = {
  formData: FormProps['formData'];
};

const EditDisabledNotification = ({ formData }: Props) => {
  const { t } = useTranslation();
  const disabledReason = isHankeEditingDisabled(formData);
  return disabledReason ? (
    <Notification
      size="small"
      label=""
      type="alert"
      className="hankeForm__notification"
      dataTestId="editing-disabled-notification"
    >
      {t(`hankeForm:editingDisabled:${disabledReason}`)}
    </Notification>
  ) : null;
};

export default EditDisabledNotification;
