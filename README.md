# Haitaton Beta UI

## Requirements

- Node 12.x
- Yarn
- Git
- Docker

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.<br />
Open [http://localhost:3001](http://localhost:3001) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

First, scripts generate environment variables to `public/test-env-config.js`
with `scripts/update-runtime-env.ts`, which contains the actual used variables when running the app.
App is not using create-react-app's default `process.env` way to refer of variables
but `window._env_` object.

### 'yarn e2e'

Runs E2E cypress tests

### `yarn build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## Environment variables

Scripts generate first environment variables to `public/env-config.js` with
`scripts/update-runtime-env.ts`, which contains the actual used variables when running the app. App
is not using create-react-app's default `process.env` way to refer of variables but `window._env_`
object.

Note that running built application locally you need to generate also `public/env-config.js` file.
It can be done with `yarn update-runtime-env`. By default, it's generated for development
environment if no `NODE_ENV` is set.

For docker, the scripts/env.sh is added to the pod. This is run when the pod starts, and it writes
the env-config.js file, reading the values of the variables of the pod environment. It only
processes variables mentioned in `.env`. If there's no value for a variable in the environment, the
default value from `.env` is used.

### Login method

Haitaton supports either Helsinki AD or Suomi.fi identification for logging in. Currently only just
one at a time. This is controlled by the `REACT_APP_OIDC_CLIENT_ID` environment variable. To change
the identification method in the local environment, edit the `.env` -file.

- For Helsinki AD (default):
  `REACT_APP_OIDC_CLIENT_ID: 'haitaton-admin-ui-dev'`
- For Suomi.fi:
  `REACT_APP_OIDC_CLIENT_ID: 'haitaton-ui-dev'`

Then either rebuild the docker container or run `yarn update-runtime-env` as discussed above.

All cloud instances use Helsinki AD identification for now.

## API mocking

`yarn start-msw` runs the app in development mode using MSW (Mock Service Worker)
to mock API. Definitions can be found in `src/domain/mocks`.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
