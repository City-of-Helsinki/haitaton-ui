import React from 'react';
import { useTranslation } from 'react-i18next';

type Props = {
  id: string;
};

const T: React.FC<Props> = ({ id }) => {
  const { t } = useTranslation();
  return <>{t(id)}</>;
};

export default T;
