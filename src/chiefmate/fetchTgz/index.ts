import MonoContext from "@simplyhexagonal/mono-context";
import { ChiefMateState, DeploymentJson } from "../interfaces";

export default async () => {
  const {
    logger,
    deploymentEndpoint,
    deploymentLocation,
    maxFetchAppRetries,
    remoteDeployment,
  } = MonoContext.getState<ChiefMateState>();

  const {
    name,
    app,
  } = remoteDeployment as DeploymentJson;

  logger.debug(`Fetching: ${deploymentLocation}/${name}-${app.currentVersion}.tgz`);
}
