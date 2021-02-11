import React from 'react';
import { Menu, MenuButton, MenuList, MenuGroup, MenuDivider } from '@chakra-ui/react';
import { IconLayers } from 'hds-react/icons';
import { useTranslation } from 'react-i18next';
import { Checkbox } from 'hds-react';
import ControlPanel from './ControlPanel';
import styles from './Controls.module.scss';
import { CommonGeoJSON } from '../../../types/hanke';

type TileLayer = {
  id: string;
  visible: boolean;
};

type DataLayer = {
  key: string;
  data: CommonGeoJSON;
  visible: boolean;
};

type Props = {
  tileLayers: TileLayer[];
  dataLayers: DataLayer[];
  // I dont want to import type from domain. Maybe move layers here under common dir?
  // eslint-disable-next-line
  onClickDataLayer: (id: any) => void; // TODO: improve type definition: see original comment above
  // eslint-disable-next-line
  onClickTileLayer: (key: any) => void; // TODO: improve type definition
};

const showDataLayers = false; // HAI-532 hide dataLayers for now as actual data sources
// are still being investigated

const LayerControl: React.FC<Props> = ({
  tileLayers,
  dataLayers,
  onClickDataLayer,
  onClickTileLayer,
}) => {
  const { t } = useTranslation();

  return (
    <ControlPanel className={styles.tileLayerControl}>
      <Menu closeOnSelect={false}>
        <MenuButton>
          <IconLayers />
        </MenuButton>
        <MenuList className={styles.controlMenu}>
          <MenuGroup>
            {tileLayers.map(({ id, visible }) => (
              <div className={styles.drawControl__checkbox} key={id}>
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
          {showDataLayers && (
            <div>
              <MenuDivider className={styles.controlMenu__divider} />
              <MenuGroup>
                {dataLayers.map(({ key, visible }) => (
                  <div className={styles.drawControl__checkbox} key={key}>
                    <Checkbox
                      id={key}
                      label={t(`map:datalayers:${key}`)}
                      checked={visible}
                      onClick={() => onClickDataLayer(key)}
                    />
                  </div>
                ))}
              </MenuGroup>
            </div>
          )}
        </MenuList>
      </Menu>
    </ControlPanel>
  );
};

export default LayerControl;
