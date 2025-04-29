/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Trans, useTranslation } from 'react-i18next';
import { Box, Flex } from '@chakra-ui/react';
import { IconAlertCircleFill, IconLinkExternal, IconLocation, IconTrash, Table } from 'hds-react';
import clsx from 'clsx';
import { Feature } from 'ol';
import { Geometry, Polygon as OlPolygon } from 'ol/geom';
import VectorSource from 'ol/source/Vector';
import { uniqueId } from 'lodash';
import useDrawContext from '../../../common/components/map/modules/draw/useDrawContext';
import { KaivuilmoitusFormValues } from '../types';
import { getAreaDefaultName } from '../../application/utils';
import ConfirmationDialog from '../../../common/components/HDSConfirmationDialog/ConfirmationDialog';
import './TyoalueTable.css';
import { getSurfaceArea } from '../../../common/components/map/utils';
import { OverlayProps } from '../../../common/components/map/types';
import {
  ApplicationArea,
  ApplicationGeometry,
  HankkeenHakemus,
  Tyoalue,
} from '../../application/types/application';
import { booleanIntersects } from '@turf/boolean-intersects';
import useLinkPath from '../../../common/hooks/useLinkPath';
import { ROUTES } from '../../../common/types/route';
import Link from '../../../common/components/Link/Link';
import { TFunction } from 'i18next';
import {
  applicationGeometryContains,
  createMultiPolygonFromAreas,
  createUnionFromAreas,
} from '../../map/utils';

type Props = {
  alueIndex: number;
  drawSource: VectorSource;
  hankeAlueName: string;
  johtoselvitykset: HankkeenHakemus[];
  onRemoveArea?: () => void;
  onRemoveLastArea?: () => void;
};

type TableData = {
  id: string;
  nimi: string;
  notification: string | JSX.Element | null;
  pintaAla: number;
  feature?: Feature<Geometry>;
  index: number;
};

/**
 * Return correct notification based on overlapping count.
 */
function getOverlappingNotification(
  overlappingCount: number,
  overlappingJohtoselvitykset: HankkeenHakemus[],
  t: TFunction,
  getApplicationPathView: (routeParams: Record<string, string>) => string,
): JSX.Element | null {
  if (overlappingCount > 1) {
    return (
      <Flex gap="var(--spacing-xs)">
        <IconAlertCircleFill color="var(--color-alert-dark)" />
        <Box as="span">{t('hakemus:labels:workAreaOverlapsMultiple')}</Box>
      </Flex>
    );
  }
  if (overlappingCount == 1) {
    return (
      <Flex gap="var(--spacing-xs)">
        <IconAlertCircleFill color="var(--color-alert-dark)" />
        <Box as="span">
          <Trans
            i18nKey="hakemus:labels:workAreaOverlapsSingle"
            components={{
              a: (
                <Link
                  href={getApplicationPathView({
                    id: overlappingJohtoselvitykset[0].id!.toString(),
                  })}
                  openInNewTab={true}
                  external={true}
                >
                  Hakemus
                </Link>
              ),
            }}
            values={{ applicationIdentifier: overlappingJohtoselvitykset[0].applicationIdentifier }}
          >
            Työalue ylittää johtoselvityksen rajauksen, tee johtoselvitykseen{' '}
            <a>{overlappingJohtoselvitykset[0].applicationIdentifier}</a> muutosilmoitus
          </Trans>
        </Box>
        <IconLinkExternal />
      </Flex>
    );
  }
  return null;
}

export default function TyoalueTable({
  alueIndex,
  drawSource,
  hankeAlueName,
  johtoselvitykset,
  onRemoveArea,
  onRemoveLastArea,
}: Readonly<Props>) {
  const { t } = useTranslation();
  const getApplicationPathView = useLinkPath(ROUTES.HAKEMUS);
  const {
    state: { selectedFeature },
    actions: { setSelectedFeature },
  } = useDrawContext();
  const { getValues, setValue } = useFormContext<KaivuilmoitusFormValues>();
  const tyoalueet = getValues(`applicationData.areas.${alueIndex}.tyoalueet`) as Tyoalue[];
  const [areaToRemove, setAreaToRemove] = useState<TableData | null>(null);

  const tableRows: TableData[] = tyoalueet.map((alue, index) => {
    const areaName = getAreaDefaultName(t, index, tyoalueet.length);
    const allJohtoselvitysAreas = johtoselvitykset.flatMap(
      (johtoselvitys) => johtoselvitys.applicationData.areas as ApplicationArea[],
    );

    const overlappingJohtoselvitykset =
      johtoselvitykset.filter((application) => {
        return application.applicationData.areas?.find((area) => {
          const applicationArea = area as ApplicationArea;
          const alueGeometry = new ApplicationGeometry(
            (alue.openlayersFeature!.getGeometry()! as OlPolygon).getCoordinates(),
          );

          const applicationAreaUnion = createUnionFromAreas(allJohtoselvitysAreas, applicationArea);
          const johtoselvitysAreasMultipolygon = createMultiPolygonFromAreas(
            allJohtoselvitysAreas,
            applicationArea,
          );

          const areaIntersects = booleanIntersects(applicationArea.geometry, alueGeometry);
          const areaContains = applicationGeometryContains(applicationArea.geometry, alueGeometry);
          const areaUnionIntersects = booleanIntersects(
            applicationAreaUnion.geometry,
            alueGeometry,
          );
          const areaUnionContains = applicationGeometryContains(
            applicationAreaUnion.geometry,
            alueGeometry,
          );
          const multipolygonContains = johtoselvitysAreasMultipolygon.geometry.coordinates.some(
            (coordinates) => {
              return applicationGeometryContains(
                new ApplicationGeometry(coordinates),
                alueGeometry,
              );
            },
          );

          return (
            areaIntersects &&
            !areaContains &&
            areaUnionIntersects &&
            !areaUnionContains &&
            !multipolygonContains
          );
        });
      }) || [];
    const overlappingCount = overlappingJohtoselvitykset.length;
    const overlappingNotification = getOverlappingNotification(
      overlappingCount,
      overlappingJohtoselvitykset,
      t,
      getApplicationPathView,
    );
    const previousOverlayProps = alue.openlayersFeature?.get('overlayProps') as OverlayProps;
    alue.openlayersFeature?.setProperties(
      {
        areaName,
        overlayProps: new OverlayProps({ ...previousOverlayProps, heading: areaName }),
      },
      true,
    );
    return {
      id: uniqueId(),
      nimi: areaName,
      notification: overlappingNotification,
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
      headerName: '',
      key: 'notification',
      isSortable: false,
    },
    {
      headerName: `${t('form:labels:pintaAla')} (m²)`,
      key: 'pintaAla',
      isSortable: true,
      transform: (args: TableData) => <Flex justifyContent="right">{args.pintaAla}</Flex>,
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
      setValue(
        `applicationData.areas.${alueIndex}.tyoalueet`,
        tyoalueet.filter((_, i) => i !== areaToRemove.index),
        { shouldValidate: true, shouldDirty: true },
      );
      drawSource.removeFeature(areaToRemove.feature!);
      setAreaToRemove(null);
      if (tyoalueet.length > 1 && onRemoveArea) {
        onRemoveArea();
      }
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
          dense
          theme={{
            '--header-background-color': 'var(--color-black-90)',
          }}
          data-testid="tyoalueet-table"
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
