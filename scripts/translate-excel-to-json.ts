#!/usr/bin/env ts-node-script

import * as _ from 'lodash';
import XLSX from 'xlsx';
import { ResultMap, traverse, flatToDeep } from './translate-common';
import fs from 'fs';

import fi from '../src/locales/fi.json';

const file_fi = '../src/locales/fi.json';
const file_sv = '../src/locales/sv.json';
const file_en = '../src/locales/en.json';

function read_locales() {
  const file = XLSX.readFile('locale_export.xlsx');
  const data = XLSX.utils.sheet_to_json(file.Sheets[file.SheetNames[0]]);
  return _.keyBy(data, 'path');
}

function write_locales(result: ResultMap) {
  fs.writeFileSync(file_fi, JSON.stringify(flatToDeep(result, 'fi'), null, 2));
  fs.writeFileSync(file_sv, JSON.stringify(flatToDeep(result, 'sv'), null, 2));
  fs.writeFileSync(file_en, JSON.stringify(flatToDeep(result, 'en'), null, 2));
}

function run() {
  const original: ResultMap = {};
  traverse([], fi, original);
  const newData = read_locales();
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

run();
