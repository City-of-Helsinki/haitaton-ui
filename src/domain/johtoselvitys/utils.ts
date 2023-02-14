import { findKey } from 'lodash';
import {
  CustomerType,
  isCustomerWithContacts,
  JohtoselvitysData,
} from '../application/types/application';

/**
 * Find the contact key that has orderer field true
 */
export function findOrdererKey(data: JohtoselvitysData): CustomerType {
  const ordererRole = findKey(data, (value) => {
    if (isCustomerWithContacts(value)) {
      return value.contacts[0]?.orderer;
    }
    return false;
  });

  return ordererRole as CustomerType;
}
