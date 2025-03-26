import React, { useEffect, useState } from 'react';
import { IconInfoCircle, SideNavigation } from 'hds-react';
import styles from '../StaticContent.module.scss';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLocalizedRoutes } from '../../../common/hooks/useLocalizedRoutes';

const SideNav: React.FC = () => {
  const { t } = useTranslation();
  const [active, setActive] = useState('');
  const navigate = useNavigate();
  const { MANUAL, GLOSSARY } = useLocalizedRoutes();
  const { id = '' } = useParams<{ id: string }>();

  useEffect(() => {
    setActive(window.location.pathname);
  }, [id]);

  const setActivePage = (
    event: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>,
    path: string,
  ) => {
    event.preventDefault();
    setActive(path);
    navigate(path);
  };

  return (
    <div className={styles.sidenavcontainer}>
      <SideNavigation
        defaultOpenMainLevels={[1]}
        id="side-navigation"
        toggleButtonLabel={t('common:components:moveToPage')}
      >
        <SideNavigation.MainLevel
          icon={<IconInfoCircle />}
          href={MANUAL.path}
          id="#main"
          label={t('staticPages:manualPage:main:heading')}
          onClick={(e) => setActivePage(e, MANUAL.path)}
          active={active === MANUAL.path}
        />
        <SideNavigation.MainLevel
          id="#periaatteet"
          label={t('staticPages:manualPage:periaatteet:heading')}
          href={`${MANUAL.path}/periaatteet`}
          onClick={(e) => setActivePage(e, `${MANUAL.path}/periaatteet`)}
          active={active === `${MANUAL.path}/periaatteet`}
        />
        <SideNavigation.MainLevel
          id="#asioinninToimintokokonaisuudet"
          label={t('staticPages:manualPage:asioinninToimintokokonaisuudet:heading')}
          href={`${MANUAL.path}/asioinninToimintokokonaisuudet`}
          onClick={(e) => setActivePage(e, `${MANUAL.path}/asioinninToimintokokonaisuudet`)}
          active={active === `${MANUAL.path}/asioinninToimintokokonaisuudet`}
        />
        <SideNavigation.MainLevel
          id="#asioinninKulku"
          label={t('staticPages:manualPage:asioinninKulku:heading')}
          href={`${MANUAL.path}/asioinninKulku`}
          onClick={(e) => setActivePage(e, `${MANUAL.path}/asioinninKulku`)}
          active={active === `${MANUAL.path}/asioinninKulku`}
        >
          <SideNavigation.SubLevel
            id="#hankkeenPerustaminen"
            href={`${MANUAL.path}/hankkeenPerustaminen`}
            label={t('staticPages:manualPage:hankkeenPerustaminen:heading')}
            onClick={(e) => setActivePage(e, `${MANUAL.path}/hankkeenPerustaminen`)}
            active={active === `${MANUAL.path}/hankkeenPerustaminen`}
          />
          <SideNavigation.SubLevel
            id="#hakemuksienTekeminen"
            href={`${MANUAL.path}/hakemuksienTekeminen`}
            label={t('staticPages:manualPage:hakemuksienTekeminen:heading')}
            onClick={(e) => setActivePage(e, `${MANUAL.path}/hakemuksienTekeminen`)}
            active={active === `${MANUAL.path}/hakemuksienTekeminen`}
          />
          <SideNavigation.SubLevel
            id="#tyonSeuranta"
            href={`${MANUAL.path}/tyonSeuranta`}
            label={t('staticPages:manualPage:tyonSeuranta:heading')}
            onClick={(e) => setActivePage(e, `${MANUAL.path}/tyonSeuranta`)}
            active={active === `${MANUAL.path}/tyonSeuranta`}
          />
          <SideNavigation.SubLevel
            id="#taydennyspyynto"
            href={`${MANUAL.path}/taydennyspyynto`}
            label={t('staticPages:manualPage:taydennyspyynto:heading')}
            onClick={(e) => setActivePage(e, `${MANUAL.path}/taydennyspyynto`)}
            active={active === `${MANUAL.path}/taydennyspyynto`}
          />
          <SideNavigation.SubLevel
            id="#muutosilmoitus"
            href={`${MANUAL.path}/muutosilmoitus`}
            label={t('staticPages:manualPage:muutosilmoitus:heading')}
            onClick={(e) => setActivePage(e, `${MANUAL.path}/muutosilmoitus`)}
            active={active === `${MANUAL.path}/muutosilmoitus`}
          />
          <SideNavigation.SubLevel
            id="#johtoselvitys"
            href={`${MANUAL.path}/johtoselvitys`}
            label={t('staticPages:manualPage:johtoselvitys:heading')}
            onClick={(e) => setActivePage(e, `${MANUAL.path}/johtoselvitys`)}
            active={active === `${MANUAL.path}/johtoselvitys`}
          />
        </SideNavigation.MainLevel>
        <SideNavigation.MainLevel
          id="#hankkeenJaHakemuksenTilat"
          href={`${MANUAL.path}/hankkeenJaHakemuksenTilat`}
          label={t('staticPages:manualPage:hankkeenJaHakemuksenTilat:heading')}
          onClick={(e) => setActivePage(e, `${MANUAL.path}/hankkeenJaHakemuksenTilat`)}
          active={active === `${MANUAL.path}/hankkeenJaHakemuksenTilat`}
        />
        <SideNavigation.MainLevel
          id="#haittaindeksit"
          label={t('staticPages:manualPage:haittaindeksit:heading')}
          href={`${MANUAL.path}/haittaindeksit`}
          onClick={(e) => setActivePage(e, `${MANUAL.path}/haittaindeksit`)}
          active={active === `${MANUAL.path}/haittaindeksit`}
        >
          <SideNavigation.SubLevel
            id="#laskentaperiaatteet"
            href={`${MANUAL.path}/laskentaperiaatteet`}
            label={t('staticPages:manualPage:laskentaperiaatteet:heading')}
            onClick={(e) => setActivePage(e, `${MANUAL.path}/laskentaperiaatteet`)}
            active={active === `${MANUAL.path}/laskentaperiaatteet`}
          />
          <SideNavigation.SubLevel
            id="#laatiminen"
            href={`${MANUAL.path}/laatiminen`}
            label={t('staticPages:manualPage:laatiminen:heading')}
            onClick={(e) => setActivePage(e, `${MANUAL.path}/laatiminen`)}
            active={active === `${MANUAL.path}/laatiminen`}
          />
        </SideNavigation.MainLevel>
        <SideNavigation.MainLevel
          id="#yhteyshenkilot"
          href={`${MANUAL.path}/yhteyshenkilot`}
          label={t('staticPages:manualPage:yhteyshenkilot:heading')}
          onClick={(e) => setActivePage(e, `${MANUAL.path}/yhteyshenkilot`)}
          active={active === `${MANUAL.path}/yhteyshenkilot`}
        >
          <SideNavigation.SubLevel
            id="#kutsunSaaminen"
            href={`${MANUAL.path}/kutsunSaaminen`}
            label={t('staticPages:manualPage:kutsunSaaminen:heading')}
            onClick={(e) => setActivePage(e, `${MANUAL.path}/kutsunSaaminen`)}
            active={active === `${MANUAL.path}/kutsunSaaminen`}
          />
          <SideNavigation.SubLevel
            id="#kayttooikeustasot"
            href={`${MANUAL.path}/kayttooikeustasot`}
            label={t('staticPages:manualPage:kayttooikeustasot:heading')}
            onClick={(e) => setActivePage(e, `${MANUAL.path}/kayttooikeustasot`)}
            active={active === `${MANUAL.path}/kayttooikeustasot`}
          />
        </SideNavigation.MainLevel>
        <SideNavigation.MainLevel
          id="#sahkopostiheratteet"
          label={t('staticPages:manualPage:sahkopostiheratteet:heading')}
          href={`${MANUAL.path}/sahkopostiheratteet`}
          onClick={(e) => setActivePage(e, `${MANUAL.path}/sahkopostiheratteet`)}
          active={active === `${MANUAL.path}/sahkopostiheratteet`}
        />
        <SideNavigation.MainLevel
          href={GLOSSARY.path}
          id="#glossary"
          label={t('staticPages:manualPage:glossary:heading')}
          onClick={(e) => setActivePage(e, GLOSSARY.path)}
          active={active === GLOSSARY.path}
        />
      </SideNavigation>
    </div>
  );
};
export default SideNav;
