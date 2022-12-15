import React from 'react';
import { Box, Grid } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { getArea } from 'ol/sphere';
import { formatToFinnishDate } from '../../../common/utils/date';
import {
  FormSummarySection,
  SectionTitle,
  SectionItemContent,
  SectionItemTitle,
} from '../../forms/components/FormSummarySection';
import { CONTACT_FORMFIELD, FORMFIELD, HankeAlueFormState, HankeDataFormState } from './types';
import { formatSurfaceArea } from '../../map/utils';
import { HankeContact, HankeMuuTaho, HankeSubContact } from '../../types/hanke';
import { getAreasMaxEndDate, getAreasMinStartDate } from './utils';

const AreaSummary: React.FC<{ area: HankeAlueFormState; index: number }> = ({ area, index }) => {
  const { t } = useTranslation();

  const areaGeometry = area?.feature?.getGeometry();
  const surfaceArea = areaGeometry && formatSurfaceArea(areaGeometry);

  return (
    <div style={{ marginBottom: 'var(--spacing-m)' }}>
      <p style={{ marginBottom: 'var(--spacing-s)' }}>
        <strong>
          {t('hankeForm:hankkeenAlueForm:area')} {index + 1}
        </strong>
      </p>
      <p>
        {t('form:labels:pintaAla')}: {surfaceArea}
      </p>
      <p>
        Ajanjakso: {formatToFinnishDate(area.haittaAlkuPvm)}–
        {formatToFinnishDate(area.haittaLoppuPvm)}
      </p>
      <p>
        {t(`hankeForm:labels:${FORMFIELD.MELUHAITTA}`)}:{' '}
        {t(`hanke:${FORMFIELD.MELUHAITTA}:${area.meluHaitta}`)}
      </p>
      <p>
        {t(`hankeForm:labels:${FORMFIELD.POLYHAITTA}`)}:{' '}
        {t(`hanke:${FORMFIELD.POLYHAITTA}:${area.polyHaitta}`)}
      </p>
      <p>
        {t(`hankeForm:labels:${FORMFIELD.TARINAHAITTA}`)}:{' '}
        {t(`hanke:${FORMFIELD.TARINAHAITTA}:${area.tarinaHaitta}`)}
      </p>
      <p>
        {t(`hankeForm:labels:${FORMFIELD.KAISTAHAITTA}`)}:{' '}
        {t(`hanke:${FORMFIELD.KAISTAHAITTA}:${area.kaistaHaitta}`)}
      </p>
      <p>
        {t(`hankeForm:labels:${FORMFIELD.KAISTAPITUUSHAITTA}`)}:{' '}
        {t(`hanke:${FORMFIELD.KAISTAPITUUSHAITTA}:${area.kaistaPituusHaitta}`)}
      </p>
    </div>
  );
};

const ContactSummary: React.FC<{ contact: HankeContact | HankeMuuTaho }> = ({ contact }) => {
  const { t } = useTranslation();

  if (CONTACT_FORMFIELD.TYYPPI in contact) {
    return (
      <div style={{ marginBottom: 'var(--spacing-s)' }}>
        <p>{t(`form:yhteystiedot:contactType:${contact.tyyppi}`)}</p>
        <p>{contact.nimi}</p>
        <p>{contact.ytunnusTaiHetu}</p>
        {contact.osoite && <p>{contact.osoite}</p>}
        <p>
          <span>{contact.postinumero}</span>
          <span>{contact.postitoimipaikka}</span>
        </p>
      </div>
    );
  }

  return (
    <div style={{ marginBottom: 'var(--spacing-s)' }}>
      <p>{contact.rooli}</p>
      <p>{contact.nimi}</p>
      <p>{contact.email}</p>
      <p>{contact.organisaatioNimi}</p>
      <p>{contact.osasto}</p>
    </div>
  );
};

const SubContactSummary: React.FC<{ contact: HankeSubContact }> = ({ contact }) => {
  return (
    <div>
      <p>{contact.nimi}</p>
      <p>{contact.email}</p>
      {contact.osoite && <p>{contact.osoite}</p>}
      <p>
        <span>{contact.postinumero}</span>&nbsp;
        <span>{contact.postitoimipaikka}</span>
      </p>
    </div>
  );
};

const ContactsSummary: React.FC<{ contacts: HankeContact[] | HankeMuuTaho[]; title: string }> = ({
  contacts,
  title,
}) => {
  return (
    <>
      <SectionItemTitle>{title}</SectionItemTitle>
      <SectionItemContent>
        {contacts.map((contact) => {
          return (
            <React.Fragment key={contact.email}>
              <ContactSummary contact={contact} />
              {contact.alikontaktit && contact.alikontaktit?.length > 0 && (
                <>
                  <h3 style={{ marginBottom: 'var(--spacing-xs)' }}>
                    <strong>Yhteyshenkilöt</strong>
                  </h3>
                  <Grid
                    templateColumns="repeat(auto-fit, minmax(250px, 300px))"
                    gap={15}
                    justifyContent="start"
                    alignItems="start"
                  >
                    {contact.alikontaktit?.map((alikontakti) => {
                      return <SubContactSummary key={alikontakti.email} contact={alikontakti} />;
                    })}
                  </Grid>
                </>
              )}
            </React.Fragment>
          );
        })}
      </SectionItemContent>
    </>
  );
};

type Props = {
  formData: HankeDataFormState;
};

const HankeFormSummary: React.FC<Props> = ({ formData }) => {
  const { t } = useTranslation();

  const hankeAreas = formData[FORMFIELD.HANKEALUEET];
  const minAreaStartDate = getAreasMinStartDate(hankeAreas);
  const maxAreaEndDate = getAreasMaxEndDate(hankeAreas);
  let startDate;
  let endDate;
  try {
    startDate = minAreaStartDate && formatToFinnishDate(minAreaStartDate.toISOString());
    endDate = maxAreaEndDate && formatToFinnishDate(maxAreaEndDate.toISOString());
    // eslint-disable-next-line no-empty
  } catch (error) {}

  const areasTotalSurfaceArea = formData.alueet?.reduce((surfaceArea, currArea) => {
    const geom = currArea?.feature?.getGeometry();
    const currAreaSurface: number = geom ? Math.round(getArea(geom)) : 0;
    return surfaceArea + currAreaSurface;
  }, 0);

  return (
    <article>
      <Box mb="var(--spacing-l)">
        <p>{t('hankeForm:hankkeenYhteenvetoForm:instructions')}</p>
      </Box>

      <SectionTitle>{t('hankeForm:perustiedotForm:header')}</SectionTitle>
      <FormSummarySection>
        <SectionItemTitle>Perustaja</SectionItemTitle>
        <SectionItemContent />
        <SectionItemTitle>{t('hankeForm:labels:nimi')}</SectionItemTitle>
        <SectionItemContent>
          <p>{formData.nimi}</p>
        </SectionItemContent>
        <SectionItemTitle>{t('hankeForm:labels:hankeTunnus')}</SectionItemTitle>
        <SectionItemContent>
          <p>{formData.hankeTunnus}</p>
        </SectionItemContent>
        <SectionItemTitle>{t('hankeForm:labels:kuvaus')}</SectionItemTitle>
        <SectionItemContent>
          <p>{formData.kuvaus}</p>
        </SectionItemContent>
        <SectionItemTitle>{t('hankeForm:labels:tyomaaKatuosoite')}</SectionItemTitle>
        <SectionItemContent>
          <p>{formData.tyomaaKatuosoite}</p>
        </SectionItemContent>
        <SectionItemTitle>{t('hankeForm:labels:alkuPvm')}</SectionItemTitle>
        <SectionItemContent>
          <p>{startDate}</p>
        </SectionItemContent>
        <SectionItemTitle>{t('hankeForm:labels:loppuPvm')}</SectionItemTitle>
        <SectionItemContent>
          <p>{endDate}</p>
        </SectionItemContent>
        <SectionItemTitle>{t('hankeForm:labels:vaihe')}</SectionItemTitle>
        <SectionItemContent>
          <p>{t(`hanke:vaihe:${formData.vaihe}`)}</p>
        </SectionItemContent>
        <SectionItemTitle>{t('hankeForm:labels:tyomaaTyyppi')}</SectionItemTitle>
        <SectionItemContent>
          <p>
            {formData.tyomaaTyyppi?.map((tyyppi) => t(`hanke:tyomaaTyyppi:${tyyppi}`)).join(', ')}
          </p>
        </SectionItemContent>
        <SectionItemTitle>{t('hankeForm:labels:tyomaaKoko')}</SectionItemTitle>
        <SectionItemContent>
          <p>{formData.tyomaaKoko && <>{t(`hanke:tyomaaKoko:${formData.tyomaaKoko}`)}</>}</p>
        </SectionItemContent>
        <SectionItemTitle>{t('hankeForm:labels:onYKTHanke')}</SectionItemTitle>
        <SectionItemContent>
          <p>{formData.onYKTHanke ? t('common:yes') : t('common:no')}</p>
        </SectionItemContent>
      </FormSummarySection>

      <SectionTitle>{t('hankeForm:hankkeenAlueForm:header')}</SectionTitle>
      <FormSummarySection>
        <SectionItemTitle>Alueiden kokonaispinta-ala</SectionItemTitle>
        <SectionItemContent>
          {areasTotalSurfaceArea && <p>{areasTotalSurfaceArea} m²</p>}
        </SectionItemContent>
        <SectionItemTitle>{t('hankeForm:hankkeenAlueForm:header')}</SectionItemTitle>
        <SectionItemContent>
          {formData.alueet?.map((alue, index) => (
            // eslint-disable-next-line react/no-array-index-key
            <AreaSummary key={index} area={alue} index={index} />
          ))}
        </SectionItemContent>
      </FormSummarySection>

      <SectionTitle>{t('form:yhteystiedot:header')}</SectionTitle>
      <FormSummarySection>
        {formData.omistajat && formData.omistajat.length > 0 && (
          <ContactsSummary contacts={formData.omistajat} title="Hankkeen omistaja" />
        )}
        {formData.rakennuttajat?.length > 0 && (
          <ContactsSummary contacts={formData.rakennuttajat} title="Rakennuttajat" />
        )}
        {formData.toteuttajat?.length > 0 && (
          <ContactsSummary contacts={formData.toteuttajat} title="Toteuttajat" />
        )}
        {formData.muut?.length > 0 && (
          <ContactsSummary contacts={formData.muut} title="Muut tahot" />
        )}
      </FormSummarySection>
    </article>
  );
};

export default HankeFormSummary;
