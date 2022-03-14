import MonoContext from "@simplyhexagonal/mono-context";

import { ChiefMateState, DeploymentJson } from '../interfaces';

export default async () => {
  const {
    logger,
    deploymentEndpoint,
    deploymentLocation,
    deploymentJsonFilename,
  } = MonoContext.getState<ChiefMateState>();

  logger.debug(`Fetching: ${deploymentLocation}/${deploymentJsonFilename}`);

  try {
    const {
      data,
    } = await deploymentEndpoint.get(deploymentJsonFilename);

    const remoteDeployment: DeploymentJson = data;

    logger.debug(remoteDeployment);

    MonoContext.setState({remoteDeployment});
  } catch (e: any) {
    logger.error(e.message);

    throw e;
  }
};
