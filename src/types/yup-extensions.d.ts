import { Message } from 'yup';

declare module 'yup' {
  interface StringSchema {
    phone(message?: Message): this;
    businessId(message?: Message): this;
    uniqueEmail(): this;
  }
  interface CustomSchemaMetadata {
    pageName?: string | string[];
  }
}
