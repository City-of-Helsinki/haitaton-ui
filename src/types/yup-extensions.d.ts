import { Message } from 'yup';
import { HAITTOJENHALLINTATYYPPI } from '../domain/types/hanke';

declare module 'yup' {
  interface StringSchema {
    phone(message?: Message): this;
    businessId(message?: Message): this;
    uniqueEmail(): this;
    detectedTrafficNuisance(type: HAITTOJENHALLINTATYYPPI): this;
  }
  interface CustomSchemaMetadata {
    pageName?: string | string[];
  }
}
