import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import HankeSidebar from './HankeSidebar';
import HankkeetContext from '../../HankkeetProviderContext';
import { usePublicHanke } from '../../../hanke/hooks/usePublicHanke';
import { useGlobalNotification } from '../../../../common/components/globalNotification/GlobalNotificationContext';
import { useTranslation } from 'react-i18next';
import { toHankeData } from '../../../types/hanke';

type Props = {
  hankeTunnus?: string;
};

const HankeSidebarContainer: React.FC<React.PropsWithChildren<Props>> = ({ hankeTunnus }) => {
  const { t } = useTranslation();
  const location = useLocation();
  const hankkeenTunnus = hankeTunnus || new URLSearchParams(location.search).get('hanke');
  const { data: publicHanke, isLoading: hankeLoading, error } = usePublicHanke(hankkeenTunnus);
  const hanke = publicHanke ? toHankeData(publicHanke) : null;
  const { hankkeetObject } = useContext(HankkeetContext);
  const minimalHanke = hankkeetObject[hankkeenTunnus || ''];
  const hankeToShow = hanke || minimalHanke;
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const navigate = useNavigate();
  const hankealueId = Number.parseInt(new URLSearchParams(location.search).get('hankealue')!);
  const { setNotification } = useGlobalNotification();

  useEffect(() => {
    if (error) {
      setNotification(true, {
        position: 'top-right',
        dismissible: true,
        autoClose: true,
        autoCloseDuration: 8000,
        label: t('common:components:errorLoadingInfo:textTop'),
        message: t('common:components:errorLoadingInfo:textBottom'),
        type: 'error',
        closeButtonLabelText: t('common:components:notification:closeButtonLabelText'),
      });
    } else if (hankkeenTunnus) {
      setIsOpen(true);
    }
  }, [error, hankkeenTunnus, setNotification, t]);

  const handleClose = () => {
    setIsOpen(false);
    navigate(location.pathname);
  };

  if (error) {
    return null;
  }

  if (!hankkeenTunnus || !hankkeetObject[hankkeenTunnus]) {
    return null;
  }

  return (
    <HankeSidebar
      hanke={hankeToShow}
      loading={hankeLoading}
      hankealueId={hankealueId}
      isOpen={isOpen}
      handleClose={handleClose}
    />
  );
};

export default HankeSidebarContainer;
