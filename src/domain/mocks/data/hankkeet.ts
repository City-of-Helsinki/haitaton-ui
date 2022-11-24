import hankkeetData from './hankkeet-data';

const hankkeet = [...hankkeetData];

export async function read(hankeTunnus: string) {
  return hankkeet.find((hanke) => hanke.hankeTunnus === hankeTunnus);
}

export async function readAll() {
  return hankkeet;
}
