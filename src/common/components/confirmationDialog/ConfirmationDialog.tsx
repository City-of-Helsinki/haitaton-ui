import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from 'hds-react';
import { getIsDialogOpen, getRedirectUrl } from './selectors';
import { actions } from './reducer';
import ConfirmationDialogUI from './ConfirmationDialogUI';

import './Dialog.styles.scss';

const ConfirmationDialog: React.FC = () => {
  const isDialogOpenVal = useSelector(getIsDialogOpen());
  const redirectUrl = useSelector(getRedirectUrl());
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  function onClose() {
    dispatch(actions.updateIsDialogOpen({ isDialogOpen: false, redirectUrl }));
  }
  function closeAndRedirect() {
    dispatch(actions.updateIsDialogOpen({ isDialogOpen: false, redirectUrl }));
    navigate(redirectUrl);
  }

  return (
    <ConfirmationDialogUI
      handleClose={onClose}
      body={t('common:confirmationDialog:bodyText')}
      isOpen={isDialogOpenVal}
    >
      <Button type="button" theme="coat" variant="secondary" onClick={() => closeAndRedirect()}>
        {t('common:confirmationDialog:exitButton')}
      </Button>
    </ConfirmationDialogUI>
  );
};
export default ConfirmationDialog;
