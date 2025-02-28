import { useTranslation } from 'react-i18next';
import { Box } from '@chakra-ui/layout';
import { Tab, TabList, TabPanel, Tabs } from 'hds-react';
import {
  Application,
  ApplicationArea,
  ApplicationType,
  JohtoselvitysData,
  KaivuilmoitusAlue,
  KaivuilmoitusData,
} from '../types/application';
import { getAreaDefaultName } from '../utils';
import { getAreaGeometry } from '../../johtoselvitys/utils';
import Text from '../../../common/components/text/Text';
import { formatSurfaceArea } from '../../map/utils';
import ApplicationDates from '../components/ApplicationDates';
import OwnHankeMapHeader from '../../map/components/OwnHankeMap/OwnHankeMapHeader';
import OwnHankeMap from '../../map/components/OwnHankeMap/OwnHankeMap';
import useFilterHankeAlueetByApplicationDates from '../hooks/useFilterHankeAlueetByApplicationDates';
import { HankeAlue, HankeData } from '../../types/hanke';
import CustomAccordion from '../../../common/components/customAccordion/CustomAccordion';
import { Taydennys } from '../taydennys/types';
import { Muutosilmoitus } from '../muutosilmoitus/types';

function getTyoalueet(
  applicationType: ApplicationType,
  areas: ApplicationArea[] | KaivuilmoitusAlue[],
) {
  return applicationType === 'CABLE_REPORT'
    ? (areas as ApplicationArea[])
    : (areas as KaivuilmoitusAlue[]).flatMap((area) => area.tyoalueet);
}

type TyoalueetListProps = {
  tyoalueet: ApplicationArea[];
  startTime: Date | null;
  endTime: Date | null;
};

function TyoalueetList({ tyoalueet, startTime, endTime }: Readonly<TyoalueetListProps>) {
  const { t } = useTranslation();

  return tyoalueet.map((tyoalue, index) => {
    const areaName = getAreaDefaultName(t, index, tyoalueet.length);
    const geometry = getAreaGeometry(tyoalue);
    return (
      <Box
        key={areaName}
        padding="var(--spacing-s)"
        paddingRight="var(--spacing-m)"
        _notLast={{ borderBottom: '1px solid var(--color-black-30)' }}
      >
        <Text tag="p" styleAs="body-m" weight="bold" spacingBottom="2-xs">
          {areaName} ({formatSurfaceArea(geometry)})
        </Text>
        <ApplicationDates startTime={startTime} endTime={endTime} />
      </Box>
    );
  });
}

type KaivuilmoitusAlueetProps = {
  kaivuilmoitusAlueet?: KaivuilmoitusAlue[] | null;
  hanke: HankeData;
  applicationData: KaivuilmoitusData;
};

function KaivuilmoitusAlueet({
  kaivuilmoitusAlueet,
  hanke,
  applicationData,
}: Readonly<KaivuilmoitusAlueetProps>) {
  return (
    <>
      {kaivuilmoitusAlueet?.map((kaivuilmoitusAlue) => {
        const hankeAlue = hanke.alueet.find((alue) => alue.id === kaivuilmoitusAlue.hankealueId);

        return (
          <CustomAccordion
            key={kaivuilmoitusAlue.hankealueId}
            accordionBorderBottom
            headingSize="s"
            heading={kaivuilmoitusAlue.name}
            subHeading={
              <Box marginTop="var(--spacing-2-xs)">
                <ApplicationDates
                  startTime={hankeAlue?.haittaAlkuPvm ?? null}
                  endTime={hankeAlue?.haittaLoppuPvm ?? null}
                />
              </Box>
            }
          >
            <Box marginLeft="var(--spacing-s)">
              <TyoalueetList
                tyoalueet={kaivuilmoitusAlue.tyoalueet}
                startTime={applicationData.startTime}
                endTime={applicationData.endTime}
              />
            </Box>
          </CustomAccordion>
        );
      })}
    </>
  );
}

type AreaTabsProps = {
  hanke: HankeData;
  applicationType: ApplicationType;
  taydennys?: Taydennys<JohtoselvitysData | KaivuilmoitusData> | null;
  muutosilmoitus?: Muutosilmoitus<JohtoselvitysData | KaivuilmoitusData>;
  originalHakemusContent: React.ReactNode;
};

/**
 * Renders a tabbed interface for displaying täydennys/muutosilmoitus areas and original hakemus areas.
 */
function AreaTabs({
  hanke,
  applicationType,
  taydennys,
  muutosilmoitus,
  originalHakemusContent,
}: Readonly<AreaTabsProps>) {
  const { t } = useTranslation();

  const taydennysTyoalueet = taydennys
    ? getTyoalueet(applicationType, taydennys.applicationData.areas)
    : undefined;
  const muutosilmoitusTyoalueet = muutosilmoitus
    ? getTyoalueet(applicationType, muutosilmoitus.applicationData.areas)
    : undefined;
  const tyoalueet = taydennysTyoalueet ?? muutosilmoitusTyoalueet;

  const taydennysKaivuilmoitusAlueet =
    applicationType === 'EXCAVATION_NOTIFICATION'
      ? (taydennys?.applicationData.areas as KaivuilmoitusAlue[] | undefined)
      : null;
  const muutosilmoitusKaivuilmoitusAlueet =
    applicationType === 'EXCAVATION_NOTIFICATION'
      ? (muutosilmoitus?.applicationData.areas as KaivuilmoitusAlue[] | undefined)
      : null;
  const kaivuilmoitusAlueet = taydennysKaivuilmoitusAlueet ?? muutosilmoitusKaivuilmoitusAlueet;

  const applicationData = taydennys?.applicationData ?? muutosilmoitus?.applicationData;
  const startTime = applicationData?.startTime;
  const endTime = applicationData?.endTime;

  return (
    <Tabs>
      <TabList>
        <Tab>
          {taydennys ? t('taydennys:labels:taydennykset') : t('muutosilmoitus:labels:muutokset')}
        </Tab>
        <Tab>{t('taydennys:labels:originalInformation')}</Tab>
      </TabList>
      <TabPanel>
        <Box mt="var(--spacing-s)">
          <Box mb="var(--spacing-s)">
            <OwnHankeMapHeader hankeTunnus={hanke.hankeTunnus} showLink={false} />
            <OwnHankeMap hanke={hanke} tyoalueet={tyoalueet} />
          </Box>
          {applicationType === 'CABLE_REPORT' && (
            <TyoalueetList
              tyoalueet={tyoalueet ?? []}
              startTime={startTime ?? null}
              endTime={endTime ?? null}
            />
          )}
          {applicationType === 'EXCAVATION_NOTIFICATION' && (
            <KaivuilmoitusAlueet
              kaivuilmoitusAlueet={kaivuilmoitusAlueet}
              hanke={hanke}
              applicationData={applicationData as KaivuilmoitusData}
            />
          )}
        </Box>
      </TabPanel>
      <TabPanel>
        <Box mt="var(--spacing-s)">{originalHakemusContent}</Box>
      </TabPanel>
    </Tabs>
  );
}

type SidebarProps = {
  hanke: HankeData;
  application: Application;
};

export default function Sidebar({ hanke, application }: Readonly<SidebarProps>) {
  const { applicationType, applicationData, taydennys, muutosilmoitus } = application;

  const tyoalueet = getTyoalueet(applicationType, applicationData.areas);

  const kaivuilmoitusAlueet =
    applicationType === 'EXCAVATION_NOTIFICATION'
      ? (applicationData.areas as KaivuilmoitusAlue[])
      : null;

  const filterHankeAlueet = useFilterHankeAlueetByApplicationDates({
    applicationStartDate: applicationData.startTime,
    applicationEndDate: applicationData.endTime,
  });

  const filterHankeAlueetForTaydennys = useFilterHankeAlueetByApplicationDates({
    applicationStartDate: taydennys?.applicationData.startTime ?? null,
    applicationEndDate: taydennys?.applicationData.endTime ?? null,
  });

  const filterHankeAlueetForMuutosilmoitus = useFilterHankeAlueetByApplicationDates({
    applicationStartDate: muutosilmoitus?.applicationData.startTime ?? null,
    applicationEndDate: muutosilmoitus?.applicationData.endTime ?? null,
  });

  function getHankeWithAlueetFilteredByDates(
    hankeData: HankeData,
    forTaydennys: boolean = false,
    forMuutosilmoitus: boolean = false,
  ): HankeData {
    let alueet: HankeAlue[] = [];
    // Only return alueet if the hanke is not generated
    if (!hankeData.generated) {
      if (forTaydennys) {
        alueet = filterHankeAlueetForTaydennys(hankeData.alueet);
      } else if (forMuutosilmoitus) {
        alueet = filterHankeAlueetForMuutosilmoitus(hankeData.alueet);
      } else {
        alueet = filterHankeAlueet(hankeData.alueet);
      }
    }
    return {
      ...hankeData,
      alueet,
    };
  }

  const hakemusContent = (
    <>
      <Box mb="var(--spacing-s)">
        <OwnHankeMapHeader hankeTunnus={hanke.hankeTunnus} showLink={false} />
        <OwnHankeMap hanke={getHankeWithAlueetFilteredByDates(hanke)} tyoalueet={tyoalueet} />
      </Box>
      {applicationType === 'CABLE_REPORT' && (
        <TyoalueetList
          tyoalueet={tyoalueet}
          startTime={applicationData.startTime}
          endTime={applicationData.endTime}
        />
      )}
      {applicationType === 'EXCAVATION_NOTIFICATION' && (
        <KaivuilmoitusAlueet
          kaivuilmoitusAlueet={kaivuilmoitusAlueet}
          hanke={hanke}
          applicationData={applicationData as KaivuilmoitusData}
        />
      )}
    </>
  );

  if (taydennys || muutosilmoitus) {
    return (
      <AreaTabs
        hanke={getHankeWithAlueetFilteredByDates(
          hanke,
          Boolean(taydennys),
          Boolean(muutosilmoitus),
        )}
        applicationType={applicationType}
        taydennys={taydennys}
        muutosilmoitus={muutosilmoitus}
        originalHakemusContent={hakemusContent}
      />
    );
  }

  return hakemusContent;
}
