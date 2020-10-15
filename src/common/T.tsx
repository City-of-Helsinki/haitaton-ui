import React from 'react';
import { useTranslation } from 'react-i18next';

type Props = {
  id: string;
};

const T: React.FC<Props> = (props) => {
  const { t } = useTranslation();
  return <>{t(props.id)}</>;
};

export default T;
