import React, { useState } from 'react';
import { IconDocument, IconInfoCircle, SideNavigation } from 'hds-react';
import styles from './WorkInstructions.module.scss';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLocalizedRoutes } from '../../../common/hooks/useLocalizedRoutes';

const SideNav: React.FC = () => {
  const { t } = useTranslation();
  const [active, setActive] = useState('');
  const navigate = useNavigate();
  const { CARD, WORKINSTRUCTIONS, CARDS_INDEX } = useLocalizedRoutes();

  const setActivePage = (
    event: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>,
    path: string,
  ) => {
    event.preventDefault();
    setActive(path);
    navigate(path);
  };

  const renderCardLevels = () => {
    const cardLevels = [];
    for (let i = 1; i <= 10; i++) {
      cardLevels.push(
        <SideNavigation.MainLevel
          key={`card-${i}`}
          index={i}
          id={`card-${i}`}
          label={`${i}. ${t(`workInstructions:cards:${i}:header`)}`}
        >
          <SideNavigation.SubLevel
            href={`${CARD.path}${i}/perustaso`}
            id={`card-${i}-basic`}
            label={t('workInstructions:cards:basicLevel')}
            mainLevelIndex={i}
            onClick={(e) => setActivePage(e, `${CARD.path}${i}/${t('routes:CARD:basicLevel')}`)}
            active={active === `${CARD.path}${i}/${t('routes:CARD:basicLevel')}`}
          />
          <SideNavigation.SubLevel
            href={`${CARD.path}${i}/lisataso`}
            id={`card-${i}-additional`}
            label={t('workInstructions:cards:additionalLevel')}
            onClick={(e) =>
              setActivePage(e, `${CARD.path}${i}/${t('routes:CARD:additionalLevel')}`)
            }
            active={active === `${CARD.path}${i}/${t('routes:CARD:additionalLevel')}`}
          />
        </SideNavigation.MainLevel>,
      );
    }
    return cardLevels;
  };

  const sideNavItems = [
    <SideNavigation.MainLevel
      key="work-instructions"
      icon={<IconInfoCircle />}
      href={WORKINSTRUCTIONS.path}
      id="#work-instructions"
      label={t('workInstructions:main:header')}
      onClick={(e) => setActivePage(e, WORKINSTRUCTIONS.path)}
      active={active === WORKINSTRUCTIONS.path}
    />,
    <SideNavigation.MainLevel
      key="cards-index"
      icon={<IconDocument />}
      href={CARDS_INDEX.path}
      id="#cards-index"
      label={t('workInstructions:cardsIndex:header')}
      onClick={(e) => setActivePage(e, CARDS_INDEX.path)}
      active={active === CARDS_INDEX.path}
    />,
    ...renderCardLevels(),
    <SideNavigation.MainLevel
      key="external-link"
      external
      href={t('workInstructions:sideNav:externalLinks:permitsAndInstructions:url')}
      openInNewTab
      openInNewTabAriaLabel={t('workInstructions:sideNav:openInNewTab')}
      openInExternalDomainAriaLabel={t('workInstructions:sideNav:openInExternalDomain')}
      id="external-link-permits-and-instructions"
      label={t('workInstructions:sideNav:externalLinks:permitsAndInstructions:label')}
      withDivider
    />,
    <SideNavigation.MainLevel
      external
      href={t('workInstructions:sideNav:externalLinks:payments:url')}
      openInNewTab
      openInNewTabAriaLabel={t('workInstructions:sideNav:openInNewTab')}
      openInExternalDomainAriaLabel={t('workInstructions:sideNav:openInExternalDomain')}
      id="external-link-payments"
      label={t('workInstructions:sideNav:externalLinks:payments:label')}
    />,
    <SideNavigation.MainLevel
      external
      href={t('workInstructions:sideNav:externalLinks:temporaryTrafficArrangement:url')}
      openInNewTab
      openInNewTabAriaLabel={t('workInstructions:sideNav:openInNewTab')}
      openInExternalDomainAriaLabel={t('workInstructions:sideNav:openInExternalDomain')}
      id="external-link-temporary-traffic-arrangement"
      label={t('workInstructions:sideNav:externalLinks:temporaryTrafficArrangement:label')}
    />,
  ];

  return (
    <div className={styles.sidenavcontainer}>
      <SideNavigation
        defaultOpenMainLevels={[1]}
        id="side-navigation"
        toggleButtonLabel={t('workInstructions:sideNav:moveToPage')}
      >
        {sideNavItems}
      </SideNavigation>
    </div>
  );
};

export default SideNav;
