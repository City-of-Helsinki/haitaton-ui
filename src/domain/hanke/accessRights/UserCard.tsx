import React from 'react';
import { Card } from 'hds-react';
import { HankeUser } from '../hankeUsers/hankeUser';
import Text from '../../../common/components/text/Text';
import { Flex } from '@chakra-ui/react';

type Props = {
  user: HankeUser;
  children?: React.ReactNode;
  headingIcon?: React.ReactNode;
};

function UserCard({ user, children, headingIcon }: Readonly<Props>) {
  return (
    <Card border style={{ marginBottom: 'var(--spacing-m)' }}>
      <Flex marginBottom="var(--spacing-s)">
        {headingIcon}
        <h3 className="heading-m">
          {user.etunimi} {user.sukunimi}
        </h3>
      </Flex>
      <Text tag="p">{user.sahkoposti}</Text>
      <Text tag="p" spacingBottom="s">
        {user.puhelinnumero}
      </Text>
      {children}
    </Card>
  );
}

export default UserCard;
