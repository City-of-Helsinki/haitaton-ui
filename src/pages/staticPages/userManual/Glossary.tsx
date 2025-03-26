import React, { useEffect, useState } from 'react';
import MainHeading from '../../../common/components/mainHeading/MainHeading';
import { Trans, useTranslation } from 'react-i18next';
import styles from '../StaticContent.module.scss';
import { BREADCRUMBS, useBreadcrumbs } from '../Breadcrumbs';
import { Accordion, Button, IconAngleDown, IconAngleUp } from 'hds-react';
import { Flex } from '@chakra-ui/react';
import useLocale from '../../../common/hooks/useLocale';

interface Word {
  term: string;
  definition: string;
}

const Glossary: React.FC = () => {
  const { t } = useTranslation();
  const locale = useLocale();
  const { setBreadcrumbs } = useBreadcrumbs();
  const [isAllOpen, setIsAllOpen] = useState(false);

  useEffect(() => {
    const updateBreadcrumbs = () => setBreadcrumbs([BREADCRUMBS.manual, BREADCRUMBS.glossary]);

    updateBreadcrumbs();
  }, [setBreadcrumbs]);

  const words: Word[] = t('staticPages:manualPage:glossary:words', {
    returnObjects: true,
  });

  const queryExpanded = 'div[role="button"][aria-expanded="true"]';
  const queryClosed = 'div[role="button"][aria-expanded="false"]';
  const buttonText = isAllOpen
    ? t('staticPages:manualPage:glossary:closeAll')
    : t('staticPages:manualPage:glossary:openAll');
  const buttonIcon = isAllOpen ? <IconAngleUp /> : <IconAngleDown />;
  const translationComponents = {
    p: <p />,
    br: <br />,
    ol: <ol style={{ listStylePosition: 'inside' }} />,
    ul: <ul style={{ listStylePosition: 'inside' }} />,
    li: <li />,
    span: <span />,
    a: (
      <a
        className="hds-link hds-link--medium"
        aria-label={`${t('common:components:link:openInNewTabAriaLabel')} ${t('common:components:link:openInExternalDomainAriaLabel')}`}
        target="_blank"
      >
        External link
      </a>
    ),
  };

  const toggleAll = (allOpen: boolean): void => {
    if (allOpen) {
      document.querySelectorAll(queryExpanded).forEach((el) => {
        (el as HTMLElement).click();
      });
      setIsAllOpen(false);
    } else {
      document.querySelectorAll(queryClosed).forEach((el) => {
        (el as HTMLElement).click();
      });
      setIsAllOpen(true);
    }
  };

  const handleAccordionClick = (allOpen: boolean): void => {
    setTimeout(() => {
      const openCount = document.querySelectorAll(queryExpanded).length;
      const closedCount = document.querySelectorAll(queryClosed).length;

      if (!allOpen && closedCount === 0) {
        setIsAllOpen(true);
      } else if (allOpen && openCount === 0) {
        setIsAllOpen(false);
      } else if (allOpen && closedCount > 0) {
        setIsAllOpen(false);
      }
    }, 100);
  };

  return (
    <>
      <MainHeading spacingBottom="xl">{t('staticPages:manualPage:glossary:heading')}</MainHeading>
      <div className={styles.content}>
        <Flex direction="column">
          <Flex justify="right">
            <Button
              size="small"
              variant="supplementary"
              iconRight={buttonIcon}
              theme="black"
              onClick={() => toggleAll(isAllOpen)}
            >
              {buttonText}
            </Button>
          </Flex>
          {words.map((word) => (
            <Accordion
              language={locale}
              heading={word.term}
              key={word.term}
              onClick={() => handleAccordionClick(isAllOpen)}
            >
              <p>
                <Trans i18nKey={word.definition} components={translationComponents} />
              </p>
            </Accordion>
          ))}
        </Flex>
      </div>
    </>
  );
};

export default Glossary;
