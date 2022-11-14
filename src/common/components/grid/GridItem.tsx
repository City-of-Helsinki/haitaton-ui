import React from 'react';
import Text from '../text/Text';

type Props = {
  className?: string;
  title: string;
  content: string;
};

const GridItem: React.FC<React.PropsWithChildren<Props>> = ({ className, title, content }) => {
  return (
    <div className={className}>
      <Text tag="h3" styleAs="h6" weight="bold">
        {title}
      </Text>
      <Text tag="p" styleAs="body-m">
        {content}
      </Text>
    </div>
  );
};

export default GridItem;
