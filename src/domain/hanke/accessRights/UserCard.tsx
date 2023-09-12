import React from 'react';
import { Card } from 'hds-react';
import { HankeUser } from '../hankeUsers/hankeUser';
import Text from '../../../common/components/text/Text';

type Props = {
  user: HankeUser;
  children?: React.ReactNode;
};

function UserCard({ user, children }: Props) {
  return (
    <Card border style={{ marginBottom: 'var(--spacing-m)' }}>
      <Text tag="h2" styleAs="h2" weight="bold" spacingBottom="s">
        {user.nimi}
      </Text>
      <Text tag="p" spacingBottom="s">
        {user.sahkoposti}
      </Text>
      {children}
    </Card>
  );
}

export default UserCard;
