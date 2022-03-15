import React from 'react';
import { Accordion } from 'hds-react';
import styles from './GenericForm.module.scss';
import HankeIndexes from '../map/components/HankeSidebar/HankeIndexes';
import { HankeDataFormState } from '../hanke/edit/types';

type Props = {
  children: React.ReactNode;
  formData: HankeDataFormState;
  isSaving?: boolean;
};

const GenericForm: React.FC<Props> = ({ formData, isSaving }) => {
  return (
    <div className={styles.formWrapper}>
      <div className={styles.actions}>lomake action buttonit - poista, keskeytä ja tallenna</div>
      <Accordion heading="Haittaindeksit" card className={styles.index}>
        <HankeIndexes
          hankeIndexData={formData.tormaystarkasteluTulos}
          displayTooltip
          loading={isSaving}
        />
      </Accordion>
      <div className={styles.content}>Contettia tänne</div>
    </div>
  );
};

export default GenericForm;
