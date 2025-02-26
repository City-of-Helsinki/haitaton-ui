import { TaydennyspyyntoFieldKey, TaydennyspyyntoField } from './types';

const order = {
  [TaydennyspyyntoFieldKey.IDENTIFICATION_NUMBER]: 1,
  [TaydennyspyyntoFieldKey.WORK_DESCRIPTION]: 2,
  [TaydennyspyyntoFieldKey.APPLICATION_KIND]: 3,
  [TaydennyspyyntoFieldKey.CLIENT_APPLICATION_KIND]: 4,
  [TaydennyspyyntoFieldKey.POSTAL_ADDRESS]: 5,
  [TaydennyspyyntoFieldKey.GEOMETRY]: 6,
  [TaydennyspyyntoFieldKey.AREA]: 7,
  [TaydennyspyyntoFieldKey.START_TIME]: 8,
  [TaydennyspyyntoFieldKey.END_TIME]: 9,
  [TaydennyspyyntoFieldKey.CUSTOMER]: 10,
  [TaydennyspyyntoFieldKey.CONTRACTOR]: 11,
  [TaydennyspyyntoFieldKey.PROPERTY_DEVELOPER]: 12,
  [TaydennyspyyntoFieldKey.REPRESENTATIVE]: 13,
  [TaydennyspyyntoFieldKey.INVOICING_CUSTOMER]: 14,
  [TaydennyspyyntoFieldKey.ATTACHMENT]: 15,
  [TaydennyspyyntoFieldKey.PROPERTY_IDENTIFICATION_NUMBER]: 16,
  [TaydennyspyyntoFieldKey.OTHER]: 17,
};

export function sortTaydennyspyyntoFields(a: TaydennyspyyntoField, b: TaydennyspyyntoField) {
  return order[a.key] - order[b.key];
}
