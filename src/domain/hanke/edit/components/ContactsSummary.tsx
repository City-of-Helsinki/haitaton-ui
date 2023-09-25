import React from 'react';
import { Grid } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { SectionItemContent, SectionItemTitle } from '../../../forms/components/FormSummarySection';
import { HankeContact, HankeMuuTaho, HankeSubContact } from '../../../types/hanke';
import { CONTACT_FORMFIELD } from '../types';

const ContactSummary: React.FC<{ contact: HankeContact | HankeMuuTaho }> = ({ contact }) => {
  const { t } = useTranslation();

  if (CONTACT_FORMFIELD.TYYPPI in contact) {
    return (
      <div style={{ marginBottom: 'var(--spacing-s)' }}>
        <p>{t(`form:yhteystiedot:contactType:${contact.tyyppi}`)}</p>
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

const SubContactSummary: React.FC<{ contact: HankeSubContact }> = ({
  contact: { etunimi, sukunimi, email, puhelinnumero },
}) => {
  return (
    <div>
      <p>
        {etunimi} {sukunimi}
      </p>
      <p>{email}</p>
      <p>{puhelinnumero}</p>
    </div>
  );
};

const ContactsSummary: React.FC<{ contacts: HankeContact[] | HankeMuuTaho[]; title: string }> = ({
  contacts,
  title,
}) => {
  const { t } = useTranslation();

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
                    <strong>{t('form:yhteystiedot:titles:subContacts')}</strong>
                  </h3>
                  <Grid
                    templateColumns="repeat(auto-fit, minmax(280px, 290px))"
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

export default ContactsSummary;
