import React from 'react';
import HankeIndexes from '../../map/components/HankeSidebar/HankeIndexes';
import { HankeDataFormState } from './types';

type Props = {
  formData: HankeDataFormState;
};

const HankeFormHaitat: React.FC<Props> = ({ formData }) => {
  return <HankeIndexes hankeIndexData={formData.tormaystarkasteluTulos} />;
};

export default HankeFormHaitat;
