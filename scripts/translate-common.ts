#!/usr/bin/env ts-node-script
import _ from 'lodash';

import sv from '../src/locales/sv.json';
import en from '../src/locales/en.json';

export type LocaleMap = { [key: string]: any };
export type ResultMap = {
  [key: string]: { path: string; fi: string | number; sv: string | number; en: string | number };
};

export function traverse(path: string[], source: any, result: ResultMap) {
  if (_.isString(source)) {
    const mpath = _.join(path, '.');
    result[mpath] = {
      path: mpath,
      fi: source as string,
      sv: _.get(sv, mpath),
      en: _.get(en, mpath),
    };
  } else if (_.isNumber(source)) {
    const mpath = _.join(path, '.');
    result[mpath] = {
      path: mpath,
      fi: source as number,
      sv: source as number,
      en: source as number,
    };
  } else if (_.isArray(source)) {
    (source as Array<any>).forEach((item, index) => {
      traverse([...path, index.toString()], item, result);
    });
  } else if (_.isObject(source)) {
    for (const key in source) {
      traverse([...path, key], (source as LocaleMap)[key], result);
    }
  } else {
    throw new Error('Unknown type of ');
  }
}

export function flatToDeep(source: ResultMap, locale: 'fi' | 'sv' | 'en'): LocaleMap {
  const result: LocaleMap = {};
  for (const val of _.values(source)) {
    _.set(result, val.path, val[locale]);
  }
  return result;
}
