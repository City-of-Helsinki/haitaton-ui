import React, { useEffect } from 'react';
import MainHeading from '../../../common/components/mainHeading/MainHeading';
import { Trans, useTranslation } from 'react-i18next';
import { BREADCRUMBS, useBreadcrumbs } from '../Breadcrumbs';
import { Link } from 'hds-react';
import styles from '../StaticContent.module.scss';
const WorkInstructionsMain: React.FC = () => {
  const { t } = useTranslation();
  const { setBreadcrumbs } = useBreadcrumbs();

  useEffect(() => {
    const updateBreadcrumbs = () => setBreadcrumbs([BREADCRUMBS.tyoOhjeet]);

    updateBreadcrumbs();
  }, [setBreadcrumbs]);
  return (
    <>
      <MainHeading spacingBottom="xl">{t('workInstructions:main:header')}</MainHeading>

      <div className={styles.content}>
        <Trans
          i18nKey="workInstructions:main:content"
          components={{
            p: <p />,
            a: (
              <Link
                href={t('workInstructions:sideNav:externalLinks:permitsAndInstructions:url')}
                external
                openInNewTab
                openInNewTabAriaLabel={t('common:components:link:openInNewTabAriaLabel')}
                openInExternalDomainAriaLabel={t(
                  'common:components:link:openInExternalDomainAriaLabel',
                )}
                style={{ fontSize: 'var(--fontsize-body-l)' }}
              >
                linktext
              </Link>
            ),
          }}
        >
          <p>
            Haitaton tarjoaa hanke- ja hakemuslomakkeiden haittojenhallinnan täyttösivulla käyttäjän
            avuksi toimenpidevinkkejä, joissa esitetään kootusti mm. tärkeitä aikamääreitä ennakkoon
            tehtäviin yhteydenottoihin ja neuvotteluihin.
          </p>
          <br />
          <p>
            Tälle sivustolle on koottu lisätietokortteja, jotka täydentävät osaa haittojenhallinnan
            toimenpidevinkeistä sekä antavat lisätason ideoita perustasoa laadukkaamman työmaan
            toteutukseen kolmansien osapuolten kannalta.
          </p>
          <br />
          <p>Viralliset työohjeet löytyvät Helsingin kaupungin sivuilta osoitteesta</p>
          <a href={t('workInstructions:sideNav:externalLinks:permitsAndInstructions:url')}>
            Työmaan luvat ja ohjeet (hel.fi)
          </a>
        </Trans>
      </div>
    </>
  );
};

export default WorkInstructionsMain;
