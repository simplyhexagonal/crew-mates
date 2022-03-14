import MonoContext from "@simplyhexagonal/mono-context";

import { sleep } from "../../utils";
import getDeploymentJson from "../getDeploymentJson";
import { ChiefMateState, DeploymentJson } from '../interfaces';

const appIsResponsive = () => {
  const {
    checkResponseRetries,
    maxCheckResponseRetries,
  } = MonoContext.getState<ChiefMateState>();

  return checkResponseRetries < maxCheckResponseRetries;
}

export default async () => {
  const {
    logger,
    loopDelay,
  } = MonoContext.getState<ChiefMateState>();

  while (
    appIsResponsive()
  ) {
    const {
      firstRun,
    } = MonoContext.getState<ChiefMateState>();

    MonoContext.setState({
      shouldRestartApp: false,
    });

    try {
      await getDeploymentJson();
    } catch (e) {
      if (MonoContext.getStateValue('firstRun')) {
        break;
      }
    }

    const {
      remoteDeployment,
      localDeployment,
    } = MonoContext.getState<ChiefMateState>();

    const {
      app: remoteApp,
      projectCargo: remoteProjectCargo,
    } = remoteDeployment as DeploymentJson;

    const {
      app: localApp,
      projectCargo: localProjectCargo,
    } = localDeployment as DeploymentJson;

    if (
      firstRun
      || remoteApp.currentVersion !== localApp.currentVersion
    ) {
      logger.info('Deploying new version: ', remoteApp.currentVersion);

      
    }

    logger.debug(`Waiting ${loopDelay}ms...`);
    await sleep(loopDelay);
  }
};
