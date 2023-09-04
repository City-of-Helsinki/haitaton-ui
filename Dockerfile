FROM node:16-alpine as staticbuilder
COPY . /builder/
WORKDIR /builder
RUN yarn && yarn cache clean --force
RUN REACT_APP_DISABLE_SENTRY=0 yarn build

FROM nginx:stable
EXPOSE 8000
COPY --from=staticbuilder ./builder/build /usr/share/nginx/html
COPY --from=staticbuilder ./builder/nginx/nginx.conf /etc/nginx/nginx.conf
WORKDIR /usr/share/nginx/html

# Create the environment file so that the user that will run the backend has
# permission to overwrite the config based on environment variables.
RUN touch env-config.js
RUN chmod a+rw env-config.js

# Copy default environment config and setup script
# Copy package.json so env.sh can read it
COPY --from=staticbuilder ./builder/scripts/env.sh /opt/env.sh
COPY --from=staticbuilder ./builder/.env /opt/.env
COPY --from=staticbuilder ./builder/package.json /opt/package.json
RUN chmod +x /opt/env.sh

ENV REACT_APP_DISABLE_SENTRY=0

CMD ["/bin/bash", "-c", "/opt/env.sh /opt /usr/share/nginx/html && nginx -g \"daemon off;\""]
