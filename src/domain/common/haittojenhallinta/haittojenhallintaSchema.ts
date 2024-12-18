import yup from '../../../common/utils/yup';
import { FORM_PAGES } from '../../forms/types';
import { HAITTOJENHALLINTATYYPPI } from './types';

const haittojenhallintaSchema = yup.object({
  [HAITTOJENHALLINTATYYPPI.YLEINEN]: yup
    .string()
    .required()
    .meta({ pageName: FORM_PAGES.HAITTOJEN_HALLINTA }),
  [HAITTOJENHALLINTATYYPPI.PYORALIIKENNE]: yup
    .string()
    .detectedTrafficNuisance(HAITTOJENHALLINTATYYPPI.PYORALIIKENNE)
    .meta({ pageName: FORM_PAGES.HAITTOJEN_HALLINTA }),
  [HAITTOJENHALLINTATYYPPI.AUTOLIIKENNE]: yup
    .string()
    .detectedTrafficNuisance(HAITTOJENHALLINTATYYPPI.AUTOLIIKENNE)
    .meta({ pageName: FORM_PAGES.HAITTOJEN_HALLINTA }),
  [HAITTOJENHALLINTATYYPPI.RAITIOLIIKENNE]: yup
    .string()
    .detectedTrafficNuisance(HAITTOJENHALLINTATYYPPI.RAITIOLIIKENNE)
    .meta({ pageName: FORM_PAGES.HAITTOJEN_HALLINTA }),
  [HAITTOJENHALLINTATYYPPI.LINJAAUTOLIIKENNE]: yup
    .string()
    .detectedTrafficNuisance(HAITTOJENHALLINTATYYPPI.LINJAAUTOLIIKENNE)
    .meta({ pageName: FORM_PAGES.HAITTOJEN_HALLINTA }),
  [HAITTOJENHALLINTATYYPPI.MUUT]: yup
    .string()
    .required()
    .meta({ pageName: FORM_PAGES.HAITTOJEN_HALLINTA }),
});

export default haittojenhallintaSchema;
