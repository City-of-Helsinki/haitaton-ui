import { uniqueId } from 'lodash';
import { Application } from '../../application/types/application';

const hakemukset: Application[] = [];

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
    throw new Error(`No hakemus with id ${id}`);
  }
  hakemus = Object.assign(hakemus, updates);
  return hakemus;
}
