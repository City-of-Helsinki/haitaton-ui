import React from 'react';
import { Menu, MenuButton, MenuList, MenuGroup } from '@chakra-ui/react';
import { IconLayers } from 'hds-react/icons';
import { useTranslation } from 'react-i18next';
import { Checkbox } from 'hds-react';
import ControlPanel from './ControlPanel';
import styles from './Controls.module.scss';
import { MapTileLayerId } from '../../../../domain/map/types';

type TileLayer = {
  id: MapTileLayerId;
  visible: boolean;
};

type Props = {
  tileLayers: TileLayer[];
  // I dont want to import type from domain. Maybe move layers here under common dir?
  onClickTileLayer: (key: MapTileLayerId) => void;
};

const LayerControl: React.FC<React.PropsWithChildren<Props>> = ({
  tileLayers,
  onClickTileLayer,
}) => {
  const { t } = useTranslation();

  return (
    <ControlPanel className={styles.tileLayerControl}>
      <Menu closeOnSelect={false}>
        <MenuButton
          aria-label={t('map:controls:ariaLayerMenu')}
          type="button"
          className={styles.tileLayerControl__button}
          // Disable form submit
          onClick={() => false}
        >
          <IconLayers aria-hidden color="white" />
        </MenuButton>
        <MenuList className={styles.controlMenu} aria-hidden id="layer-list" role="menu">
          <MenuGroup>
            {tileLayers.map(({ id, visible }) => (
              <div
                className={styles.drawControl__checkbox}
                key={id}
                role="menuitemcheckbox"
                aria-checked={visible}
              >
                <Checkbox
                  id={id}
                  label={t(`map:tileLayers:${id}`)}
                  checked={visible}
                  onClick={() => onClickTileLayer(id)}
                  data-testid={`layer-control-${id}`}
                />
              </div>
            ))}
          </MenuGroup>
        </MenuList>
      </Menu>
    </ControlPanel>
  );
};

export default LayerControl;
