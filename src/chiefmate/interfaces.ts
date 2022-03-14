import Logger from '@simplyhexagonal/logger';
import { MonoContextState } from '@simplyhexagonal/mono-context';
import { AxiosInstance } from 'axios';

export interface DeploymentJson {
  name: string;
  app:{
    currentVersion: string;
    previousVersion: string;
  },
  projectCargo: {
    environment: {
      currentVersion: string;
      previousVersion: string;
    }
  },
  lastUpdated: string;
}

export interface ChiefMateState extends MonoContextState {
  logger: Logger;
  version: string;
  runtimePath: string;
  deploymentLocation: string;
  deploymentEndpoint: AxiosInstance;
  deploymentJsonFilename: string;
  remoteDeployment: DeploymentJson | undefined;
  localDeployment: DeploymentJson | undefined;
  loopDelay: number;
  maxCheckResponseRetries: number;
  maxFetchAppRetries: number;
  maxFetchProjectCargoRetries: number;
  maxAppRestartRetries: number;
  appResponseTimeout: number;
  checkResponseRetries: number;
  fetchAppRetries: number;
  fetchProjectCargoRetries: number;
  appRestartRetries: number;
  appStartTime: number;
  firstRun: boolean;
  shouldRestartApp: boolean;
}
