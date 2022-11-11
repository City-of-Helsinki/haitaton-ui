import React from 'react';
import { useTranslation } from 'react-i18next';
import Text from '../../../common/components/text/Text';
import FileInput from '../../../common/components/fileInput/FileInput';
import { FORMFIELD } from './types';

const HankeFormLiitteet: React.FC = () => {
  const { t } = useTranslation();

  return (
    <article>
      <Text tag="p" spacingBottom="l">
        {t('hankeForm:hankkeenLiitteetForm:instructions')}
      </Text>

      <FileInput
        name={FORMFIELD.LIITTEET}
        accept=".pdf,.jpeg,.png,.dgn,.dwg,.docx"
        multiple
        buttonLabel=""
        label={t('form:labels:selectFiles')}
      />
    </article>
  );
};

export default HankeFormLiitteet;
