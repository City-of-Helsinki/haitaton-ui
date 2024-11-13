import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  FormSummarySection,
  SectionItemContent,
  SectionItemContentRemoved,
  SectionItemTitle,
  SectionTitle,
} from '../../../../forms/components/FormSummarySection';
import { JohtoselvitysData } from '../../../types/application';

type Props = {
  data: JohtoselvitysData;
  originalData: JohtoselvitysData;
  muutokset: string[];
  children?: React.ReactNode;
};

export default function BasicInformationSummary({
  data,
  originalData,
  muutokset,
  children,
}: Readonly<Props>) {
  const { t } = useTranslation();
  const { name, workDescription, rockExcavation, postalAddress } = data;

  const nameChanged = muutokset.includes('name');
  const postalAddressChanged = muutokset.includes('postalAddress');
  const workIsAboutChanged: string[] = muutokset.filter((muutos) =>
    ['constructionWork', 'maintenanceWork', 'emergencyWork', 'propertyConnectivity'].includes(
      muutos,
    ),
  );
  const workIsAboutRemoved: string[] = workIsAboutChanged.filter(
    (muutos) => !data[muutos as keyof JohtoselvitysData],
  );
  const workIsAboutChangedButNotRemoved = workIsAboutChanged.filter(
    (muutos) => !workIsAboutRemoved.includes(muutos),
  );
  const rockExcavationChanged = muutokset.includes('rockExcavation');
  const workDescriptionChanged = muutokset.includes('workDescription');

  if (
    !nameChanged &&
    !postalAddressChanged &&
    !workIsAboutChanged.length &&
    !rockExcavationChanged &&
    !workDescriptionChanged
  ) {
    return null;
  }

  return (
    <>
      <SectionTitle>{t('hankeForm:perustiedotForm:header')}</SectionTitle>
      <FormSummarySection>
        {nameChanged && (
          <>
            <SectionItemTitle>{t('hakemus:labels:nimi')}</SectionItemTitle>
            {!name ? (
              <SectionItemContentRemoved>
                <p>{originalData.name}</p>
              </SectionItemContentRemoved>
            ) : (
              <SectionItemContent>
                <p>{name}</p>
              </SectionItemContent>
            )}
          </>
        )}
        {postalAddressChanged && (
          <>
            <SectionItemTitle>{t('form:labels:addressInformation')}</SectionItemTitle>
            {!postalAddress?.streetAddress.streetName ? (
              <SectionItemContentRemoved>
                <p>{originalData.postalAddress?.streetAddress.streetName}</p>
              </SectionItemContentRemoved>
            ) : (
              <SectionItemContent>
                <p>{postalAddress?.streetAddress.streetName}</p>
              </SectionItemContent>
            )}
          </>
        )}
        {workIsAboutChanged.length > 0 && (
          <>
            <SectionItemTitle>{t('hakemus:labels:tyossaKyse')}</SectionItemTitle>
            <SectionItemContent>
              {workIsAboutChangedButNotRemoved.length > 0 && (
                <>
                  {workIsAboutChangedButNotRemoved.map((changed) => (
                    <p key={changed}>{t(`hakemus:labels:${changed}`)}</p>
                  ))}
                </>
              )}
              {workIsAboutRemoved.length > 0 && (
                <SectionItemContentRemoved>
                  {workIsAboutRemoved.map((removed) => (
                    <p key={removed}>{t(`hakemus:labels:${removed}`)}</p>
                  ))}
                </SectionItemContentRemoved>
              )}
            </SectionItemContent>
          </>
        )}
        {rockExcavationChanged && (
          <>
            <SectionItemTitle>
              <p>{t('hakemus:labels:rockExcavationShort')}</p>
            </SectionItemTitle>
            <SectionItemContent>
              <p>{rockExcavation ? t('common:yes') : t('common:no')}</p>
            </SectionItemContent>
          </>
        )}
        {workDescriptionChanged && (
          <>
            <SectionItemTitle>{t('hakemus:labels:kuvaus')}</SectionItemTitle>
            {!workDescription ? (
              <SectionItemContentRemoved>
                <p style={{ whiteSpace: 'pre-wrap' }}>{originalData.workDescription}</p>
              </SectionItemContentRemoved>
            ) : (
              <SectionItemContent>
                <p style={{ whiteSpace: 'pre-wrap' }}>{workDescription}</p>
              </SectionItemContent>
            )}
          </>
        )}
        {children}
      </FormSummarySection>
    </>
  );
}
