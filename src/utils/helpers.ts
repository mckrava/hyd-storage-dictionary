import lodashCamelCase from 'lodash.camelcase';
import { AppConfig } from '../appConfig';
import { NodeEnv } from './types';
import { join } from 'path';
import { hexToString } from '@polkadot/util';

const appConfig = AppConfig.getInstance();

export function isNotNullOrUndefined<T extends Object>(
  input: null | undefined | T
): input is T {
  return input != null;
}

export function getEnvPath(subPath: string): string {
  return appConfig.NODE_ENV === NodeEnv.DEV
    ? join(process.cwd(), 'src/', subPath)
    : join(process.cwd(), 'lib/', subPath);
}

export function hexToStrWithNullCharCheck(str?: string) {
  if (!str) return str;
  const decorated = hexToString(str);
  return decorated.includes('\0') ? str : decorated;
}