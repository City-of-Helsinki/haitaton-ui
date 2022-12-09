import React from 'react';
import { Button, IconCross, IconPen, IconPlusCircle, IconTrash, IconUser } from 'hds-react';
import { useTranslation } from 'react-i18next';
import Container from '../../../common/components/container/Container';
import Text from '../../../common/components/text/Text';
import { HankeDataDraft } from '../../types/hanke';
import styles from './HankeView.module.scss';

type Props = {
  hankeData?: HankeDataDraft;
  onEditHanke: () => void;
  onDeleteHanke: () => void;
};

const HankeView: React.FC<Props> = ({ hankeData, onEditHanke, onDeleteHanke }) => {
  const { t } = useTranslation();

  return (
    <article className={styles.hankeViewContainer}>
      <header className={styles.headerContainer}>
        <Container>
          <Text tag="h1" styleAs="h1" weight="bold">
            {hankeData?.nimi}
          </Text>
          <Text tag="h2" styleAs="h3" weight="bold" spacingBottom="l">
            {hankeData?.hankeTunnus}
          </Text>
          <Text tag="p" styleAs="body-s" weight="bold" spacingBottom="l">
            {t('hankePortfolio:labels:oikeudet')}:
          </Text>

          <div className={styles.buttonContainer}>
            <Button
              onClick={onEditHanke}
              variant="primary"
              iconLeft={<IconPen aria-hidden="true" />}
              theme="coat"
            >
              {t('hankeList:buttons:edit')}
            </Button>
            <Button variant="primary" iconLeft={<IconPlusCircle aria-hidden="true" />} theme="coat">
              {t('hankeList:buttons:addApplication')}
            </Button>
            <Button variant="primary" iconLeft={<IconUser aria-hidden="true" />} theme="coat">
              {t('hankeList:buttons:editRights')}
            </Button>
            <Button variant="primary" iconLeft={<IconCross aria-hidden="true" />} theme="black">
              {t('hankeList:buttons:endHanke')}
            </Button>
            <Button
              onClick={onDeleteHanke}
              variant="danger"
              iconLeft={<IconTrash aria-hidden="true" />}
            >
              {t('hankeList:buttons:delete')}
            </Button>
          </div>
        </Container>
      </header>

      <Container className={styles.contentContainer}>Content</Container>
    </article>
  );
};

export default HankeView;
