import { Application, HankkeenHakemus } from '../../application/types/application';
import hakemuksetData from './hakemukset-data';
import { isApplicationPending } from '../../application/utils';
import ApiError from '../apiError';

let hakemukset: Application[] = [...hakemuksetData];

export async function read(id: number) {
  return hakemukset.find((hakemus) => hakemus.id === id);
}

export async function readAll() {
  return hakemukset;
}

export async function readAllForHanke(hankeTunnus: string): Promise<HankkeenHakemus[]> {
  const applications = await readAll();
  return applications
    .filter((application) => application.hankeTunnus === hankeTunnus)
    .map((application) => {
      return {
        id: application.id,
        alluid: application.alluid,
        alluStatus: application.alluStatus,
        applicationIdentifier: application.applicationIdentifier,
        applicationType: application.applicationType,
        applicationData: {
          name: application.applicationData.name,
          startTime: application.applicationData.startTime,
          endTime: application.applicationData.endTime,
          pendingOnClient: isApplicationPending(application.alluStatus),
        },
      };
    });
}

export async function create(data: Application) {
  const newHakemus: Application = {
    ...data,
    id: hakemukset.length + 1,
    alluStatus: null,
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
  if (!isApplicationPending(hakemusToRemove.alluStatus)) {
    throw new ApiError(`Application can not be cancelled`, 409);
  }
  hakemukset = hakemukset.filter((hakemus) => hakemus.id !== id);
}
