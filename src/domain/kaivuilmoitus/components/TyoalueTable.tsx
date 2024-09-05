import { useState } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Box, Flex } from '@chakra-ui/react';
import { IconLocation, IconTrash, Table } from 'hds-react';
import clsx from 'clsx';
import { Feature } from 'ol';
import { Geometry } from 'ol/geom';
import VectorSource from 'ol/source/Vector';
import useDrawContext from '../../../common/components/map/modules/draw/useDrawContext';
import { KaivuilmoitusFormValues } from '../types';
import { getAreaDefaultName } from '../../application/utils';
import ConfirmationDialog from '../../../common/components/HDSConfirmationDialog/ConfirmationDialog';
import './TyoalueTable.css';
import { getSurfaceArea } from '../../../common/components/map/utils';

type Props = {
  alueIndex: number;
  drawSource: VectorSource;
  hankeAlueName: string;
  hankeName: string;
  onRemoveLastArea?: () => void;
};

type TableData = {
  id: string;
  nimi: string;
  pintaAla: number;
  feature?: Feature<Geometry>;
  index: number;
};

export default function TyoalueTable({
  alueIndex,
  drawSource,
  hankeAlueName,
  hankeName,
  onRemoveLastArea,
}: Readonly<Props>) {
  const { t } = useTranslation();
  const {
    state: { selectedFeature },
    actions: { setSelectedFeature },
  } = useDrawContext();
  const { getValues } = useFormContext<KaivuilmoitusFormValues>();
  const { fields: tyoalueet, remove } = useFieldArray<
    KaivuilmoitusFormValues,
    `applicationData.areas.${number}.tyoalueet`
  >({
    name: `applicationData.areas.${alueIndex}.tyoalueet`,
  });
  const [areaToRemove, setAreaToRemove] = useState<TableData | null>(null);

  const tableRows: TableData[] = tyoalueet.map((alue, index) => {
    const areaName = getAreaDefaultName(t, index, tyoalueet.length);
    alue.openlayersFeature?.setProperties({
      areaName,
      hankeName,
      startDate: getValues('applicationData.startTime'),
      endDate: getValues('applicationData.endTime'),
    });
    return {
      id: alue.id,
      nimi: areaName,
      pintaAla: Number(getSurfaceArea(alue.openlayersFeature!.getGeometry()!).toFixed(0)),
      feature: alue.openlayersFeature,
      index,
    };
  });

  function removeArea(area: TableData) {
    if (area.feature !== undefined) {
      setAreaToRemove(area);
    }
  }

  const tableCols = [
    {
      headerName: t('hakemus:labels:workArea'),
      key: 'nimi',
      isSortable: true,
      transform: (args: TableData) => (
        <Flex
          as="button"
          gap="var(--spacing-xs)"
          type="button"
          onClick={() => setSelectedFeature(args.feature!)}
          className={clsx({ selected: args.feature === selectedFeature })}
        >
          <IconLocation />
          <Box textDecoration="underline">{args.nimi}</Box>
        </Flex>
      ),
    },
    {
      headerName: `${t('form:labels:pintaAla')} (m²)`,
      key: 'pintaAla',
      isSortable: true,
    },
    {
      headerName: '',
      key: 'deleteButton',
      isSortable: false,
      transform: (args: TableData) => (
        <Flex justifyContent="flex-end">
          <button
            aria-label={`${t('common:buttons:remove')} ${args.nimi}`}
            type="button"
            onClick={() => removeArea(args)}
          >
            <IconTrash color="var(--color-error)" />
          </button>
        </Flex>
      ),
    },
  ];

  function confirmRemoveArea() {
    if (areaToRemove !== null) {
      remove(areaToRemove.index);
      drawSource.removeFeature(areaToRemove.feature!);
      setAreaToRemove(null);
    }
    if (tyoalueet.length === 1 && onRemoveLastArea) {
      onRemoveLastArea();
    }
  }

  function closeAreaRemoveDialog() {
    setAreaToRemove(null);
  }

  return (
    <Box marginTop="var(--spacing-m)" marginBottom="var(--spacing-s)">
      <Box marginBottom="var(--spacing-xs)">
        <h4 className="heading-s">
          {hankeAlueName}: {t('hakemus:labels:workAreaPlural')} ({tyoalueet.length})
        </h4>
      </Box>
      <Box maxHeight="500px" overflow="auto">
        <Table
          id="tyoalueet-table"
          cols={tableCols}
          rows={tableRows}
          indexKey="id"
          zebra
          theme={{
            '--header-background-color': 'var(--color-black-90)',
          }}
          dataTestId="tyoalueet-table"
        />
      </Box>

      <ConfirmationDialog
        title={t('hakemus:labels:removeAreaTitle')}
        description={t('hakemus:labels:removeAreaDescription', {
          areaName: areaToRemove?.nimi,
        })}
        isOpen={areaToRemove !== null}
        close={closeAreaRemoveDialog}
        mainAction={confirmRemoveArea}
        mainBtnLabel={t('common:confirmationDialog:confirmButton')}
        variant="danger"
      />
    </Box>
  );
}
