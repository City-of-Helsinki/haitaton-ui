import { Flex } from '@chakra-ui/react';
import React from 'react';
import { Link as HDSLink } from 'hds-react';
import { Trans, useTranslation } from 'react-i18next';
import Link from '../../common/components/Link/Link';
import Text from '../../common/components/text/Text';
import { useLocalizedRoutes } from '../../common/hooks/useLocalizedRoutes';

function NotFoundPage() {
  const { t } = useTranslation();
  const { HOME } = useLocalizedRoutes();

  return (
    <Flex
      as="article"
      flexDirection="column"
      alignItems="center"
      textAlign="center"
      maxWidth="650px"
      mx="auto"
      mt="var(--spacing-3-xl)"
      px="var(--spacing-s)"
    >
      <Text tag="h1" styleAs="h1" weight="bold" spacingBottom="l">
        {t('staticPages:404Page:title')}
      </Text>
      <Text tag="p" spacingBottom="m">
        {t('staticPages:404Page:instruction')}
      </Text>
      <Text tag="p" spacingBottom="m">
        <Trans
          i18nKey="staticPages:404Page:homePageLink"
          components={{
            a: <Link href={HOME.path}>etusivulle</Link>,
          }}
        />
      </Text>
      <Text tag="p" spacingBottom="m">
        <Trans
          i18nKey="staticPages:404Page:supportLink"
          components={{
            a: <HDSLink href="mailto:haitatontuki@hel.fi">haitatontuki@hel.fi</HDSLink>,
          }}
        />
      </Text>
    </Flex>
  );
}

export default NotFoundPage;
