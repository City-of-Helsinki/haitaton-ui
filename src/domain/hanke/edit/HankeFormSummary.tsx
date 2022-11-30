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
            <>
              <ContactSummary contact={contact} />
              {contact.alikontaktit?.length && (
                <>
                  <p style={{ marginBottom: 'var(--spacing-xs)' }}>
                    <strong>Yhteyshenkilöt</strong>
                  </p>
                  <Grid
                    templateColumns="repeat(auto-fit, minmax(250px, 300px))"
                    gap={15}
                    justifyContent="start"
                    alignItems="start"
                  >
                    {contact.alikontaktit?.map((alikontakti) => {
                      return <SubContactSummary contact={alikontakti} />;
                    })}
                  </Grid>
                </>
              )}
            </>
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

  const areasTotalSurfaceArea = formData.alueet?.reduce((surfaceArea, currArea) => {
    const geom = currArea?.feature?.getGeometry();
    const currAreaSurface = geom && Math.round(getArea(geom));
    return currAreaSurface ? surfaceArea + currAreaSurface : surfaceArea;
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
        <SectionItemContent>{formData.nimi}</SectionItemContent>
        <SectionItemTitle>{t('hankeForm:labels:hankeTunnus')}</SectionItemTitle>
        <SectionItemContent>{formData.hankeTunnus}</SectionItemContent>
        <SectionItemTitle>{t('hankeForm:labels:kuvaus')}</SectionItemTitle>
        <SectionItemContent>{formData.kuvaus}</SectionItemContent>
        <SectionItemTitle>{t('hankeForm:labels:tyomaaKatuosoite')}</SectionItemTitle>
        <SectionItemContent>{formData.tyomaaKatuosoite}</SectionItemContent>
        <SectionItemTitle>{t('hankeForm:labels:alkuPvm')}</SectionItemTitle>
        <SectionItemContent>
          {formData.alkuPvm && formatToFinnishDate(formData.alkuPvm)}
        </SectionItemContent>
        <SectionItemTitle>{t('hankeForm:labels:loppuPvm')}</SectionItemTitle>
        <SectionItemContent>
          {formData.loppuPvm && formatToFinnishDate(formData.loppuPvm)}
        </SectionItemContent>
        <SectionItemTitle>{t('hankeForm:labels:vaihe')}</SectionItemTitle>
        <SectionItemContent>{t(`hanke:vaihe:${formData.vaihe}`)}</SectionItemContent>
        <SectionItemTitle>{t('hankeForm:labels:tyomaaTyyppi')}</SectionItemTitle>
        <SectionItemContent>
          {formData.tyomaaTyyppi?.map((tyyppi) => t(`hanke:tyomaaTyyppi:${tyyppi}`)).join(', ')}
        </SectionItemContent>
        <SectionItemTitle>{t('hankeForm:labels:tyomaaKoko')}</SectionItemTitle>
        <SectionItemContent>
          {formData.tyomaaKoko && <>{t(`hanke:tyomaaKoko:${formData.tyomaaKoko}`)}</>}
        </SectionItemContent>
        <SectionItemTitle>{t('hankeForm:labels:onYKTHanke')}</SectionItemTitle>
        <SectionItemContent>
          {formData.onYKTHanke ? t('common:yes') : t('common:no')}
        </SectionItemContent>
      </FormSummarySection>

      <SectionTitle>{t('hankeForm:hankkeenAlueForm:header')}</SectionTitle>
      <FormSummarySection>
        <SectionItemTitle>Alueiden kokonaispinta-ala</SectionItemTitle>
        <SectionItemContent>
          {areasTotalSurfaceArea && <>{areasTotalSurfaceArea} m²</>}
        </SectionItemContent>
        <SectionItemTitle>{t('hankeForm:hankkeenAlueForm:header')}</SectionItemTitle>
        <SectionItemContent>
          {formData.alueet?.map((alue, index) => (
            <AreaSummary area={alue} index={index} />
          ))}
        </SectionItemContent>
      </FormSummarySection>

      <SectionTitle>{t('form:yhteystiedot:header')}</SectionTitle>
      <FormSummarySection>
        {formData.omistajat?.length && formData.omistajat.length > 0 && (
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
