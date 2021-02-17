# Crew Mates

Robust set of scripts to automagically manage, deploy, and keep alive mission-critical applications.

## Dependencies

- [curl](https://github.com/curl/curl)
- [git](https://github.com/git/git)
- [sed](https://github.com/mirror/sed)
- [jq](https://github.com/stedolan/jq)
- [node (npm)](https://github.com/nodejs/node)
- [yarn](https://github.com/yarnpkg/yarn)
- [tar](https://github.com/Distrotech/tar)

## Install

```
curl -o- https://raw.githubusercontent.com/GreenCubeIO/crew-mates/12021-02-17/install.sh | bash
```

## About this project

Where you, as a developer, are the "Ship Master", these are your `crew-mates`:

### `chiefmate`

> The chief mate is the second-in-command (sometimes called the first officer or "Number One")

Responsibilities:

- Keep track of the latest version of an app that has been deployed
- Download latest deployed version of an app
- Make sure of the integrity of the downloaded app
- Keep track of the latest version of large "project cargo" (vendor files) the app may depend on
- Download latest deployed version of project cargo
- Make sure of the integrity of the downloaded project cargo
- Unpack the app and project cargo
- Stop the currently running instance of the app and replace with latest deployed version
- Periodically ensure the application is running
- If application becomes unresponsive, try to revive it

### `hostler`

> A tractor for moving containers within a yard

- Handles getting/putting packages either from/into a custom file servers or as AWS S3 bucket

### `consolidator`

> The one that consolidates (combines) cargo from a number of shippers into a container that will deliver the goods

Responsibilities:

- Download the app's repository
- Install dependencies
- Build the app
- Consolidate the build and dependencies into a single package
- Generate a checksum of the consolidated package
- Invoke the hostler to deliver the consolidated package and checksum to its appropriately named destination
- Announce the version of the consolidated package as the latest deployed version

### `stevedore`

> Dock workers who perform administrative tasks associated with the loading or unloading of vendor cargo

Responsibilities:

- Bundle large third-party dependencies into a single project cargo package
- Generate a checksum of the bundled project cargo
- Invoke the hostler to deliver the bundled project cargo and checksum to its appropriately named destination
- Announce the version of the project cargo as the latest deployed version

## Usage

Your crew mates are here to do the heavy lifting, all they require to get started are a few environment variables.

To get started, `chiefmate`, `consolidator`, and `stevedore` depend on `hostler` for proper function,
as such the first env vars you should set up are:

```sh
PKGS_IN_S3

# If PKGS_IN_S3 is TRUE then set the following env vars:
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
AWS_DEFAULT_REGION
AWS_REGION

# Otherwise, you can optionally set the following env var
# if your file server requires an `Authorization` header
PKG_AUTH_HEADER # i.e. "Bearer 42-1a2b3cdefg"
```

### `chiefmate`

Environment variables:

```sh
# Required

APP_RESPONSE_TIMEOUT # in seconds, i.e. 40
CLUSTER_REGION # used for log output, i.e. us-east-2
CLUSTER_TYPE # used for log output, i.e. FARGATE
MAX_RETRIES # max number of tries to start/revive an app before exiting with non-zero code
PKG_NAME # name of the package, i.e. tha value of the "name" property in package.json
PKG_REPO_URL # url where to packages from (if using an s3 bucket, use the https version of the url)
PORT # local port your app will run on, i.e. 8000
STAGE # deployment stage, i.e. dev | staging | production

# Optional

API_TOKEN # sent as X-Api-Token header when ensuring app's alive (i.e. useful if app set to only respond to CloudFront)
API_HOST # sent as X-Forwarded-Host header when ensuring app's alive (i.e. useful if app set to only respond to CloudFront)
API_PROTOCOL # sent as X-Forwarded-Proto header when ensuring app's alive (i.e. useful if app set to only respond to CloudFront)
DEBUG # Enable debug messages, ONLY logs to stdout (never to comms.sh), defaults to false
HAS_PROJECT_CARGO # set to tue if chiefmate should also look for the app's third party dependency bundle
LOG_TIMEZONE # so as to not affect the timezone the app uses, but be able to accurately read logs and notifications
RUNTIME_PATH # path where app should be unpacked and run in
```

Then run:

```
chiefmate
```

This will download the app's package into either `/` or if you set it `$RUNTIME_PATH/`.

If you would like to get notifications as to the state of the app (one of: new version, starting,
stopping, started, unresponsive, revived), add a file named `comms.sh` in the runtime directory that
will recieve the log messages as the first and only parameter.

### `consolidator`

Environmetn variables:

```sh
# Required

PKG_REPO_URL # url where to packages from (if using an s3 bucket, use the https version of the url)
STAGE # deployment stage, i.e. dev | staging | production

# Optional

RUNTIME_PATH # path where app should be unpacked and run in
```

Then run:

```
consolidator
```

This will generate three files:

- `$PKG_NAME-[PKG_VERSION].tgz`: the package that chiefmate will download
- `$PKG_NAME-[PKG_VERSION].tgz.checksum`: the checksum chiefmate uses to verify the package integrity after download
- `$STAGE.version`: this is what chiefmate will look for to make sure it is running the latest version

These files will then be uploaded to the remote app-specific directory at `$PKG_REPO_URL/$PKG_NAME/`.

### `stevedore`

Environmetn variables:

```sh
# Required

PROJECT_CARGO_VERSION
PKG_REPO_URL # url where to packages from (if using an s3 bucket, use the https version of the url)
STAGE # deployment stage, i.e. dev | staging | production

# Optional

RUNTIME_PATH # path where app should be unpacked and run in
```

Then run:

```
stevedore
```

This will generate three files:

- `project-cargo-$PROJECT_CARGO_VERSION.tgz`: the package that chiefmate will download
- `project-cargo-$PROJECT_CARGO_VERSION.tgz.checksum`: the checksum chiefmate uses to verify the package integrity after download
- `$STAGE.project-cargo.version`: this is what chiefmate will look for to make sure it has the latest version of project cargo

These files will then be uploaded to the remote app-specific directory at `$PKG_REPO_URL/$PKG_NAME/`.

