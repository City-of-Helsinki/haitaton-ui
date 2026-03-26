#!/usr/bin/env ts-node-script

import _ from 'lodash';
import ExcelJS from 'exceljs';
import { ResultMap, traverse, flatToDeep } from './translate-common';
import fs from 'fs';

import fi from '../src/locales/fi.json';

const file_fi = 'src/locales/fi.json';
const file_sv = 'src/locales/sv.json';
const file_en = 'src/locales/en.json';

async function read_locales(): Promise<ResultMap> {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile('locale_export.xlsx');
  const worksheet = workbook.worksheets[0];
  const headers: string[] = [];
  const data: Array<{ path: string; fi: string; sv: string; en: string }> = [];
  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) {
      row.eachCell((cell) => headers.push(String(cell.value ?? '')));
    } else {
      const obj: { [key: string]: string | number } = {};
      row.eachCell((cell, colNumber) => {
        const value = cell.value;
        obj[headers[colNumber - 1]] =
          typeof value === 'number' ? value : String(value ?? '').replace(/\r\n/g, '\n');
      });
      data.push(obj as { path: string; fi: string; sv: string; en: string });
    }
  });
  return _.keyBy(data, 'path') as unknown as ResultMap;
}

function write_locales(result: ResultMap) {
  fs.writeFileSync(file_fi, JSON.stringify(flatToDeep(result, 'fi'), null, 2) + '\n');
  fs.writeFileSync(file_sv, JSON.stringify(flatToDeep(result, 'sv'), null, 2) + '\n');
  fs.writeFileSync(file_en, JSON.stringify(flatToDeep(result, 'en'), null, 2) + '\n');
}

function normalizeLineEndings(result: ResultMap): ResultMap {
  const normalized: ResultMap = {};
  for (const key in result) {
    const v = result[key];
    normalized[key] = {
      ...v,
      fi: typeof v.fi === 'string' ? v.fi.replace(/\r\n/g, '\n') : v.fi,
      sv: typeof v.sv === 'string' ? v.sv.replace(/\r\n/g, '\n') : v.sv,
      en: typeof v.en === 'string' ? v.en.replace(/\r\n/g, '\n') : v.en,
    };
  }
  return normalized;
}

async function run() {
  const original: ResultMap = normalizeLineEndings(
    (() => {
      const r: ResultMap = {};
      traverse([], fi, r);
      return r;
    })(),
  );
  const newData = await read_locales();
  const combined = _.merge(_.cloneDeep(original), newData);
  let updated = 0;

  for (const key in combined) {
    if (!newData[key]) {
      console.log('Ignoring new key:', key);
    } else if (!_.isEqual(original[key], combined[key])) {
      console.log('Updated key "' + key + '"', combined[key]);
      updated += 1;
    }
  }

  if (updated > 0) {
    write_locales(combined);
    console.log('Wrote', _.size(combined), 'translation keys');
  } else {
    console.log('No changes detected. Doing nothing.');
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
