#!/usr/bin/env ts-node-script
import _ from 'lodash';

import sv from '../src/locales/sv.json';
import en from '../src/locales/en.json';

export type LocaleMap = { [key: string]: string | LocaleMap };
export type ResultMap = { [key: string]: { path: string; fi: string; sv: string; en: string } };

export function traverse(path: string[], source: LocaleMap, result: ResultMap) {
  for (const key in source) {
    if (_.isString(source[key])) {
      const mpath = _.join(path, '.') + '.' + key;
      result[mpath] = {
        path: mpath,
        fi: source[key] as string,
        sv: _.get(sv, mpath),
        en: _.get(en, mpath),
      };
    } else if (_.isObject(source[key])) {
      traverse([...path, key], source[key] as LocaleMap, result);
    } else {
      throw new Error('Unkown type of ');
    }
  }
}

export function flatToDeep(source: ResultMap, locale: 'fi' | 'sv' | 'en'): LocaleMap {
  const result: LocaleMap = {};
  for (const val of _.values(source)) {
    _.set(result, val.path, val[locale]);
  }
  return result;
}
