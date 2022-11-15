#!/usr/bin/env ts-node-script

import _ from 'lodash';
import XLSX from 'xlsx';
import { ResultMap, traverse } from './translate-common';

import fi from '../src/locales/fi.json';

function write_file(result: ResultMap) {
  const worksheet = XLSX.utils.json_to_sheet([..._.values(result)]);

  const book = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(book, worksheet);
  worksheet['!cols'] = [{ wch: 80 }];
  XLSX.writeFile(book, 'locale_export.xlsx');
}

function run() {
  const result: ResultMap = {};
  traverse([], fi, result);
  write_file(result);
}

run();
