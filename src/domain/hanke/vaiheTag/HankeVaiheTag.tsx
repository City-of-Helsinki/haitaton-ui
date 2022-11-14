import React from 'react';
import { Tag } from 'hds-react';
import { HANKE_VAIHE, HANKE_VAIHE_KEY } from '../../types/hanke';

type TagProps = {
  tagName: HANKE_VAIHE_KEY;
};

const themes = {
  [HANKE_VAIHE.OHJELMOINTI]: {
    '--tag-background': 'var(--color-engel)',
  },
  [HANKE_VAIHE.SUUNNITTELU]: {
    '--tag-background': 'var(--color-summer)',
  },
  [HANKE_VAIHE.RAKENTAMINEN]: {
    '--tag-background': 'var(--color-copper)',
  },
};

const HankeVaiheTag: React.FC<React.PropsWithChildren<TagProps>> = ({ tagName }) => {
  return <Tag theme={themes[tagName]}>{tagName}</Tag>;
};

export default HankeVaiheTag;
