import { Message } from 'yup';

declare module 'yup' {
  interface StringSchema {
    phone(message?: Message): this;
  }
}
