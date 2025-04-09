import { useContext, useEffect } from 'react';
import { FullScreen } from 'ol/control';
import { useTranslation } from 'react-i18next';
import MapContext from '../MapContext';
import './FullscreenControl.scss';

const labelElement = document.createElement('div');
labelElement.className = 'hds-icon hds-icon--link-external';

const labelActiveElement = document.createElement('div');
labelActiveElement.className = 'hds-icon hds-icon--collapse';

const FullScreenControl = () => {
  const { map } = useContext(MapContext);
  const { t } = useTranslation();

  useEffect(() => {
    if (!map) return;

    const fullScreenControl = new FullScreen({
      label: labelElement,
      labelActive: labelActiveElement,
      tipLabel: t('map:controls:fullscreen'),
    });

    map.addControl(fullScreenControl);

    return () => {
      map.removeControl(fullScreenControl);
    };
  }, [map, t]);

  return null;
};

export default FullScreenControl;
