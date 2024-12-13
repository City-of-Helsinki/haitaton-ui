import { useTranslation } from 'react-i18next';
import { Box } from '@chakra-ui/layout';
import { Tab, TabList, TabPanel, Tabs } from 'hds-react';
import { Application, ApplicationArea, KaivuilmoitusAlue } from '../types/application';
import { getAreaDefaultName } from '../utils';
import { getAreaGeometry } from '../../johtoselvitys/utils';
import Text from '../../../common/components/text/Text';
import { formatSurfaceArea } from '../../map/utils';
import ApplicationDates from '../components/ApplicationDates';
import OwnHankeMapHeader from '../../map/components/OwnHankeMap/OwnHankeMapHeader';
import OwnHankeMap from '../../map/components/OwnHankeMap/OwnHankeMap';
import useFilterHankeAlueetByApplicationDates from '../hooks/useFilterHankeAlueetByApplicationDates';
import { HankeData } from '../../types/hanke';
import CustomAccordion from '../../../common/components/customAccordion/CustomAccordion';

type SidebarTyoalueetProps = {
  tyoalueet: ApplicationArea[];
  startTime: Date | null;
  endTime: Date | null;
};

function SidebarTyoalueet({ tyoalueet, startTime, endTime }: Readonly<SidebarTyoalueetProps>) {
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

type SidebarProps = {
  hanke: HankeData;
  application: Application;
};

export default function Sidebar({ hanke, application }: Readonly<SidebarProps>) {
  const { t } = useTranslation();
  const { applicationType, applicationData, taydennys } = application;
  const tyoalueet =
    applicationType === 'CABLE_REPORT'
      ? (applicationData.areas as ApplicationArea[])
      : (applicationData.areas as KaivuilmoitusAlue[]).flatMap((area) => area.tyoalueet);
  const taydennysTyoalueet =
    applicationType === 'CABLE_REPORT'
      ? (application.taydennys?.applicationData.areas as ApplicationArea[] | undefined)
      : (application.taydennys?.applicationData.areas as KaivuilmoitusAlue[] | undefined)?.flatMap(
          (area) => area.tyoalueet,
        );
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

  function getHankeWithAlueetFilteredByDates(hankeData: HankeData): HankeData {
    return {
      ...hankeData,
      alueet: filterHankeAlueet(hankeData.alueet),
    };
  }

  function getHankeWithAlueetFilteredByDatesForTaydennys(hankeData: HankeData): HankeData {
    return {
      ...hankeData,
      alueet: filterHankeAlueetForTaydennys(hankeData.alueet),
    };
  }

  const hakemusContent = (
    <>
      <Box mb="var(--spacing-s)">
        <OwnHankeMapHeader hankeTunnus={hanke.hankeTunnus} showLink={false} />
        <OwnHankeMap hanke={getHankeWithAlueetFilteredByDates(hanke)} tyoalueet={tyoalueet} />
      </Box>
      {applicationType === 'CABLE_REPORT' && (
        <SidebarTyoalueet
          tyoalueet={tyoalueet}
          startTime={applicationData.startTime}
          endTime={applicationData.endTime}
        />
      )}
      {applicationType === 'EXCAVATION_NOTIFICATION' &&
        kaivuilmoitusAlueet?.map((kaivuilmoitusAlue) => {
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
                <SidebarTyoalueet
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

  if (taydennys) {
    return (
      <Tabs>
        <TabList>
          <Tab>{t('taydennys:labels:taydennykset')}</Tab>
          <Tab>{t('taydennys:labels:originalInformation')}</Tab>
        </TabList>
        <TabPanel>
          <Box mt="var(--spacing-s)">
            <Box mb="var(--spacing-s)">
              <OwnHankeMapHeader hankeTunnus={hanke.hankeTunnus} showLink={false} />
              <OwnHankeMap
                hanke={getHankeWithAlueetFilteredByDatesForTaydennys(hanke)}
                tyoalueet={taydennysTyoalueet}
              />
            </Box>
            {applicationType === 'CABLE_REPORT' && (
              <SidebarTyoalueet
                tyoalueet={taydennysTyoalueet ?? []}
                startTime={taydennys.applicationData.startTime}
                endTime={taydennys.applicationData.endTime}
              />
            )}
          </Box>
        </TabPanel>
        <TabPanel>
          <Box mt="var(--spacing-s)">{hakemusContent}</Box>
        </TabPanel>
      </Tabs>
    );
  }

  return hakemusContent;
}
