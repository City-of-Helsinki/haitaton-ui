import { HankeDataDraft } from '../../types/hanke';
import hankkeetData from './hankkeet-data';

const hankkeet = [...hankkeetData];

export async function read(hankeTunnus: string) {
  return hankkeet.find((hanke) => hanke.hankeTunnus === hankeTunnus);
}

export async function readAll() {
  return hankkeet;
}

export async function update(hankeTunnus: string, updates: HankeDataDraft) {
  let hanke = await read(hankeTunnus);
  if (!hanke) {
    throw new Error(`No hanke with hankeTunnus ${hankeTunnus}`);
  }
  hanke = { ...hanke, ...updates };
  return hanke;
}
