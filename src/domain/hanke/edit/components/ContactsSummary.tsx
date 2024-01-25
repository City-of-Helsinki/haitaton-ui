import React from 'react';
import { Grid } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { SectionItemContent, SectionItemTitle } from '../../../forms/components/FormSummarySection';
import { HankeYhteystieto, HankeMuuTaho, HankeYhteyshenkilo } from '../../../types/hanke';
import { CONTACT_FORMFIELD } from '../types';

const ContactSummary: React.FC<{ contact: HankeYhteystieto | HankeMuuTaho }> = ({ contact }) => {
  const { t } = useTranslation();

  if (CONTACT_FORMFIELD.TYYPPI in contact) {
    return (
      <div style={{ marginBottom: 'var(--spacing-s)' }}>
        {contact.tyyppi !== null && <p>{t(`form:yhteystiedot:contactType:${contact.tyyppi}`)}</p>}
        <p>{contact.nimi}</p>
        <p>{contact.ytunnus}</p>
        <p>{contact.email}</p>
        <p>{contact.puhelinnumero}</p>
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

const SubContactSummary: React.FC<{ contact: HankeYhteyshenkilo }> = ({
  contact: { etunimi, sukunimi, sahkoposti, puhelinnumero },
}) => {
  return (
    <div>
      <p>
        {etunimi} {sukunimi}
      </p>
      <p>{sahkoposti}</p>
      <p>{puhelinnumero}</p>
    </div>
  );
};

const ContactsSummary: React.FC<{
  contacts: HankeYhteystieto[] | HankeMuuTaho[];
  title: string;
}> = ({ contacts, title }) => {
  const { t } = useTranslation();

  return (
    <>
      <SectionItemTitle>{title}</SectionItemTitle>
      <SectionItemContent>
        {contacts.map((contact) => {
          return (
            <React.Fragment key={contact.email}>
              <ContactSummary contact={contact} />
              {contact.yhteyshenkilot && contact.yhteyshenkilot?.length > 0 && (
                <>
                  <h3 style={{ marginBottom: 'var(--spacing-xs)' }}>
                    <strong>{t('form:yhteystiedot:titles:subContacts')}</strong>
                  </h3>
                  <Grid
                    templateColumns="repeat(auto-fit, minmax(280px, 290px))"
                    gap={15}
                    justifyContent="start"
                    alignItems="start"
                  >
                    {contact.yhteyshenkilot?.map((yhteyshenkilo) => {
                      return (
                        <SubContactSummary key={yhteyshenkilo.sahkoposti} contact={yhteyshenkilo} />
                      );
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

export default ContactsSummary;
