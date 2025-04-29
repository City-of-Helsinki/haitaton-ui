import React from 'react';
import { Menu, MenuButton, MenuList, MenuItem } from '@chakra-ui/react';
import { IconLayers } from 'hds-react/icons';
import { useTranslation } from 'react-i18next';
import { Checkbox } from 'hds-react';
import ControlPanel from './ControlPanel';
import styles from './Controls.module.scss';
import { MapTileLayerId } from '../../../../domain/map/types';
import clsx from 'clsx';

type TileLayer = {
  id: MapTileLayerId;
  visible: boolean;
};

type Props = {
  tileLayers: TileLayer[];
  // I dont want to import type from domain. Maybe move layers here under common dir?
  onClickTileLayer: (key: MapTileLayerId) => void;
  className?: string;
};

const LayerControl: React.FC<React.PropsWithChildren<Props>> = ({
  tileLayers,
  onClickTileLayer,
  className,
}) => {
  const { t } = useTranslation();

  return (
    <ControlPanel className={clsx(styles.tileLayerControl, className)}>
      <Menu closeOnSelect={false}>
        <MenuButton
          aria-label={t('map:controls:ariaLayerMenu')}
          type="button"
          className={styles.tileLayerControl__button}
        >
          <IconLayers aria-hidden color="white" />
        </MenuButton>
        <MenuList id="layer-list" border="1px solid var(--color-black-50)" borderRadius={0}>
          {tileLayers.map(({ id, visible }) => (
            <MenuItem as="div" key={id} _focus={{ backgroundColor: 'none' }}>
              <Checkbox
                id={id}
                label={t(`map:tileLayers:${id}`)}
                checked={visible}
                onClick={() => onClickTileLayer(id)}
                data-testid={`layer-control-${id}`}
              />
            </MenuItem>
          ))}
        </MenuList>
      </Menu>
    </ControlPanel>
  );
};

export default LayerControl;
