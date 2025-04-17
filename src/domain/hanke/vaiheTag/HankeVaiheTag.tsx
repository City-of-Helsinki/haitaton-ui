import React from 'react';
import { Tag, TagTheme } from 'hds-react';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import { HANKE_VAIHE, HANKE_VAIHE_KEY } from '../../types/hanke';
import styles from './HankeVaiheTag.module.scss';

type TagProps = {
  tagName: HANKE_VAIHE_KEY | null;
  uppercase?: boolean;
};

const themes: Record<HANKE_VAIHE_KEY, TagTheme> = {
  [HANKE_VAIHE.OHJELMOINTI]: {
    '--background-color': 'var(--color-coat-of-arms-light)',
  },
  [HANKE_VAIHE.SUUNNITTELU]: {
    '--background-color': 'var(--color-brick-light)',
  },
  [HANKE_VAIHE.RAKENTAMINEN]: {
    '--background-color': 'var(--color-bus-light)',
  },
};

const HankeVaiheTag: React.FC<React.PropsWithChildren<TagProps>> = ({ tagName, uppercase }) => {
  const { t } = useTranslation();

  if (tagName === null || tagName === undefined) {
    return null;
  }

  return (
    <Tag
      theme={themes[tagName]}
      className={clsx({ [styles.uppercase]: uppercase })}
      placeholder={t('hankeForm:labels.vaihe')}
    >
      {t(`hanke:vaihe:${tagName}`)}
    </Tag>
  );
};

export default HankeVaiheTag;
