#!/usr/bin/env ts-node-script

import _ from 'lodash';
import ExcelJS from 'exceljs';
import { ResultMap, traverse } from './translate-common';

import fi from '../src/locales/fi.json';

async function write_file(result: ResultMap) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Sheet1');
  worksheet.columns = [
    { header: 'path', key: 'path', width: 80 },
    { header: 'fi', key: 'fi', width: 80 },
    { header: 'sv', key: 'sv', width: 80 },
    { header: 'en', key: 'en', width: 80 },
  ];
  worksheet.addRows(_.values(result));
  await workbook.xlsx.writeFile('locale_export.xlsx');
}

async function run() {
  const result: ResultMap = {};
  traverse([], fi, result);
  await write_file(result);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
