import { canHankeBeCancelled } from '../../hanke/edit/utils';
import { HankeDataDraft } from '../../types/hanke';
import ApiError from '../apiError';
import hankkeetData from './hankkeet-data';
import * as hakemuksetDB from './hakemukset';

let hankkeet = [...hankkeetData];

function generateHankeTunnus() {
  return `HAI22-${hankkeet.length + 1}`;
}

export async function read(hankeTunnus: string) {
  return hankkeet.find((hanke) => hanke.hankeTunnus === hankeTunnus);
}

export async function readAll() {
  return hankkeet;
}

export async function create(data: HankeDataDraft) {
  const newHanke: HankeDataDraft = {
    id: hankkeet.length + 1,
    hankeTunnus: generateHankeTunnus(),
    suunnitteluVaihe: null,
    tyomaaKatuosoite: '',
    tyomaaTyyppi: [],
    tyomaaKoko: null,
    alueet: [],
    ...data,
  };
  hankkeet.push(newHanke);
  return newHanke;
}

export async function update(hankeTunnus: string, updates: HankeDataDraft) {
  let hanke = await read(hankeTunnus);
  if (!hanke) {
    throw new Error(`No hanke with hankeTunnus ${hankeTunnus}`);
  }
  hanke = Object.assign(hanke, updates);
  return hanke;
}

export async function remove(hankeTunnus: string) {
  const hankeToRemove = await read(hankeTunnus);
  if (!hankeToRemove) {
    throw new ApiError(`No hanke with hankeTunnus ${hankeTunnus}`, 404);
  }
  const hakemukset = await hakemuksetDB.readAllForHanke(hankeTunnus);
  if (!canHankeBeCancelled(hakemukset)) {
    throw new ApiError('Hanke can not be cancelled as it has active applications', 409);
  }
  hankkeet = hankkeet.filter((hanke) => hanke.hankeTunnus !== hankeToRemove.hankeTunnus);
  return hankeToRemove;
}
