import React from 'react';
import { Menu, MenuButton, MenuList, MenuGroup } from '@chakra-ui/react';
import { IconLayers } from 'hds-react/icons';
import { useTranslation } from 'react-i18next';
import { Checkbox } from 'hds-react';
import ControlPanel from './ControlPanel';
import styles from './Controls.module.scss';

type TileLayer = {
  id: string;
  visible: boolean;
};

type Props = {
  tileLayers: TileLayer[];
  // I dont want to import type from domain. Maybe move layers here under common dir?
  // eslint-disable-next-line
  onClickTileLayer: (key: any) => void; // TODO: improve type definition
};

const LayerControl: React.FC<Props> = ({ tileLayers, onClickTileLayer }) => {
  const { t } = useTranslation();

  return (
    <ControlPanel className={styles.tileLayerControl}>
      <Menu closeOnSelect={false}>
        <MenuButton aria-label={t('map:controls:ariaLayerMenu')}>
          <IconLayers aria-hidden />
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
