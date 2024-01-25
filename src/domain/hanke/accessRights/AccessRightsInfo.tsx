import { Accordion } from 'hds-react';
import { Language } from '../../../common/types/language';
import { Trans, useTranslation } from 'react-i18next';
import styles from './AccessRightsInfo.module.scss';

function AccessRightsInfo() {
  const { t, i18n } = useTranslation();
  return (
    <Accordion
      className={styles.infoAccordion}
      language={i18n.language as Language}
      heading={t('hankeUsers:accessRightsInfo:heading')}
    >
      <ul className={styles.infoList}>
        <li>
          <Trans i18nKey="hankeUsers:accessRightsInfo:KAIKKI_OIKEUDET">
            <strong>Kaikki oikeudet</strong> mahdollistaa hankkeen ja sen hakemusten sisällön
            muokkaamisen, kaikkien käyttöoikeuksien muokkaamisen sekä hankkeen poistamisen, kun
            hankkeella ei ole päätöksen saaneita hakemuksia.
          </Trans>
        </li>
        <li>
          <Trans i18nKey="hankeUsers:accessRightsInfo:KAIKKIEN_MUOKKAUS">
            <strong>Hankkeen ja hakemusten muokkaus -oikeus</strong> mahdollistaa hankkeen ja sen
            hakemusten sisällön muokkaamisen ja luonnin sekä muiden käyttöoikeuksien muokkaamisen,
            paitsi “Kaikki oikeudet”, jolla voi poistaa hankkeen.
          </Trans>
        </li>
        <li>
          <Trans i18nKey="hankeUsers:accessRightsInfo:HANKEMUOKKAUS">
            <strong>Hankemuokkaus-oikeus</strong> mahdollistaa hankkeen tietojen muokkaamisen, mutta
            ei käyttöoikeuksien muokkausta. Hakemustietoihin on tällöin katseluoikeudet.
          </Trans>
        </li>
        <li>
          <Trans i18nKey="hankeUsers:accessRightsInfo:HAKEMUSASIOINTI">
            <strong>Hakemusasiointi-oikeus</strong> mahdollistaa uusien hakemusten luomisen
            hankkeelle sekä hankkeen hakemusten tietojen muokkaamisen.
          </Trans>
        </li>
        <li>
          <Trans i18nKey="hankeUsers:accessRightsInfo:KATSELUOIKEUS">
            <strong>Katselu-oikeus</strong> mahdollistaa hankkeen ja sen hakemusten tietojen
            katselun. Katseluoikeus asetetaan automaattisesti kaikille hankkeelle ja hakemukselle
            lisätyille henkilöille.
          </Trans>
        </li>
      </ul>
      <p>{t('hankeUsers:accessRightsInfo:modifyInfo')}</p>
    </Accordion>
  );
}

export default AccessRightsInfo;
