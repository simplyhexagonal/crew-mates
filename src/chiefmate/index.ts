require('dotenv').config();

// @ts-ignore
import { version } from '../../package.json';

import Logger from '@simplyhexagonal/logger';
import MonoContext from '@simplyhexagonal/mono-context';
import axios from 'axios';

import mainLoop from './mainLoop';

import { ChiefMateState } from './interfaces';

const {
  PACKAGE_NAME,
  PACKAGE_REPO_URL,
  PACKAGE_REPO_TOKEN,
  CLUSTER_REGION,
  STAGE,
  RUNTIME_PATH,
  LOOP_DELAY,
  MAX_CHECK_RESPONSE_RETRIES,
  MAX_FETCH_APP_RETRIES,
  MAX_FETCH_PCARGO_RETRIES,
  MAX_APP_RESTART_RETRIES,
  APP_RESPONSE_TIMEOUT,
} = process.env;

export default async () => {
  const logger = new Logger({});

  const deploymentLocation = `${PACKAGE_REPO_URL}/${PACKAGE_NAME}`;

  const deploymentEndpoint = axios.create({
    baseURL: deploymentLocation,
    headers: {
      'Referer': PACKAGE_REPO_TOKEN || '',
    },
  });

  MonoContext.setState<ChiefMateState>({
    logger,
    version,
    runtimePath: RUNTIME_PATH,
    deploymentLocation,
    deploymentEndpoint,
    deploymentJsonFilename: `deployment.${CLUSTER_REGION}.${STAGE}.json`,
    loopDelay: parseInt(LOOP_DELAY || '15000', 10),
    maxCheckResponseRetries: parseInt(MAX_CHECK_RESPONSE_RETRIES || '1', 10),
    maxFetchAppRetries: parseInt(MAX_FETCH_APP_RETRIES || '3', 10),
    maxFetchProjectCargoRetries: parseInt(MAX_FETCH_PCARGO_RETRIES || '3', 10),
    maxAppRestartRetries: parseInt(MAX_APP_RESTART_RETRIES || '3', 10),
    appResponseTimeout: parseInt(APP_RESPONSE_TIMEOUT || '120000', 10),
    checkResponseRetries: 0,
    fetchAppRetries: 0,
    fetchProjectCargoRetries: 0,
    appRestartRetries: 0,
    appStartTime: 0,
    firstRun: true,
    shouldRestartApp: false,
  });

  logger.info(`🚢 (v${version}) Chief Mate reporting to deck...`);

  // logger.debug(MonoContext.getState());

  await mainLoop();

  logger.error(
    `APP FAILED TO START AFTER ${MonoContext.getStateValue('appRestartRetries')} RETRIES: ${version}`
  );
};
