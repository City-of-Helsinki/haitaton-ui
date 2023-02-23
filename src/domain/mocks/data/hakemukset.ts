import { uniqueId } from 'lodash';
import { Application } from '../../application/types/application';
import hakemuksetData from './hakemukset-data';
import { canApplicationBeCancelled } from '../../application/utils';
import ApiError from '../apiError';

let hakemukset: Application[] = [...hakemuksetData];

export async function read(id: number) {
  return hakemukset.find((hakemus) => hakemus.id === id);
}

export async function readAll() {
  return hakemukset;
}

export async function create(data: Application) {
  const newHakemus: Application = {
    ...data,
    id: Number(uniqueId()),
  };
  hakemukset.push(newHakemus);
  return newHakemus;
}

export async function update(id: number, updates: Application) {
  let hakemus = await read(id);
  if (!hakemus) {
    throw new Error(`No application with id ${id}`);
  }
  hakemus = Object.assign(hakemus, updates);
  return hakemus;
}

export async function remove(id: number) {
  const hakemusToRemove = await read(id);
  if (!hakemusToRemove) {
    throw new ApiError(`No application with id ${id}`, 404);
  }
  if (!canApplicationBeCancelled(hakemusToRemove.alluStatus)) {
    throw new ApiError(`Application can not be cancelled`, 409);
  }
  hakemukset = hakemukset.filter((hakemus) => hakemus.id !== id);
}
