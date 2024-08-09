# Haitaton UI

Haitaton is a service owned by the city of Helsinki that supports the management and prediction of the adverse
effects of projects taking place within the urban area.

## Requirements

- Node 20.x
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

### `yarn build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn locales:export`

Exports frontend localizations into `locale_export.xlsx` for easier translation. Data is loaded
from `src/locales/`.

### `yarn locales:import`

Imports frontend localizations from `locale_export.xlsx`. Translations are merged on corresponding translation files
in `src/locales/`.

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

In the cloud instances, dev uses Helsinki AD identification while others use Suomi.fi.

### Windows Subsystem for Linux (WSL)

If you use WSL as your local development environment and you bump into pre-push validation errors
in `git push` that other developers (with e.g. Mac) do not have, you could try to set `WSL=true`
in your local environment, e.g. in `~/.huskyrc` (Husky git hooks automatically loads this file):

```
export WSL=true
```

This setting adds `--runInBand` parameter for Jest tests (see https://jestjs.io/docs/cli#--runinband).

## Git hooks

There are team-managed git hooks in the `.husky` -directory. To use these, husky must be enabled
once with `yarn prepare`. The command needs to be done only once.

## Excel for translations

You can export an Excel-file with current translations. This can then be sent to translators.

1. In the repository root, run the export script with `yarn locales:export`.
2. The translations are written to `locale_export.xlsx`.

After the translations are added to the Excel file, they can be imported back.

1. Place the translated file inside repository root. It needs to be named `locale_export.xlsx`.
2. Run the import script: `yarn locales:import`.
3. The translations in `/src/locales` are updated.

**NOTICE: If there are any `[TRANSLATION_PENDING]` texts, it means that a previously translated
text has a minor change and needs a new or additional translation.
This information needs to be passed alongside the Excel file to translators.**

## API mocking

`yarn start-msw` runs the app in development mode using MSW (Mock Service Worker)
to mock API. Definitions can be found in `src/domain/mocks`.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
