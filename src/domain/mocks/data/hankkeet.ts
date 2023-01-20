import { HankeDataDraft } from '../../types/hanke';
import hankkeetData from './hankkeet-data';

const hankkeet = [...hankkeetData];

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
