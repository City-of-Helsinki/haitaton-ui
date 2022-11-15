import React from 'react';
import { Tag } from 'hds-react';
import { HANKE_VAIHE, HANKE_VAIHE_KEY } from '../../types/hanke';

type TagProps = {
  tagName: HANKE_VAIHE_KEY;
};

const themes = {
  [HANKE_VAIHE.OHJELMOINTI]: {
    '--tag-background': 'var(--color-coat-of-arms-light)',
  },
  [HANKE_VAIHE.SUUNNITTELU]: {
    '--tag-background': 'var(--color-brick-light)',
  },
  [HANKE_VAIHE.RAKENTAMINEN]: {
    '--tag-background': 'var(--color-bus-light)',
  },
};

const HankeVaiheTag: React.FC<TagProps> = ({ tagName }) => {
  return <Tag theme={themes[tagName]}>{tagName}</Tag>;
};

export default HankeVaiheTag;
