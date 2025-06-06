import {
  Application,
  HankkeenHakemus,
  JohtoselvitysCreateData,
  JohtoselvitysData,
  JohtoselvitysUpdateData,
  KaivuilmoitusCreateData,
  KaivuilmoitusData,
  KaivuilmoitusUpdateData,
} from '../../application/types/application';
import hakemuksetData from './hakemukset-data';
import { isApplicationPending } from '../../application/utils';
import ApiError from '../apiError';
import { cloneDeep } from 'lodash';
import { faker } from '@faker-js/faker';
import { Taydennys } from '../../application/taydennys/types';
import { Muutosilmoitus } from '../../application/muutosilmoitus/types';

let hakemukset: Application[] = [...hakemuksetData];

export async function read(id: number) {
  return hakemukset.find((hakemus) => hakemus.id === id);
}

async function readTaydennys(id: string) {
  return hakemukset.find((hakemus) => hakemus.taydennys?.id === id);
}

async function readMuutosilmoitus(id: string) {
  return hakemukset.find((hakemus) => hakemus.muutosilmoitus?.id === id);
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
          areas: application.applicationData.areas,
        },
      };
    });
}

export async function createJohtoselvitys(data: Application) {
  const newHakemus: Application = {
    ...data,
    id: hakemukset.length + 1,
    alluStatus: null,
  };
  hakemukset.push(newHakemus);
  return newHakemus;
}

export async function create(data: JohtoselvitysCreateData | KaivuilmoitusCreateData) {
  const { hankeTunnus, ...updateData } = data;
  const restData = {
    areas: [],
    startTime: null,
    endTime: null,
    customerWithContacts: null,
    contractorWithContacts: null,
    propertyDeveloperWithContacts: null,
    representativeWithContacts: null,
  };
  if (updateData.applicationType === 'CABLE_REPORT') {
    const newHakemus: Application<JohtoselvitysData> = {
      id: hakemukset.length + 1,
      alluStatus: null,
      hankeTunnus,
      applicationType: updateData.applicationType,
      applicationData: {
        ...(updateData as JohtoselvitysUpdateData),
        ...restData,
      },
    };
    hakemukset.push(newHakemus);
    return newHakemus;
  } else if (updateData.applicationType === 'EXCAVATION_NOTIFICATION') {
    const newHakemus: Application<KaivuilmoitusData> = {
      id: hakemukset.length + 1,
      alluStatus: null,
      hankeTunnus,
      applicationType: updateData.applicationType,
      applicationData: {
        ...(updateData as KaivuilmoitusUpdateData),
        ...restData,
      },
    };
    hakemukset.push(newHakemus);
    return newHakemus;
  } else {
    throw new Error(`Invalid application type ${updateData.applicationType}`);
  }
}

export async function update(id: number, updates: JohtoselvitysUpdateData) {
  const hakemus = await read(id);
  if (!hakemus) {
    throw new Error(`No application with id ${id}`);
  }
  hakemus.applicationData = Object.assign(hakemus.applicationData, updates);
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

export async function sendHakemus(id: number) {
  const hakemus = await read(id);
  if (!hakemus) {
    throw new ApiError(`No application with id ${id}`, 404);
  }
  const updatedHakemus = cloneDeep(hakemus);
  updatedHakemus.alluStatus = 'PENDING';
  return updatedHakemus;
}

export async function reportOperationalCondition(id: number) {
  const hakemus = await read(id);
  if (!hakemus) {
    throw new ApiError(`No application with id ${id}`, 404);
  }
  const updatedHakemus = cloneDeep(hakemus);
  updatedHakemus.alluStatus = 'OPERATIONAL_CONDITION';
  return updatedHakemus;
}

export async function createTaydennys(id: number) {
  const hakemus = await read(id);
  if (!hakemus) {
    throw new ApiError(`No application with id ${id}`, 404);
  }
  const taydennys: Taydennys<JohtoselvitysData | KaivuilmoitusData> = {
    id: faker.string.uuid(),
    applicationData: cloneDeep(hakemus.applicationData),
    muutokset: [],
    liitteet: [],
  };
  hakemus.taydennys = taydennys;
  return taydennys;
}

export async function updateTaydennys(
  id: string,
  updates: JohtoselvitysUpdateData | KaivuilmoitusUpdateData,
) {
  const hakemus = await readTaydennys(id);
  const taydennys = hakemus?.taydennys;
  if (!taydennys) {
    throw new ApiError(`No application with id ${id}`, 404);
  }
  taydennys.applicationData = Object.assign(taydennys.applicationData, updates);
  return taydennys;
}

export async function sendTaydennys(id: string) {
  const hakemus = await readTaydennys(id);
  if (!hakemus) {
    throw new ApiError(`No application with id ${id}`, 404);
  }
  const updatedHakemus = cloneDeep(hakemus);
  updatedHakemus.alluStatus = 'INFORMATION_RECEIVED';
  updatedHakemus.applicationData = hakemus.taydennys!.applicationData;
  updatedHakemus.taydennys = null;
  updatedHakemus.taydennyspyynto = null;
  return updatedHakemus;
}

export async function cancelTaydennys(id: string) {
  const hakemus = await readTaydennys(id);
  if (!hakemus) {
    throw new ApiError(`No application with id ${id}`, 404);
  }
  hakemus.taydennys = null;
}

export async function createMuutosilmoitus(id: number) {
  const hakemus = await read(id);
  if (!hakemus) {
    throw new ApiError(`No application with id ${id}`, 404);
  }
  const muutosilmoitus: Muutosilmoitus<JohtoselvitysData | KaivuilmoitusData> = {
    id: faker.string.uuid(),
    applicationData: cloneDeep(hakemus.applicationData),
    sent: null,
    muutokset: [],
    liitteet: [],
  };
  hakemus.muutosilmoitus = muutosilmoitus;
  return muutosilmoitus;
}

export async function updateMuutosilmoitus(
  id: string,
  updates: JohtoselvitysUpdateData | KaivuilmoitusUpdateData,
) {
  const hakemus = await readMuutosilmoitus(id);
  const muutosilmoitus = hakemus?.muutosilmoitus;
  if (!muutosilmoitus) {
    throw new ApiError(`No muutosilmoitus with id ${id}`, 404);
  }
  muutosilmoitus.applicationData = Object.assign(muutosilmoitus.applicationData, updates);
  return muutosilmoitus;
}

export async function cancelMuutosilmoitus(id: string) {
  const hakemus = await readMuutosilmoitus(id);
  const muutosilmoitus = hakemus?.muutosilmoitus;
  if (!muutosilmoitus) {
    throw new ApiError(`No muutosilmoitus with id ${id}`, 404);
  }
  hakemus.muutosilmoitus = null;
}

export async function sendMuutosilmoitus(id: string) {
  const hakemus = await readMuutosilmoitus(id);
  const muutosilmoitus = hakemus?.muutosilmoitus;
  if (!muutosilmoitus) {
    throw new ApiError(`No muutosilmoitus with id ${id}`, 404);
  }
  return muutosilmoitus;
}
