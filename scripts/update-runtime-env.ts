#!/usr/bin/env ts-node-script

import * as path from 'path';
import fs from 'fs';
import util from 'util';
import dotenv from 'dotenv';

const isTest = process.env.TEST === 'true';
const configFile = isTest ? 'test-env-config.js' : 'env-config.js';
const envSuffix = isTest ? '.test' : '.development';

// Load .env files in priority order (later overrides earlier)
const envFiles = ['.env', `.env${envSuffix}`, '.env.local', `.env${envSuffix}.local`];
const raw: Record<string, string | undefined> = {
  NODE_ENV: isTest ? 'test' : 'development',
};

for (const file of envFiles) {
  const filePath = path.join(__dirname, '..', file);
  if (fs.existsSync(filePath)) {
    Object.assign(raw, dotenv.parse(fs.readFileSync(filePath)));
  }
}

// CI/CD: process.env takes highest priority
Object.keys(process.env)
  .filter((key) => key.startsWith('REACT_APP_') || key === 'NODE_ENV' || key === 'PUBLIC_URL')
  .forEach((key) => {
    raw[key] = process.env[key];
  });

const configurationFile = path.join(__dirname, '../public/', configFile);
fs.writeFileSync(configurationFile, 'window._env_ = ' + util.inspect(raw, false, 2, false));
console.log('File created!');
